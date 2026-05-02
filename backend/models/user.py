from .database import Database

class UserModel:
    @staticmethod
    def find_by_email(email):
        db = Database.load()
        return next((u for u in db["users"] if u["email"] == email), None)

    @staticmethod
    def create(user_data):
        db = Database.load()
        db["users"].append(user_data)
        Database.save(db)
        return user_data

    @staticmethod
    def get_all_mechanics():
        db = Database.load()
        return [u for u in db["users"] if u.get("role") == "mecanicien"]
