const dotEnv = require("dotenv");
const cors = require("cors");
const http = require("http"); // Import the HTTP module
const socketIO = require("socket.io"); // Import Socket.IO

dotEnv.config({ path: "./env/config.env" });
const connection = require("./db/connection");
const app = require("./app");
connection();

// Create an HTTP server using your Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    // credentials: true,
  },
});

// Create a global variable to hold the io instance
global.io = io;

// Define a connection event
io.on("connection", (socket) => {
  console.log("A user connected.");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
