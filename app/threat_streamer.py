import csv
import os

# Create an absolute path relative to this file's location
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "flagged_transactions.csv")

def get_fraud_alerts():
    alerts = []
    try:
        with open(CSV_PATH, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            # Filter and store in memory immediately to prevent I/O blocking
            alerts = [row for row in reader if row.get("FRAUD_ALERT") == "True"]
    except FileNotFoundError:
        print(f"Error: CSV not found at {CSV_PATH}")
    
    return alerts