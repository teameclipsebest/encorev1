
const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class ServerSettings extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "serversettings",
            aliases: ["ss", "serverset"],
            cat: "owner",
            args: true,
            desc: "View or modify server settings remotely",
            options: ["view <server ID>", "reset <server ID>", "prefix <server ID> <new prefix>"],
            ownerOnly: true,
            usage: "serversettings view 1234567890"
        });
    }
    async run(message, args, prefix) {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide an option! (view/reset/prefix)`)
                ]
            });
        }

        const option = args[0].toLowerCase();
        
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide a server ID!`)
                ]
            });
        }
        
        const guildId = args[1];
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
        
        const guildData = await this.client.db.getGuildData({ id: guildId });
        
        if (option === "view") {
            if (!guildData) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} No data found for this server!`)
                    ]
                });
            }
            
            const embed = new EmbedBuilder()
                .setColor(this.client.config.color)
                .setTitle(`Server Settings: ${guild.name}`)
                .setThumbnail(guild.iconURL({ forceStatic: false }))
                .addFields([
                    {
                        name: "Server ID",
                        value: guild.id
                    },
                    {
                        name: "Prefix",
                        value: guildData.prefix || this.client.config.prefix
                    },
                    {
                        name: "Setup Channel",
                        value: guildData.setupSettings?.channelId ? `<#${guildData.setupSettings.channelId}>` : "Not set"
                    },
                    {
                        name: "Ignored Channels",
                        value: guildData.ignoreModule?.ignoredChannels?.length 
                            ? guildData.ignoreModule.ignoredChannels.map(id => `<#${id}>`).join(", ") 
                            : "None"
                    },
                    {
                        name: "Admin Bypass",
                        value: guildData.ignoreModule?.adminBypass ? "Enabled" : "Disabled"
                    },
                    {
                        name: "Mods Bypass",
                        value: guildData.ignoreModule?.modsBypass ? "Enabled" : "Disabled"
                    }
                ]);
            
            return message.channel.send({ embeds: [embed] });
        } else if (option === "reset") {
            if (!guildData) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} No data found for this server!`)
                    ]
                });
            }
            
            await this.client.db.deleteGuildData(guildId);
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully reset all settings for server: ${guild.name}`)
                ]
            });
        } else if (option === "prefix") {
            if (!args[2]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Please provide a new prefix!`)
                    ]
                });
            }
            
            const newPrefix = args[2];
            
            if (newPrefix.length > 3) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Prefix cannot be longer than 3 characters!`)
                    ]
                });
            }
            
            await this.client.db.updateGuildPrefix(guildId, newPrefix);
            
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully updated prefix to \`${newPrefix}\` for server: ${guild.name}`)
                ]
            });
        } else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Invalid option! Use view/reset/prefix.`)
                ]
            });
        }
    }
};
