import sys
import json
from backend.controllers.auth_controller import AuthController
from backend.controllers.request_controller import RequestController
from backend.controllers.diagnostic_controller import DiagnosticController
from backend.models.request import RequestModel
from backend.models.user import UserModel
from backend.models.message import MessageModel

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        return

    command = sys.argv[1]
    
    try:
        if command == "login":
            print(json.dumps(AuthController.login(sys.argv[2], sys.argv[3])))
        elif command == "register":
            print(json.dumps(AuthController.register(json.loads(sys.argv[2]))))
        elif command == "create_request":
            print(json.dumps(RequestController.create_request(json.loads(sys.argv[2]))))
        elif command == "add_bid":
            print(json.dumps(RequestController.add_bid(sys.argv[2], json.loads(sys.argv[3]))))
        elif command == "get_requests":
            print(json.dumps(RequestModel.all()))
        elif command == "get_mechanics":
            print(json.dumps(UserModel.get_all_mechanics()))
        elif command == "save_message":
            print(json.dumps(MessageModel.create(json.loads(sys.argv[2]))))
        elif command == "diagnostic":
            print(json.dumps(DiagnosticController.analyze(sys.argv[2])))
        elif command == "update_request":
            print(json.dumps(RequestController.update_request(sys.argv[2], json.loads(sys.argv[3]))))
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
