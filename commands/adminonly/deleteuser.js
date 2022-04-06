const { admins } = require("../../config.json")
module.exports = {
    name: "deleteuser",
    usage: `deleteuser @user <amount>`,
    category: "BotAdminOnly",
    async execute(message, args, cmd, client, Discord, footers) {
        if (!admins.includes(message.author.id)) return; // return if author isn't bot owner
        let user = args.join()
        if (!user) return message.channel.send("Please specify a user!");
        let data = await client.eco.delete(user);

        const embed = new Discord.MessageEmbed()
            .setTitle(`User Deleted`)
            .setDescription(`User: ${user}\n`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        return message.channel.send({ embeds: [embed] })

    }
}