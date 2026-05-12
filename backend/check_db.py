import asyncio
import sqlite3
import pandas as pd

def check_db():
    conn = sqlite3.connect('e:/Project/hackthon/backend/afterhours.db')
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("--- Tables in Database ---")
    for table in tables:
        print(f"- {table[0]}")
    
    print("\n--- Data Samples ---")
    for table in tables:
        try:
            df = pd.read_sql_query(f"SELECT * FROM {table[0]} LIMIT 2", conn)
            print(f"\nTable: {table[0]}")
            print(df)
        except Exception as e:
            print(f"Error reading {table[0]}: {e}")
            
    conn.close()

if __name__ == "__main__":
    check_db()
