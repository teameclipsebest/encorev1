
const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class LeaveServer extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "leaveserver",
            aliases: ["leave"],
            cat: "owner",
            args: false,
            desc: "Make the bot leave a specific server or list all servers",
            options: ["<server ID>", "list"],
            ownerOnly: true,
            usage: "leaveserver 1234567890"
        });
    }
    async run(message, args, prefix) {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide a server ID or use 'list'!`)
                ]
            });
        }

        if (args[0].toLowerCase() === "list") {
            const guilds = this.client.guilds.cache.map(guild => {
                return {
                    id: guild.id,
                    name: guild.name,
                    memberCount: guild.memberCount
                };
            }).sort((a, b) => b.memberCount - a.memberCount);
            
            let description = "Here are the servers I'm in:\n\n";
            
            for (let i = 0; i < Math.min(guilds.length, 20); i++) {
                const guild = guilds[i];
                description += `**${i+1}.** ${guild.name}\n`;
                description += `    ID: \`${guild.id}\`\n`;
                description += `    Members: ${guild.memberCount}\n\n`;
            }
            
            if (guilds.length > 20) {
                description += `... and ${guilds.length - 20} more servers`;
            }
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setTitle(`Server List (Total: ${guilds.length})`)
                        .setDescription(description)
                ]
            });
        }

        const guildId = args[0];
        const guild = this.client.guilds.cache.get(guildId);
        
        if (!guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} I'm not in a server with ID: ${guildId}`)
                ]
            });
        }
        
        try {
            const guildName = guild.name;
            await guild.leave();
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully left the server: ${guildName}`)
                ]
            });
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Failed to leave the server: ${error.message}`)
                ]
            });
        }
    }
};
