from .database import Database

class MessageModel:
    @staticmethod
    def create(message_data):
        db = Database.load()
        if "messages" not in db:
            db["messages"] = []
        db["messages"].append(message_data)
        Database.save(db)
        return message_data
