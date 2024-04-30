module.exports = {
  apps: [
    {
      name: "KwentaGateway",
      script: "dist/index.js",
      // interpreter: "./node_modules/.bin/nodemon",
      exec_mode: "cluster",
      args: ["--max-old-space-size=2048"],
      max_memory_restart: "2G",
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
    },
  ],
};
