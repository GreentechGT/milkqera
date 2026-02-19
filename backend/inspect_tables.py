import os
import django
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "milk_delivery_backend.settings")
django.setup()

def list_tables():
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        print("Existing tables:")
        if not tables:
            print("No tables found.")
        for table in tables:
            print(f"- {table[0]}")

if __name__ == "__main__":
    list_tables()
