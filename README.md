# test_ollama_models
Test Some Models in the Context of Investments
<br>

<img width="1728" alt="Screenshot 2024-11-28 at 12 40 54" src="https://github.com/user-attachments/assets/f37067cc-c416-4bf7-9350-3e0fd8f9905f">


## Installation

1.  Clone the repository or download the files:
    ```bash
    git clone https://github.com/jmlcoliveira/test_ollama_models.git
    ```
    ```bash
    cd test_ollama_models
    ```

2.  Install the required Python packages:
    ```bash
    pip install flask flask-socketio
    ```

3.  Install Ollama server. Please check this page to download and install it: https://ollama.com/download


## Running the Application

1.	Start the Backend:
    Run the minimal_webserver.py file:
    ```bash
    python minimal_webservers.py
    ```
    By default, the server will run on http://127.0.0.1:5000.

2. Choose the model to use in the dropdown. <br>
   <img width="252" alt="Screenshot 2024-11-28 at 12 40 36" src="https://github.com/user-attachments/assets/3896a04b-06d4-411e-9ccf-95d3f398199a">

   Currently this are the supported models:

    * llama3.2
    * llama3.2-vision [selected by default]
    
