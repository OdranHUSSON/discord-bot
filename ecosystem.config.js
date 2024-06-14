module.exports = {
  apps: [
    {
      name: "discord-bot-manager",
      script: "./server.js",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
