import uuid
from datetime import datetime
from backend.models.user import UserModel

class AuthController:
    @staticmethod
    def login(email, password):
        user = UserModel.find_by_email(email)
        if user and user["password"] == password:
            return user
        return {"error": "Identifiants invalides"}

    @staticmethod
    def register(data):
        if UserModel.find_by_email(data["email"]):
            return {"error": "Cet email existe déjà"}
        
        new_user = {
            "id": str(uuid.uuid4())[:8],
            **data,
            "name": f"{data.get('firstName', '')} {data.get('lastName', '')}",
            "createdAt": datetime.now().isoformat()
        }
        return UserModel.create(new_user)
