"""
Project INDRA - Synthetic Transaction Dataset Generator
==========================================================
Generates a synthetic CSV of UPI-style ATM withdrawal transactions
for prototyping a Geo-Velocity anomaly detector.

Each record contains two independent location signals for the SAME
transaction:
  - upi_gps_lat/long      : location reported by the payment app (spoofable)
  - telecom_cell_lat/long : location implied by cell-tower triangulation
                             (treated here as the harder-to-fake signal)

~15% of records are deliberately injected with a large gap between the
two signals to simulate "impossible travel" fraud patterns for testing
the detection engine downstream.

NOTE: All data is synthetic. No real subscriber, device, or transaction
data is used or represented here.
"""

import math
import random
import pandas as pd
from faker import Faker

# ----------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------
NUM_RECORDS = 1000
ANOMALY_RATE = 0.10
RANDOM_SEED = 42

# Pune, India — center point for normal (non-anomalous) traffic
CENTER_LAT = 18.5204
CENTER_LON = 73.8567

# Normal jitter: keeps both signals within a realistic few-km radius
# of each other and of Pune (representing legitimate local activity).
NORMAL_JITTER_KM = 3.0

# Anomaly jitter: forces the telecom ping far enough away that the
# implied travel speed becomes physically impossible in a 2-minute
# window (i.e., > 100 km separation, matching the ATM's own city or
# a distant one entirely).
ANOMALY_MIN_KM = 100.0
ANOMALY_MAX_KM = 450.0

fake = Faker("en_IN")
Faker.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

ATM_IDS = [f"ATM-PN-{str(i).zfill(4)}" for i in range(1, 51)]


def km_to_deg_lat(km: float) -> float:
    """Convert a north-south distance in km to degrees of latitude."""
    return km / 111.0


def km_to_deg_lon(km: float, at_lat: float) -> float:
    """Convert an east-west distance in km to degrees of longitude
    at a given latitude (longitude degrees shrink toward the poles)."""
    return km / (111.0 * math.cos(math.radians(at_lat)))


def random_offset(lat: float, lon: float, min_km: float, max_km: float):
    """Return a (lat, lon) point at a random distance/bearing from
    (lat, lon), within [min_km, max_km]."""
    distance_km = random.uniform(min_km, max_km)
    bearing = random.uniform(0, 2 * math.pi)

    delta_lat = km_to_deg_lat(distance_km) * math.cos(bearing)
    delta_lon = km_to_deg_lon(distance_km, lat) * math.sin(bearing)

    return lat + delta_lat, lon + delta_lon


def generate_transaction(txn_index: int, is_anomaly: bool) -> dict:
    # Base "true" location for this transaction — jittered around Pune
    base_lat, base_lon = random_offset(CENTER_LAT, CENTER_LON, 0, NORMAL_JITTER_KM)

    # UPI app-reported GPS: close to the base location (this is the
    # coordinate a fraudster would spoof, but we generate it near-truthful
    # for the app layer — the *telecom* signal is what diverges on anomalies)
    upi_lat, upi_lon = random_offset(base_lat, base_lon, 0, 1.0)

    if is_anomaly:
        # Telecom ping is forced far away -> "impossible travel"
        telecom_lat, telecom_lon = random_offset(
            upi_lat, upi_lon, ANOMALY_MIN_KM, ANOMALY_MAX_KM
        )
    else:
        # Telecom ping stays close to the UPI location -> normal case
        telecom_lat, telecom_lon = random_offset(upi_lat, upi_lon, 0, 1.5)

    return {
        "txn_id": f"TXN{100000 + txn_index}",
        "amount": round(random.uniform(500, 50000), 2),
        "upi_gps_lat": round(upi_lat, 6),
        "upi_gps_long": round(upi_lon, 6),
        "telecom_cell_lat": round(telecom_lat, 6),
        "telecom_cell_long": round(telecom_lon, 6),
        "timestamp": fake.date_time_between(start_date="-30d", end_date="now"),
        "target_atm_id": random.choice(ATM_IDS),
    }


def generate_dataset(num_records: int = NUM_RECORDS, anomaly_rate: float = ANOMALY_RATE) -> pd.DataFrame:
    num_anomalies = int(num_records * anomaly_rate)
    anomaly_flags = [True] * num_anomalies + [False] * (num_records - num_anomalies)
    random.shuffle(anomaly_flags)

    records = [
        generate_transaction(i, anomaly_flags[i])
        for i in range(num_records)
    ]

    df = pd.DataFrame(records)
    df = df.sort_values("timestamp").reset_index(drop=True)
    return df


if __name__ == "__main__":
    df = generate_dataset()
    output_path = "synthetic_transactions.csv"
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} synthetic transactions -> {output_path}")
    print(f"Columns: {list(df.columns)}")