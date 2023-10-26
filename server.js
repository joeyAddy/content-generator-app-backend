const dotEnv = require("dotenv");
const cors = require("cors");

dotEnv.config({ path: "./env/config.env" });
const connection = require("./db/connection");
const app = require("./app");
connection();

app.use(
  cors({
    origin: "*",
    // "https://k-track.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  })
);

const port = process.env.PORT || 3000;
// app.listen(port, () => {
app.listen(port, () => {
  console.log(`server is running on ${port} port!`);
});
