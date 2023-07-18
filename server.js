const dotEnv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotEnv.config({ path: "./env/config.env" });
const connection = require("./db/connection");

connection();

const app = require("./app");

// Initializing express app, server and io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    //origin: "http://localhost:3000",
    origin: "https://k-track.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  },
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on ${port} port!`);
});
