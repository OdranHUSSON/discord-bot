# Discord PM2 API Tool

This tool allows you to start and manage Discord bots via an API and a configuration file. It leverages Docker and PM2 to ensure your bots are running smoothly and can be easily managed.

## Installation

### Prerequisites

- Docker: Make sure you have Docker installed on your machine. You can download it from [here](https://www.docker.com/products/docker-desktop).
- Docker Compose: This is typically included with Docker Desktop, but you can also install it separately if needed.
- Make: Ensure you have `make` installed on your system.

### Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/discord-pm2-api-tool.git
   cd discord-pm2-api-tool
   ```

2. **Install Docker network:**
   ```sh
   make install
   ```

3. **Start the services:**
   ```sh
   make start
   ```

4. **Stop the services:**
   ```sh
   make stop
   ```

## Configuration

### config.json

The `config.json` file is used to configure your Discord bots. You can start by copying the example configuration file:
```
{
  "initialBots": [
    {
      "token": "YOUR_BOT_TOKEN_1",
      "botId": "bot1",
      "apiEndpoint": "http://localhost:3000/api/chat/discord"
    },
    {
      "token": "YOUR_BOT_TOKEN_2",
      "botId": "bot2",
      "apiEndpoint": "http://yourotherserver/api/chat/discord"
    }
  ]
}
```


## API Endpoints

The server provides several API endpoints to manage and interact with your Discord bots:

- **POST /add-bot**: Adds a new bot to the server. Requires `token`, `botId`, and `apiEndpoint` in the request body.
- **POST /remove-bot**: Removes an existing bot from the server. Requires `botId` in the request body.
- **POST /send-message**: Sends a message to a specified channel using a bot. Requires `botId`, `channelId`, and `message` in the request body.

These endpoints allow you to dynamically manage your bots and send messages programmatically, making it easier to integrate with other services or automate tasks.


