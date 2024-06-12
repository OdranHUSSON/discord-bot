const express = require("express");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { default: axios } = require("axios");

const app = express();
const port = 3002;
const dotenv = require("dotenv");

// Initialize Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// When the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

app.use(express.json());

// When a new message is received
// Start of Selection
client.on("messageCreate", async (message) => {
  // filter bot messages
  if (message.author.bot) return;

  // answer only on direct mention or dm
  if (!message.mentions.has(client.user.id) && message.guild !== null) return;

  console.log(`Received DM: ${message.content}`);

  // Bot's user ID (assumed to be the bot ID for identification purposes)
  const botId = client.user.id;

  try {
    // Make a call to the Next.js API
    console.log('channelId', message.channel.id);
    const response = await axios.post(
      "http://localhost:3000/api/chat/discord",
      {
        botId,
        userId: message.author.id,
        userName: message.author.username,
        channelId: message.channel.id,
        message: message.content,
        language: "fr",
      }
    );

    if (response.data && response.data.chatModelName) {
      message.channel.send(`Chat Model Name: ${response.data.chatModelName}`);
    } else {
      message.channel.send("No chat model found.");
    }
  } catch (error) {    
    if (error.response) {
      if (error.response.status === 404) {
        message.channel.send("Agent not found.");
      } else if (error.response.status === 500) {
        message.channel.send("An error occurred while calling the agent.");
      } else {
        message.channel.send("Error fetching chat model.");
      }
    } else {
      message.channel.send("Error fetching chat model.");
    }
  }
});

app.post("/send-message", async (req, res) => {
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res
      .status(400)
      .json({ error: "channelId and message are required" });
  }

  try {
    const channel = await client.channels.fetch(channelId);
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
require("dotenv").config();

// Login to Discord with your app's token
if (!process.env.BOT_TOKEN) {
  console.error(
    "Error: BOT_TOKEN is not defined in the environment variables."
  );
  process.exit(1);
}

client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    console.log("Bot logged in successfully.");
  })
  .catch((error) => {
    console.error("Error logging in:", error);
    process.exit(1);
  });
