const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const { v4: uuidv4 } = require("uuid");

// Add HTTP handler for health checks and CORS
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running");
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server ready - connect via WSS");
  }
});

const wsServer = new WebSocketServer({ server });
const port = process.env.PORT || 5555;

const connections = {}; // keep track of all connections (dictionary)
const users = {}; // keep track of all users (dictionary)

const broadcast = () => {
  // send data to all connected clients as soon as there is an update in state in websocket server
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    // Include UUID in the data structure for each user
    const usersWithUuid = Object.fromEntries(
      Object.entries(users).map(([id, userData]) => [
        id,
        { ...userData, uuid: id },
      ])
    );
    const message = JSON.stringify(usersWithUuid);
    connection.send(message);
  });
};

const handleMessage = (bytes, uuid) => {
  // when a client move cursor send message of cursor coordinates
  // message is the state payload from client
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];

  // If client sends UUID in message, verify it matches connection UUID
  if (message.uuid && message.uuid !== uuid) {
    console.warn(
      `UUID mismatch: connection ${uuid} sent message with UUID ${message.uuid}`
    );
  }

  // Remove UUID from state to avoid storing it redundantly
  const { uuid: msgUuid, ...stateData } = message;
  user.state = stateData; // Here state data include latitude and longitude

  broadcast();
  console.log(
    `${users[uuid].username} updated their state: ${JSON.stringify(user.state)}`
  );
};

const handleClose = (uuid) => {
  // when a client disconnects
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];

  broadcast();
};

// every time a client connects
wsServer.on("connection", (connection, request) => {
  const { username, uuid } = url.parse(request.url, true).query;
  // Use client-provided UUID or generate one as fallback
  const clientUuid = uuid || uuidv4();
  console.log(`${username} ${clientUuid} connected`);

  // broadcast (fan out) to all other clients that a new user has joined
  connections[clientUuid] = connection; // store the connection dictionary
  users[clientUuid] = {
    username,
    state: {
      latitude: 0,
      longitude: 0,
    },
  };

  connection.on("message", (message) => handleMessage(message, clientUuid));
  connection.on("close", () => handleClose(clientUuid));
});

// Add graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`WebSocket server is listening on port ${port}`);
});
