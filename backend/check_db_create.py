import os
import sys
import django
from django.db import connection, OperationalError

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "milk_delivery_backend.settings")
django.setup()

def check_db_creation():
    try:
        with connection.cursor() as cursor:
            print("Trying to create a test table...")
            cursor.execute("CREATE TABLE test_table (id serial PRIMARY KEY, name varchar(50));")
            print("✅ Successfully created test_table")
            cursor.execute("DROP TABLE test_table;")
            print("✅ Successfully dropped test_table")
            return True
    except OperationalError as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ An error occurred: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    check_db_creation()
