const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post('/proxy', (req, res) => {
    const target = req.query.target;

    if (!target) {
        return res.status(400).send({ error: 'Missing target URL in query parameter' });
    }

    request.post(
        {
            url: target,
            json: req.body,
        },
        (error, response, body) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(response.statusCode).send(body);
            }
        }
    );
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});