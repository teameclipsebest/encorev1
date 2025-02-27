
const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class ServerCount extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "servercount",
            aliases: ["sc", "stats"],
            cat: "owner",
            args: false,
            desc: "View detailed statistics about the bot",
            options: [],
            ownerOnly: true,
            usage: "servercount"
        });
    }
    async run(message, args, prefix) {
        // Calculate shard statistics if sharding is used
        let shardCount = 1;
        let shardId = 0;
        
        if (this.client.shard) {
            shardCount = this.client.shard.count;
            shardId = this.client.shard.ids[0];
        }
        
        // Get guild data
        const guilds = this.client.guilds.cache;
        const users = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);
        const channels = guilds.reduce((acc, guild) => acc + guild.channels.cache.size, 0);
        
        // Get music players data
        const players = this.client.music.playersMap.size;
        
        // Calculate uptime
        const uptime = this.formatUptime(this.client.uptime);
        
        // Calculate memory usage
        const memoryUsage = process.memoryUsage();
        const memoryUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memoryTotalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        // Get average guild size
        const avgGuildSize = (users / guilds.size).toFixed(2);
        
        // Get largest guilds
        const topGuilds = [...guilds.values()]
            .sort((a, b) => b.memberCount - a.memberCount)
            .slice(0, 5)
            .map((g, i) => `${i + 1}. ${g.name} - ${g.memberCount} members`);
        
        const embed = new EmbedBuilder()
            .setColor(this.client.config.color)
            .setTitle(`${this.client.user.username} Statistics`)
            .setThumbnail(this.client.user.displayAvatarURL({ forceStatic: false }))
            .addFields([
                {
                    name: "📊 Bot Stats",
                    value: [
                        `**Servers:** ${guilds.size}`,
                        `**Users:** ${users}`,
                        `**Channels:** ${channels}`,
                        `**Active Players:** ${players}`,
                        `**Commands:** ${this.client.commands.size}`,
                        `**Uptime:** ${uptime}`
                    ].join("\n")
                },
                {
                    name: "💻 System Stats",
                    value: [
                        `**Memory:** ${memoryUsedMB}MB / ${memoryTotalMB}MB`,
                        `**Node.js:** ${process.version}`,
                        `**Discord.js:** v${require("discord.js").version}`,
                        `**Shard:** ${shardId + 1}/${shardCount}`,
                        `**Avg. Guild Size:** ${avgGuildSize} users`
                    ].join("\n")
                },
                {
                    name: "🏆 Top Guilds",
                    value: topGuilds.join("\n") || "No guilds found"
                }
            ])
            .setFooter({
                text: `Made with 💘 by Team Eclipse`,
                iconURL: message.author.displayAvatarURL({ forceStatic: false })
            })
            .setTimestamp();
        
        return message.channel.send({ embeds: [embed] });
    }
    
    formatUptime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
};
