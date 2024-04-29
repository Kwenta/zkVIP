module.exports = {
  apps: [
    {
      name: "KwentaGateway",
      script: "dist/index.js",
      // interpreter: "./node_modules/.bin/nodemon",
      exec_mode: "cluster",
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
    },
  ],
};
