const { admins } = require("../../config.json")
module.exports = {
    name: "deleteuser",
    usage: `deleteuser @user <amount>`,
    category: "Bot Admin Only",
    async execute(message, args, cmd, client, Discord, footers) {
        if (!admins.includes(message.author.id)) return; // return if author isn't bot owner
        let user = args.join()
        if (!user) return message.reply("Please specify a user!");
        let data = await client.eco.delete(user);

        const embed = new Discord.MessageEmbed()
            .setTitle(`User Deleted`)
            .setDescription(`User: ${user}\n`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: message.author.avatarURL({ dynamic: true }) })
        return message.reply({ embeds: [embed] })

    }
}