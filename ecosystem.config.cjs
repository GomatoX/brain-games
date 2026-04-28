module.exports = {
  apps: [
    {
      name: "brain-games",
      script: "./dev.sh",
      args: "dev",
      cwd: __dirname,
      interpreter: "bash",
      kill_timeout: 30000,
      env: {
        PORT: 3013,
        DATABASE_PATH: "./data/brain.db",
      },
    },
  ],
}
