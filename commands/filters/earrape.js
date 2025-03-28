const BaseCommand = require("../../assets/baseCmd");

module.exports = class Earrape extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "earrape",
            aliases: [],
            cat: 'filters',
            args: false,
            ownerOnly: false,
            desc: "applies earrape filter to the player",
            options: [],
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true,
            }
        })
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player for this Guild.`)
                ]
            });
        }

        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }

        await player.setEarrape();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.tick} Applied Earrape to the Player.`)
            ]
        });
    }
}