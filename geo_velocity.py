"""
Project INDRA - Geo-Velocity Triangulation Engine
==========================================================
Compares two location signals for the same transaction (UPI app GPS vs.
telecom cell-tower ping), computes the great-circle distance between
them via the Haversine formula, derives an implied travel speed over a
fixed time delta, and flags transactions that imply physically
impossible travel.

Usage:
    python geo_velocity_engine.py \
        --input synthetic_transactions.csv \
        --output flagged_transactions.csv

This is a detection HEURISTIC for a hackathon prototype, not a
production fraud-decisioning system. Real deployments would need
proper timestamp deltas per signal (not a fixed assumption), signal
confidence/error radii, and human-in-the-loop review before any
account or transaction action is taken.
"""

import argparse
import math
from dataclasses import dataclass

import numpy as np
import pandas as pd

# ----------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------
EARTH_RADIUS_KM = 6371.0088          # mean Earth radius (IUGG value)
ASSUMED_DELTA_MINUTES = 2.0          # assumed time gap between the two pings
SPEED_THRESHOLD_KMH = 200.0          # above this implied speed -> FRAUD_ALERT / CRITICAL


@dataclass(frozen=True)
class GeoVelocityConfig:
    delta_minutes: float = ASSUMED_DELTA_MINUTES
    speed_threshold_kmh: float = SPEED_THRESHOLD_KMH
    earth_radius_km: float = EARTH_RADIUS_KM


# ----------------------------------------------------------------------
# Core math
# ----------------------------------------------------------------------
def haversine_distance_km(
    lat1: np.ndarray,
    lon1: np.ndarray,
    lat2: np.ndarray,
    lon2: np.ndarray,
    earth_radius_km: float = EARTH_RADIUS_KM,
) -> np.ndarray:
    """
    Vectorized Haversine great-circle distance between two sets of
    lat/long coordinates (in decimal degrees).

    Accepts scalars or numpy/pandas array-likes; returns distance in km.
    """
    lat1_r, lon1_r, lat2_r, lon2_r = map(np.radians, (lat1, lon1, lat2, lon2))

    dlat = lat2_r - lat1_r
    dlon = lon2_r - lon1_r

    a = np.sin(dlat / 2.0) ** 2 + np.cos(lat1_r) * np.cos(lat2_r) * np.sin(dlon / 2.0) ** 2
    a = np.clip(a, 0.0, 1.0)  # guard against fp drift pushing slightly outside [0,1]
    c = 2 * np.arcsin(np.sqrt(a))

    return earth_radius_km * c


def implied_speed_kmh(distance_km: np.ndarray, delta_minutes: float) -> np.ndarray:
    """Speed implied by covering `distance_km` in `delta_minutes`."""
    delta_hours = delta_minutes / 60.0
    return distance_km / delta_hours


# ----------------------------------------------------------------------
# Pipeline
# ----------------------------------------------------------------------
def score_transactions(df: pd.DataFrame, config: GeoVelocityConfig = GeoVelocityConfig()) -> pd.DataFrame:
    """
    Takes a DataFrame with upi_gps_lat/long and telecom_cell_lat/long
    columns and returns a copy with GEO_DISTANCE_KM, IMPLIED_SPEED_KMH,
    FRAUD_ALERT, and THREAT_LEVEL columns added.

    THREAT_LEVEL is a direct function of FRAUD_ALERT:
      - FRAUD_ALERT True  -> THREAT_LEVEL = "CRITICAL"
      - FRAUD_ALERT False -> THREAT_LEVEL = "NORMAL"

    The two stay in lockstep by construction, so there's no separate
    threshold to keep in sync. The "1 in 10" demo pacing this depends
    on is controlled upstream, in generate_dataset.py's ANOMALY_RATE
    (every injected anomaly is built to clear SPEED_THRESHOLD_KMH, so
    the injection rate IS the CRITICAL rate here).
    """
    required_cols = {
        "upi_gps_lat", "upi_gps_long",
        "telecom_cell_lat", "telecom_cell_long",
    }
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Input dataframe is missing required columns: {missing}")

    out = df.copy()

    out["GEO_DISTANCE_KM"] = haversine_distance_km(
        out["upi_gps_lat"].to_numpy(dtype=float),
        out["upi_gps_long"].to_numpy(dtype=float),
        out["telecom_cell_lat"].to_numpy(dtype=float),
        out["telecom_cell_long"].to_numpy(dtype=float),
        earth_radius_km=config.earth_radius_km,
    )

    out["IMPLIED_SPEED_KMH"] = implied_speed_kmh(
        out["GEO_DISTANCE_KM"].to_numpy(dtype=float),
        config.delta_minutes,
    )

    out["FRAUD_ALERT"] = out["IMPLIED_SPEED_KMH"] > config.speed_threshold_kmh
    out["THREAT_LEVEL"] = np.where(out["FRAUD_ALERT"], "CRITICAL", "NORMAL")

    out["GEO_DISTANCE_KM"] = out["GEO_DISTANCE_KM"].round(2)
    out["IMPLIED_SPEED_KMH"] = out["IMPLIED_SPEED_KMH"].round(2)

    return out


def summarize(df: pd.DataFrame) -> None:
    total = len(df)
    flagged = int(df["FRAUD_ALERT"].sum())
    counts = df["THREAT_LEVEL"].value_counts()
    rate = (flagged / total * 100) if total else 0.0
    print(f"Total transactions:  {total}")
    print(f"THREAT_LEVEL breakdown:")
    for level in ["CRITICAL", "NORMAL"]:
        n = int(counts.get(level, 0))
        print(f"  {level:9s} {n:4d} ({n/total*100:.1f}%)")
    if flagged:
        print(f"Max implied speed:      {df['IMPLIED_SPEED_KMH'].max():.1f} km/h")
        print(f"Median flagged speed:   {df.loc[df['FRAUD_ALERT'], 'IMPLIED_SPEED_KMH'].median():.1f} km/h")


# ----------------------------------------------------------------------
# CLI
# ----------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Project INDRA - Geo-Velocity Engine")
    parser.add_argument("--input", default="synthetic_transactions.csv", help="Input CSV path")
    parser.add_argument("--output", default="flagged_transactions.csv", help="Output CSV path")
    parser.add_argument("--delta-minutes", type=float, default=ASSUMED_DELTA_MINUTES)
    parser.add_argument("--speed-threshold", type=float, default=SPEED_THRESHOLD_KMH)
    args = parser.parse_args()

    config = GeoVelocityConfig(
        delta_minutes=args.delta_minutes,
        speed_threshold_kmh=args.speed_threshold,
    )

    df = pd.read_csv(args.input)
    scored = score_transactions(df, config)
    scored.to_csv(args.output, index=False)

    summarize(scored)
    print(f"\nWrote scored output -> {args.output}")


if __name__ == "__main__":
    main()