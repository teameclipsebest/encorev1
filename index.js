// const Sharder = require("./core/sharder");
const { Partials } = require("discord.js");
const Eclipse = require("./core/Eclipse");

// const manager = new Sharder();
// manager.spawn();

const EclipseBot = new Eclipse({
    intents: [
        "GuildMessages",
        "GuildMembers",
        "GuildInvites",
        "GuildVoiceStates",
        "MessageContent",
        "Guilds"
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.ThreadMember],
    allowedMentions: {
        repliedUser: false
    },
    failIfNotExists: true,
    rest: {
        authPrefix: "Bot",
        cdn: "https://cdn.discordapp.com/",
        globalRequestsPerSecond: 45,
        api: "https://discord.com/api/",
        retries: 2,
        version: "10",
        hashSweepInterval: 2 * 60 * 60 * 1000,
        timeout: 20000
    }
});

EclipseBot.start();

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Prevent the application from crashing, but log the issue
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    // Log the error but keep the application running if possible
});

// Add this to catch warnings
process.on("warning", (warning) => {
    console.warn("Warning:", warning.name, warning.message);
});