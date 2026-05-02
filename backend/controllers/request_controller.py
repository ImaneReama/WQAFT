import uuid
from datetime import datetime
from backend.models.request import RequestModel

class RequestController:
    @staticmethod
    def create_request(data):
        new_request = {
            "id": str(uuid.uuid4())[:8],
            **data,
            "status": "pending",
            "bids": [],
            "createdAt": datetime.now().isoformat()
        }
        return RequestModel.create(new_request)

    @staticmethod
    def add_bid(request_id, bid_data):
        requests = RequestModel.all()
        request = next((r for r in requests if r["id"] == request_id), None)
        if not request:
            return {"error": "Demande introuvable"}
        
        new_bid = {
            "id": str(uuid.uuid4())[:8],
            **bid_data,
            "createdAt": datetime.now().isoformat()
        }
        request["bids"].append(new_bid)
        RequestModel.update(request_id, {"bids": request["bids"]})
        return request

    @staticmethod
    def update_request(request_id, updates):
        return RequestModel.update(request_id, updates)
