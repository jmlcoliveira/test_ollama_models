from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit, disconnect
import os

class ChatApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app)
        self.dir_path = os.path.dirname(os.path.realpath(__file__))
        self.clients = {}

        self.app.route('/')(self.home)
        self.app.route('/send_message', methods=['POST'])(self.send_message)
        self.socketio.on_event('connect', self.handle_connect)
        self.socketio.on_event('disconnect', self.handle_disconnect)
        self.socketio.on_event('message', self.handle_message)

    def home(self):
        return render_template('chat.html')

    def send_message(self):
        user_message = request.form['message']
        response_message = self.process_message(user_message)
        return jsonify({'response': response_message})

    def process_message(self, message):
        print(request.form)
        return f'You said: {message}'

    def handle_connect(self):
        self.clients[request.sid] = request.remote_addr
        print(f'Client connected: {request.sid} from {request.remote_addr}')
        emit('response', {'response': 'Hello, I will be your investment advisor.'})

    def handle_disconnect(self):
        if request.sid in self.clients:
            print(f'Client disconnected: {request.sid}')
            del self.clients[request.sid]

    def handle_message(self, message):
        response_message = self.process_message(message)
        emit('response', {'response': response_message}, broadcast=True)

    def run(self, debug=True):
        self.socketio.run(self.app, debug=debug)

if __name__ == '__main__':
    chat_app = ChatApp()
    chat_app.run()