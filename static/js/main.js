let conversationHistory = [
{
    role: "system",
    content: "You are an investment advisor. Your task is to create the user investor profile and then provide investment advice based on the user's profile. In this task, you will be interacting with the user to gather information about their financial situation, investment goals, and risk tolerance. You will then use this information to recommend an investment strategy that aligns with the user's goals and risk tolerance."
},
{
    role: "system",
    content: "You must ask this questions to the user and only continue to the next when the user has answered the question. If the user asks to skip or that he doesn't know how to answer, you should explain him better the question. You are not allowed under any circustances to move to a new question until you have gathered the answer the the question. Q1. What is your current age? Q2. What is your annual income (after taxes)? Q3. Do you have any existing savings or investments?"
},
{
    role: "assistant",
    content: "Hello, I will be your investment advisor. I will ask you a series of questions to gather information about your financial situation, investment goals, and risk tolerance. Based on this information, I will provide you with investment advice. Let's get started!"
}
];

async function handle_user_input() {
const userInput = document.getElementById('userInput').value;
const chatbox = document.getElementById('chatbox');
const image = document.getElementById('imgupload').files[0];

if (!userInput && !image) {
    return; // Do nothing if no input or image
}

let payload = {
    model: document.getElementById('dropdownMenuButton').textContent.split(': ')[1] || 'llama3.2-vision',
    messages: conversationHistory,
    stream: true, // Enable streaming
};

// Display user's message in chatbox
if (userInput != '') {
    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${userInput}`;
    userMessage.className = 'user-message';
    chatbox.appendChild(userMessage);

    if(!image) conversationHistory.push({ role: 'user', content: userInput });

    if (image) {
        displayImage(image);

        const base64Image = await convertImageToBase64(image);
        payload.messages.push({ role: 'user', content: userInput, images: [base64Image] });
        const previewImage = document.getElementById('previewImage');
        prevImage.remove();
        image_remove();
    }
}

if (image && userInput=='') {
    displayImage(image);

    const previewImage = document.getElementById('previewImage');
    prevImage.remove();

    const base64Image = await convertImageToBase64(image);
    payload.messages.push({ role: 'user', content: "Explain this image", images: [base64Image] });
    image_remove(); // Clear the image input
}

// Create a placeholder for the bot response with fading dots
const botMessage = document.createElement('div');
botMessage.className = 'bot-message';
botMessage.textContent = 'Assistant: Thinking';
chatbox.appendChild(botMessage);
chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom

// Start the fading dots animation
let dots = '';
const dotsInterval = setInterval(() => {
    dots = dots.length < 3 ? dots + '.' : ''; // Cycle through '.', '..', '...'
    botMessage.textContent = `System: Thinking${dots}`;
}, 500);


// Clear user input
document.getElementById('userInput').value = '';

var sendButton = document.getElementById('sendBtn');
sendButton.disabled = true;

// Call the Ollama API with streaming enabled
const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
});

clearInterval(dotsInterval);

if (!response.ok) {
    console.error('Error with the Ollama API:', response.statusText);
    botMessage.textContent = 'System: An error occurred. Please try again.';
    return;
}

const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');

//let botMessage = document.createElement('div');
//botMessage.className = 'bot-message';
//chatbox.appendChild(botMessage);
botMessage.innerHTML = 'Assistant: ';

let isDone = false;

let assistantMessage = '';

while (!isDone) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true }).trim();

    //console.log(chunk);

    // Split the chunk in case it contains multiple JSON objects
    const messages = chunk.split(/\r?\n/); // Split by newline for streaming

    for (const message of messages) {
        if (message) {
            try {
                const json = JSON.parse(message);
                if (json.message && json.message.content) {
                    botMessage.innerHTML = renderContentWithFormatting(botMessage.innerHTML+json.message.content);
                    assistantMessage += json.message.content;
                    //botMessage.textContent += json.message.content; // Append content to the bot message
                    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
                }
                isDone = json.done || false; // Update isDone based on the "done" field
            } catch (error) {
                console.error("Error parsing JSON chunk:", message, error);
            }
        }
    }
}

// Save the bot's final response in the conversation history
conversationHistory.push({ role: 'assistant', content: assistantMessage });
console.log(conversationHistory);
sendButton.disabled = false;
}

function image_remove() {
var input = document.getElementById('userInput');
input.value = '';
input.disabled = false;
var button_delete = document.getElementById('imageDelBtn');
button_delete.hidden = true;
var image = document.getElementById('imgupload').files[0];
if (image) {
    document.getElementById('imgupload').value = '';
}
}

var socket = io();

socket.on('response', function(data) {
var chatbox = document.getElementById('chatbox');
var botMessage = document.createElement('div');
botMessage.innerHTML = 'Assistant: ' + data.response;
botMessage.className = 'bot-message';
chatbox.appendChild(botMessage);
chatbox.scrollTop = chatbox.scrollHeight;
});

document.getElementById('OpenImgupload').onclick = function() {
document.getElementById('imgupload').click();
};

document.getElementById('imgupload').onchange = function() {
/*var image = document.getElementById('imgupload').files[0];
if (image) {
    var button_delete = document.getElementById('imageDelBtn');
    button_delete.hidden = false;
    var input = document.getElementById('userInput');
    //input.value = image.name;
    input.disabled = false;
}*/

const image = document.getElementById('imgupload').files[0];
const previewImage = document.getElementById('previewImage');

if (image) {
    // Create and display the image preview
    const imagePreview = document.createElement('img');
    imagePreview.src = URL.createObjectURL(image);
    imagePreview.style.maxWidth = '300px';
    imagePreview.style.maxHeight = '300px';
    //imagePreview.style.display = 'block';
    imagePreview.style.marginTop = '10px';
    imagePreview.id = 'prevImage';

    // Remove existing preview if any
    const existingPreview = document.getElementById('prevImage');
    if (existingPreview) {
        existingPreview.remove();
    }

    previewImage.appendChild(imagePreview);

    // Show the delete button and enable text input
    const buttonDelete = document.getElementById('imageDelBtn');
    buttonDelete.hidden = false;

    const input = document.getElementById('userInput');
    input.disabled = false;
}
};

function renderContentWithFormatting(content) {
// Replace `\n` with HTML line breaks
let formattedContent = content.replace(/\n/g, '<br>');

// Replace `**`-wrapped text with bold formatting
formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

return formattedContent;
}

document.getElementById('imageDelBtn').onclick = function() {
image_remove();
};

document.getElementById('sendBtn').onclick = function() {
handle_user_input();
};

document.getElementById('userInput').addEventListener('keyup', function(event) {
if (event.key === 'Enter' && !document.getElementById('sendBtn').disabled) {
    handle_user_input();
}
});

document.addEventListener('DOMContentLoaded', function () {
setDropdownName('llama3.2-vision');
});

// Function to convert an image to Base64
async function convertImageToBase64(file) {
return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the data URL prefix
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
});
}

function setDropdownName(optionName) {
document.getElementById('dropdownMenuButton').textContent = "Model: " + optionName;
}

function displayImage(image){
const imagePreview = document.createElement('img');
imagePreview.src = URL.createObjectURL(image);
imagePreview.style.maxWidth = '500px';
imagePreview.style.maxHeight = '500px';
imagePreview.style.display = 'block';
imagePreview.style.marginTop = '10px';
chatbox.appendChild(imagePreview);
}