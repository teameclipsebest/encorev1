
const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Broadcast extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "broadcast",
            aliases: ["announce"],
            cat: "owner",
            args: true,
            desc: "Send a message to all servers the bot is in",
            options: [],
            ownerOnly: true,
            usage: "broadcast <message>"
        });
    }
    async run(message, args, prefix) {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide a message to broadcast!`)
                ]
            });
        }

        const broadcastMessage = args.join(" ");
        const broadcastEmbed = new EmbedBuilder()
            .setColor(this.client.config.color)
            .setTitle("Announcement from Eclipse Bot")
            .setDescription(broadcastMessage)
            .setTimestamp()
            .setFooter({
                text: `From: ${message.author.globalName ?? message.author.username}`,
                iconURL: message.author.displayAvatarURL({ forceStatic: false })
            });
        
        const statusEmbed = new EmbedBuilder()
            .setColor(this.client.config.color)
            .setTitle("Broadcast Status")
            .setDescription("Sending announcements...");
        
        const statusMsg = await message.channel.send({ embeds: [statusEmbed] });
        
        let successCount = 0;
        let failCount = 0;
        
        for (const guild of this.client.guilds.cache.values()) {
            try {
                // Try to find a suitable channel to send the announcement
                const systemChannel = guild.systemChannel;
                const generalChannel = guild.channels.cache.find(c => 
                    c.type === 0 && // Text channel
                    (c.name.includes("general") || c.name.includes("chat")) &&
                    c.permissionsFor(guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"])
                );
                const firstTextChannel = guild.channels.cache.find(c => 
                    c.type === 0 && // Text channel
                    c.permissionsFor(guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"])
                );
                
                const targetChannel = systemChannel || generalChannel || firstTextChannel;
                
                if (targetChannel) {
                    await targetChannel.send({ embeds: [broadcastEmbed] });
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (error) {
                failCount++;
            }
            
            // Update status every 10 guilds
            if ((successCount + failCount) % 10 === 0) {
                const updateEmbed = new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setTitle("Broadcast Status")
                    .setDescription(`Sending announcements...\nProgress: ${successCount + failCount}/${this.client.guilds.cache.size}\nSuccess: ${successCount}\nFailed: ${failCount}`);
                
                await statusMsg.edit({ embeds: [updateEmbed] }).catch(() => {});
            }
        }
        
        const finalEmbed = new EmbedBuilder()
            .setColor(this.client.config.color)
            .setTitle("Broadcast Complete")
            .setDescription(`Successfully sent the announcement to ${successCount} servers.\nFailed to send to ${failCount} servers.`)
            .setTimestamp();
        
        await statusMsg.edit({ embeds: [finalEmbed] }).catch(() => {});
    }
};
