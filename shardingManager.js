const { ShardingManager } = require('discord.js');
const config = require("./config.json");

let manager = new ShardingManager("./index.js", {
    token: config.Token,
    totalShards: "auto",
    shardList: "auto"
})

manager.spawn()

manager.on("launch", (shard) => {
    console.log("Shard " + shard.id + " has launched!");
});

manager.on("shardCreate", (shard) => {
    console.log("Shard " + shard.id + " has been created!");
});

manager.on("shardDisconnect", (shard) => {
    console.log("Shard " + shard.id + " has disconnected!");
});

manager.on("shardError", (shard, error) => {
    console.log("Shard " + shard.id + " has errored: " + error);
});

manager.on("shardReady", (shard) => {
    console.log("Shard " + shard.id + " has been ready!");
});

manager.on("shardReconnecting", (shard) => {
    console.log("Shard " + shard.id + " is reconnecting!");
});

manager.on("shardResume", (shard) => {
    console.log("Shard " + shard.id + " has been resumed!");
});

manager.on("shardRestart", (shard) => {
    console.log("Shard " + shard.id + " has been restarted!");
});

manager.on("error", (error) => {
    console.log("Error: " + error);
});