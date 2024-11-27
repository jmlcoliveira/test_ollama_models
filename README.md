# test_ollama_models
Test Some Models in the Context of Investments

## Installation

1.  Clone the repository or download the files:
    ```bash
    git clone https://github.com/your-repo/chat-app.git
    ```
    ```bash
    cd chat-app
    ```

2.  Install the required Python packages:
    ```bash
    pip install flask flask-socketio
    ```

3.  Install Ollama server. Please check this page to download and install it: https://ollama.com/download


## Running the Application

1.	Start the Backend:
    Run the minimal_webservers.py file:
    ```bash
    python minimal_webservers.py
    ```
    By default, the server will run on http://127.0.0.1:5000.

2. Choose the model to use in the dropdown. Currently this are the supported models:
    * llama3.2
    * llama3.2-vision [selected by default]
    