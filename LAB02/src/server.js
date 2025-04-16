const express = require('express');
const app = express();
const port = 80;

// Default welcome page
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Time API</h1>
        <p>This server provides the current time in JSON format.</p>
        <p>Endpoints:</p>
        <ul>
            <li><a href="/time">/time</a> - Returns the current time in ISO 8601 format.</li>
        </ul>
        <p>Server is running on port ${port}.</p>
    `);
});

// Time endpoint
app.get('/time', (req, res) => {
    const currentTime = new Date().toISOString();
    res.json({ time: currentTime });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});