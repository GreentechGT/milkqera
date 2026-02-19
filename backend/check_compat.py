import psycopg2
import sys

def check_compatibility():
    with open("results.txt", "w", encoding="utf-8") as f:
        try:
            f.write(f"Psycopg2 version: {psycopg2.__version__}\n")
            f.flush()
            
            conn = psycopg2.connect(
                dbname="milk_delivery_db",
                user="milk_user",
                password="milkqera",
                host="localhost",
                port="5432"
            )
            cur = conn.cursor()
            
            # Test 1: No PK
            try:
                cur.execute("CREATE TABLE test_nopk (id integer, name varchar(50));")
                f.write("✅ Created table without PK\n")
                cur.execute("DROP TABLE test_nopk;")
                conn.commit()
            except Exception as e:
                f.write(f"❌ Failed to create table without PK: {e}\n")
                conn.rollback()
            f.flush()

            conn.close()
                
        except Exception as e:
            f.write(f"❌ General Error: {e}\n")

if __name__ == "__main__":
    check_compatibility()
