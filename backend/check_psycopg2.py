import psycopg2
from psycopg2 import OperationalError

def check_psycopg2():
    try:
        conn = psycopg2.connect(
            dbname="milk_delivery_db",
            user="milk_user",
            password="milkqera",
            host="localhost",
            port="5432"
        )
        print("✅ Correctly connected with psycopg2")
        
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        print(f"✅ Database Version: {version}")

        print("Trying to create table without SERIAL...")
        cur.execute("CREATE TABLE test_simple (id integer PRIMARY KEY, name varchar(50));")
        print("✅ Table created successfully (no serial)")
        conn.commit() # Important!

        cur.execute("DROP TABLE test_simple;")
        print("✅ Table dropped successfully")
        conn.commit()

        print("Trying to create table with SERIAL...")
        cur.execute("CREATE TABLE test_serial (id serial PRIMARY KEY, name varchar(50));")
        print("✅ Table created successfully (with serial)")
        conn.commit()

        cur.execute("DROP TABLE test_serial;")
        print("✅ Table dropped successfully")
        conn.commit()
        
        conn.close()
        return True
    except OperationalError as e:
        print(f"❌ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    check_psycopg2()
