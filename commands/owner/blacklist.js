const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Blacklist extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "blacklist",
            aliases: ["bl"],
            cat: "owner",
            options: [],
            desc: "blacklists a server or a user",
            ownerOnly: true,
            args: true,
            usage: "<user/server>",
            // voiceSettings: {}
        })
    }
    async run(message, args, prefix) {
        let opt = args[0];

        if(!opt) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Valid Arguement Expected.\nAvailable Options: \`user\`, \`server\``)
                ]
            });
        }

        if(opt.toLowerCase() === "user") {
            let user = message.mentions.users.first() || this.client.users.cache.get(args[1]) || await this.client.users.fetch(args[1]).catch(() => {});
            
            if(!user) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide me a Valid User.`)
                    ]
                });
            }

            let data = await this.client.db.blacklistUser(user);
            data = data.blacklistedUsers.includes(user.id);
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji[data ? "tick" : "cross"]} Successfully ${data ? "Added" : "Removed"} *${user}* ${data ? "to" : "from"} the Blacklist.`)
                ]
            });
        } else if(opt.toLowerCase() === "server") {
            if(!args[1]) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide me a Arguement.`)
                    ]
                })
            }
            let guild = this.client.guilds.cache.get(args[1]);
            if(!guild) {
                guild = await this.client.guilds.fetch(args[1]).catch((e) => {});
            }
            if(!guild) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Guild Not Found.`)
                    ]
                });
            }

            let data = await this.client.db.blacklistGuild(guild);
            data = data.blacklistedServers.includes(guild.id);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji[data ? "tick" : "cross"]} Successfully ${data ? "Added" : "Removed"} *${guild.name}* ${data ? "to" : "from"} Blacklist.`)
                ]
            });
        }
    }
}
// EmbedBuilder is already imported above
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Blacklist extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "blacklist",
            aliases: ["bl"],
            cat: "owner",
            args: true,
            desc: "Blacklist a user or server from using the bot",
            options: ["user/server <ID>", "remove <ID>", "list"],
            ownerOnly: true,
            usage: "blacklist user 123456789"
        });
    }
    async run(message, args, prefix) {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide an option! (user/server/remove/list)`)
                ]
            });
        }

        const option = args[0].toLowerCase();
        const npData = await this.client.db.getNoPrefixList();
        let blacklistedUsers = npData?.blacklistedUsers || [];
        let blacklistedServers = npData?.blacklistedServers || [];

        if (option === "list") {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setTitle("Blacklisted Entities")
                        .addFields([
                            {
                                name: "Users",
                                value: blacklistedUsers.length ? blacklistedUsers.join("\n") : "No blacklisted users"
                            },
                            {
                                name: "Servers",
                                value: blacklistedServers.length ? blacklistedServers.join("\n") : "No blacklisted servers"
                            }
                        ])
                ]
            });
        }

        if (!args[1] && option !== "list") {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide an ID!`)
                ]
            });
        }

        const id = args[1];

        if (option === "user") {
            if (blacklistedUsers.includes(id)) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} This user is already blacklisted!`)
                    ]
                });
            }

            blacklistedUsers.push(id);
            await this.client.db.updateBlacklist({ blacklistedUsers });

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully blacklisted user with ID: ${id}`)
                ]
            });
        } else if (option === "server") {
            if (blacklistedServers.includes(id)) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} This server is already blacklisted!`)
                    ]
                });
            }

            blacklistedServers.push(id);
            await this.client.db.updateBlacklist({ blacklistedServers });

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.tick} Successfully blacklisted server with ID: ${id}`)
                ]
            });
        } else if (option === "remove") {
            if (blacklistedUsers.includes(id)) {
                blacklistedUsers = blacklistedUsers.filter(userId => userId !== id);
                await this.client.db.updateBlacklist({ blacklistedUsers });

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.tick} Successfully removed user ${id} from blacklist!`)
                    ]
                });
            } else if (blacklistedServers.includes(id)) {
                blacklistedServers = blacklistedServers.filter(serverId => serverId !== id);
                await this.client.db.updateBlacklist({ blacklistedServers });

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.tick} Successfully removed server ${id} from blacklist!`)
                    ]
                });
            } else {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} This ID is not blacklisted!`)
                    ]
                });
            }
        } else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Invalid option! Use user/server/remove/list.`)
                ]
            });
        }
    }
};