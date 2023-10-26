const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const userRouter = require("./router/userRouter");
const openai = require("openai");
const apiKey = process.env.OPENAI_API_KEY;

// Middleware
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// User Route
app.use("/api/user", userRouter);

app.post("/api/chatgpt", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
    });

    res.json({ text: response.choices[0].text });
    console.log(response.choices[0].text);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

module.exports = app;
