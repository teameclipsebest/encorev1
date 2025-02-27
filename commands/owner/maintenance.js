
const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Maintenance extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "maintenance",
            aliases: ["maint"],
            cat: "owner",
            args: false,
            desc: "Toggle maintenance mode for the bot",
            options: ["on/off", "set <message>"],
            ownerOnly: true,
            usage: "maintenance on"
        });
    }
    async run(message, args, prefix) {
        if (!args[0]) {
            const maintenanceData = await this.client.db.getMaintenance();
            const status = maintenanceData?.enabled ? "enabled" : "disabled";
            const msg = maintenanceData?.message || "Bot is under maintenance. Please try again later.";
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setTitle("Maintenance Status")
                        .setDescription(`Maintenance mode is currently ${status}.`)
                        .addFields({
                            name: "Maintenance Message",
                            value: msg
                        })
                ]
            });
        }

        const option = args[0].toLowerCase();
        
        if (option === "on" || option === "enable") {
            await this.client.db.updateMaintenance({ enabled: true });
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Maintenance mode has been enabled.`)
                ]
            });
        } else if (option === "off" || option === "disable") {
            await this.client.db.updateMaintenance({ enabled: false });
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Maintenance mode has been disabled.`)
                ]
            });
        } else if (option === "set") {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Please provide a maintenance message!`)
                    ]
                });
            }
            
            const maintenanceMsg = args.slice(1).join(" ");
            await this.client.db.updateMaintenance({ message: maintenanceMsg });
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Maintenance message has been updated.`)
                ]
            });
        } else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Invalid option! Use on/off/set.`)
                ]
            });
        }
    }
};
