const maxVol = 150;

module.exports = {
    name: 'volume',
    aliases: ['vol'],
    utilisation: `volume [1-${maxVol}]`,
    voiceChannel: true,
    category: "Music",
    execute(message, args, cmd, client) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`${message.author}, There is no music currently playing!. ❌`);

        const vol = parseInt(args[0]);

        if (!vol) return message.reply(`Current volume: **${queue.volume}** 🔊\n**To change the volume, with \`1\` to \`${maxVol}\` Type a number between.**`);

        if (queue.volume === vol) return message.reply(`${message.author}, The volume you want to change is already the current volume ❌`);

        if (vol < 0 || vol > maxVol) return message.reply(`${message.author}, **Type a number from \`1\` to \`${maxVol}\` to change the volume .** ❌`);

        const success = queue.setVolume(vol);

        return message.reply(success ? `Volume changed: **%${vol}**/**${maxVol}** 🔊` : `${message.author}, Something went wrong. ❌`);
    },
};