import os
import sys
import django
from django.db import connections
from django.db.utils import OperationalError

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "milk_delivery_backend.settings")
django.setup()

def check_db_connection():
    db_conn = connections['default']
    try:
        c = db_conn.cursor()
        print(f"✅ Successfully connected to database: {db_conn.settings_dict['NAME']}")
        return True
    except OperationalError as e:
        print(f"❌ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ An error occurred: {e}")
        return False

if __name__ == "__main__":
    check_db_connection()
