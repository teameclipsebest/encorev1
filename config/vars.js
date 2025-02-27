const vars = {
    token: process.env.BOT_TOKEN || "MTM0NDcwMTY2NzU3MTkyNTAwMw.GoDAiJ.3d-dmNbV_954Ap1G0rZHb9JsKSz_sMMlIPPXy8", // Preferably use environment variable
    prefix: "!",
    mongoURL: process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.l1ualfd.mongodb.net/?retryWrites=true&w=majority",
    owners: ["1344693434723864587"],
    color: "#ff0000" ,// embed color
    webhooks: {
        cmd: "https://discord.com/api/webhooks/1344712913658708059/2UX3aCGafZ3yXJd0EHc3HzrLB322J4K9N43ClOjkDR9xFYD0iLCtaSuGko7AVdpeYt6d"
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