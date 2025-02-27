const vars = {
    token: process.env.BOT_TOKEN || "", // Add your token as environment variable
    prefix: "!",
    mongoURL: process.env.MONGODB_URI || "", // Add your MongoDB URI as environment variable
    owners: ["1344693434723864587"],
    color: "#ff0000" ,// embed color
    webhooks: {
        cmd: process.env.WEBHOOK_URL || ""
    },
    nodes: [{
        name: "Eclipse",
        url: "lava-v4.ajieblogs.eu.org:443",
        auth: "https://dsc.gg/ajidevserver",
        secure: true
    }],
    serverLink: "https://discord.gg/f8TZDbRbZt",
    supportId: "1344696124249739315",
    setupImg: null
}

module.exports = vars;