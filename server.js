const express = require("express");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3002;

let bots = {};

app.use(express.json());

const createBot = (token) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user.id) && message.guild !== null) return;

    console.log(`Received DM: ${message.content}`);
    const botId = client.user.id;

    try {
      const response = await axios.post("https://aismarttalk.tech/api/chat/discord", {
        botId,
        userId: message.author.id,
        userName: message.author.username,
        channelId: message.channel.id,
        message: message.content,
        language: "fr",
      });

      if (!response.data) {
        message.channel.send("No chat model found.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          message.channel.send("Agent not found.");
        } else if (error.response.status === 500) {
          message.channel.send("An error occurred while calling the agent.");
        } else if (error.response.status === 429) {
          message.channel.send("Rate limit exceeded. Please try again later.");
        } else {
          message.channel.send("Error fetching chat model.");
        }
      } else {
        message.channel.send("Error fetching chat model.");
      }
    }
  });

  client.login(token)
    .then(() => {
      console.log("Bot logged in successfully.");
    })
    .catch((error) => {
      console.error("Error logging in:", error);
    });

  return client;
};

app.post("/add-bot", (req, res) => {
  const { token, botId } = req.body;

  if (!token || !botId) {
    return res.status(400).json({ error: "Token and botId are required" });
  }

  if (bots[botId]) {
    return res.status(400).json({ error: "Bot already exists" });
  }

  bots[botId] = createBot(token);
  res.status(200).json({ success: true });
});

app.post("/remove-bot", (req, res) => {
  const { botId } = req.body;

  if (!botId) {
    return res.status(400).json({ error: "botId is required" });
  }

  if (!bots[botId]) {
    return res.status(404).json({ error: "Bot not found" });
  }

  bots[botId].destroy();
  delete bots[botId];
  res.status(200).json({ success: true });
});

app.post("/send-message", async (req, res) => {
  const { botId, channelId, message } = req.body;

  if (!botId || !channelId || !message) {
    return res.status(400).json({ error: "botId, channelId and message are required" });
  }

  if (!bots[botId]) {
    return res.status(404).json({ error: "Bot not found" });
  }

  try {
    const channel = await bots[botId].channels.fetch(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    await channel.send(message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});