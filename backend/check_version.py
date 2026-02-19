import psycopg2
from psycopg2 import OperationalError
import sys

def check_version():
    try:
        conn = psycopg2.connect(
            dbname="milk_delivery_db",
            user="milk_user",
            password="milkqera",
            host="localhost",
            port="5432"
        )
        print("✅ Connected")
        
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        print(f"✅ Version: {version}")
        
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_version()
