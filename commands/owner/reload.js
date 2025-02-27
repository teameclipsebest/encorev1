
const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { readdirSync } = require("fs");

module.exports = class Reload extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "reload",
            aliases: ["refresh"],
            cat: "owner",
            args: false,
            desc: "Reload all commands and events",
            options: ["commands", "events", "all"],
            ownerOnly: true,
            usage: "reload all"
        });
    }
    async run(message, args, prefix) {
        const option = args[0]?.toLowerCase() || "all";
        
        if (option === "commands" || option === "all") {
            // Clear command cache and reload
            this.client.commands.clear();
            
            readdirSync(`./commands/`).forEach(dir => {
                readdirSync(`./commands/${dir}/`).forEach((file) => {
                    if (file.endsWith(".js")) {
                        delete require.cache[require.resolve(`../../commands/${dir}/${file}`)];
                        let cmd = new (require(`../../commands/${dir}/${file}`))(this.client);
                        this.client.commands.set(cmd.name, cmd);
                    }
                });
            });
        }
        
        if (option === "events" || option === "all") {
            // Remove all listeners
            this.client.removeAllListeners();
            
            // Reload events
            readdirSync(`./events/client/`).forEach((file) => {
                if (file.endsWith(".js")) {
                    delete require.cache[require.resolve(`../../events/client/${file}`)];
                    let event = new (require(`../../events/client/${file}`))(this.client);
                    let run = event.run.bind(event);
                    this.client.on(event.eventName, run);
                }
            });
        }
        
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.tick} Successfully reloaded ${option === "all" ? "commands and events" : option}!`)
            ]
        });
    }
};
