const BaseCommand = require("../../assets/baseCmd");
const { EmbedBuilder } = require("discord.js");

module.exports = class Blacklist extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "blacklist",
            aliases: ["bl"],
            cat: "owner",
            options: [{
                name: "option",
                type: 3,
                description: "user/server/remove/list",
                required: true
            }, {
                name: "id",
                type: 3,
                description: "ID of user or server",
                required: false
            }],
            desc: "Blacklist a user or server from using the bot",
            ownerOnly: true,
            args: true,
            usage: "blacklist user 123456789"
        });
    }

    async run(message, args, prefix) {
        let opt = args[0];

        if(!opt) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Valid Argument Expected.\nAvailable Options: \`user\`, \`server\`, \`remove\`, \`list\``)
                ]
            });
        }

        const npData = await this.client.db.getNoPrefixList();
        let blacklistedUsers = npData?.blacklistedUsers || [];
        let blacklistedServers = npData?.blacklistedServers || [];

        if(opt.toLowerCase() === "list") {
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
                        .setDescription(`${this.client.emoji.cross} Please provide me a Argument.`)
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
        } else if(opt.toLowerCase() === "remove") {
            if(!args[1]) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide an ID to remove from blacklist.`)
                    ]
                });
            }

            const id = args[1];

            if(blacklistedUsers.includes(id)) {
                blacklistedUsers = blacklistedUsers.filter(userId => userId !== id);
                await this.client.db.updateBlacklist({ blacklistedUsers });

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.tick} Successfully removed user ${id} from blacklist!`)
                    ]
                });
            } else if(blacklistedServers.includes(id)) {
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
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Invalid option! Use user/server/remove/list.`)
                ]
            });
        }
    }
};