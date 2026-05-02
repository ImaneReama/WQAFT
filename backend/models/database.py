import json
import os

DB_FILE = "database.json"

class Database:
    @staticmethod
    def load():
        if not os.path.exists(DB_FILE):
            return {"users": [], "requests": [], "messages": [], "interventions": []}
        with open(DB_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {"users": [], "requests": [], "messages": [], "interventions": []}

    @staticmethod
    def save(data):
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=4)
