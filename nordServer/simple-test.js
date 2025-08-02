const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello Railway! Server is working! 🎉');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Simple server running on port ${PORT}`);
});
