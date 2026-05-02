from .database import Database

class RequestModel:
    @staticmethod
    def all():
        db = Database.load()
        return db["requests"]

    @staticmethod
    def create(request_data):
        db = Database.load()
        db["requests"].append(request_data)
        Database.save(db)
        return request_data

    @staticmethod
    def update(request_id, updates):
        db = Database.load()
        req = next((r for r in db["requests"] if r["id"] == request_id), None)
        if req:
            req.update(updates)
            Database.save(db)
        return req
