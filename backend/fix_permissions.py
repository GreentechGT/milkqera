import psycopg2
import sys

def fix_permissions():
    print("Attempting to connect as 'postgres' superuser...")
    try:
        # Try connecting as postgres user with no password (common local dev setup)
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        print("✅ Connected as postgres. Granting permissions...")
        cur.execute("GRANT ALL ON SCHEMA public TO milk_user;")
        print("✅ Permissions granted successfully to milk_user.")
        
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to connect as postgres without password: {e}")
        
    try:
        # Try connecting as postgres user with 'postgres' password
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        print("✅ Connected as postgres (password provided). Granting permissions...")
        cur.execute("GRANT ALL ON SCHEMA public TO milk_user;")
        print("✅ Permissions granted successfully to milk_user.")
        
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to connect as postgres with password 'postgres': {e}")
        return False

if __name__ == "__main__":
    if fix_permissions():
        print("✅ SUCCESS: Permissions fixed.")
        sys.exit(0)
    else:
        print("❌ FAILURE: Could not connect as superuser.")
        sys.exit(1)
