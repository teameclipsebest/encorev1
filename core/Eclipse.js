const { Client } = require("discord.js");

class Eclipse extends Client {
    constructor(clientOptions) {
        super(clientOptions);
        this.config = require("../config/vars.js");
        this.logger = require("../assets/logger.js");
        this.handler = new (require("../core/handler.js"))(this);
        try {
            this.emoji = require("../config/emotes.json");
        } catch (error) {
            this.emoji = {
                home: "🏠",
                music: "🎵",
                filters: "🎛️",
                settings: "⚙️",
                info: "ℹ️",
                owner: "👑",
                allCommands: "📃",
                tick: "✅",
                cross: "❌",
                setup: {
                    previous: "⏮️",
                    stop: "⏹️",
                    pause: "⏯️",
                    loop: "🔄",
                    skip: "⏭️",
                    volLow: "🔉",
                    clearQueue: "🗑️",
                    shuffle: "🔀",
                    autoplay: "♾️",
                    volHigh: "🔊"
                }
            };
            console.log('[WARNING] Failed to load emotes config, using defaults.');
        }
    }
    start() {
        this.handler.handle();
        this.login(this.config.token);
    }
}

module.exports = Eclipse;