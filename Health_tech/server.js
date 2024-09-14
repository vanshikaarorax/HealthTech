const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const app = express();
expressWs(app);

app.use(express.static(path.join(__dirname, 'public')));

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    // Handle messages from the client if needed
  });

  // Send YOLO model or other initialization data to the client
  ws.send('Hello, client! Send your webcam frames for live detection.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
