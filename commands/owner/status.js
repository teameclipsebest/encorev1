
const { EmbedBuilder, ActivityType } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Status extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "status",
            aliases: ["presence"],
            cat: "owner",
            args: true,
            desc: "Change the bot's status/presence",
            options: ["type <PLAYING/WATCHING/LISTENING/STREAMING>", "status <text>", "url <streaming URL>"],
            ownerOnly: true,
            usage: "status type LISTENING status to music"
        });
    }
    async run(message, args, prefix) {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide an option! (type/status/url)`)
                ]
            });
        }

        const option = args[0].toLowerCase();
        
        if (option === "type") {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Please provide a type! (PLAYING/WATCHING/LISTENING/STREAMING)`)
                    ]
                });
            }
            
            const type = args[1].toUpperCase();
            let activityType;
            
            switch (type) {
                case "PLAYING":
                    activityType = ActivityType.Playing;
                    break;
                case "WATCHING":
                    activityType = ActivityType.Watching;
                    break;
                case "LISTENING":
                    activityType = ActivityType.Listening;
                    break;
                case "STREAMING":
                    activityType = ActivityType.Streaming;
                    break;
                default:
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} Invalid type! Use PLAYING/WATCHING/LISTENING/STREAMING.`)
                        ]
                    });
            }
            
            await this.client.db.updatePresence({ type: activityType });
            
            // Update bot's presence
            this.updatePresence();
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully set status type to ${type}!`)
                ]
            });
        } else if (option === "status") {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Please provide a status text!`)
                    ]
                });
            }
            
            const text = args.slice(1).join(" ");
            await this.client.db.updatePresence({ text: text });
            
            // Update bot's presence
            this.updatePresence();
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully set status text to "${text}"!`)
                ]
            });
        } else if (option === "url") {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Please provide a URL!`)
                    ]
                });
            }
            
            const url = args[1];
            await this.client.db.updatePresence({ url: url });
            
            // Update bot's presence
            this.updatePresence();
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully set streaming URL to ${url}!`)
                ]
            });
        } else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Invalid option! Use type/status/url.`)
                ]
            });
        }
    }
    
    async updatePresence() {
        const presenceData = await this.client.db.getPresence();
        if (!presenceData) return;
        
        const options = {
            activities: [{
                name: presenceData.text || "music",
                type: presenceData.type || ActivityType.Listening,
                url: presenceData.url || undefined
            }],
            status: presenceData.status || "online"
        };
        
        this.client.user.setPresence(options);
    }
};
