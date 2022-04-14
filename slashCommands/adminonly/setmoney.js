const { admins } = require("../../config.json")
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setmoney")
        .setDescription("Set the balance of a user.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to set the balance of.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of money to set.")
                .setRequired(true)
        ),
    permissions: "BotAdmin",
    async execute(interaction, client, Discord, footers) {
        if (!admins.includes(interaction.user.id)) return; // return if author isn't bot owner
        let user = interaction.options.getUser("target");
        if (!user) return interaction.reply("Please specify a user!");
        let amount = interaction.options.getInteger("amount");
        let data = await client.eco.setMoney(user.id, false, amount);

        const embed = new Discord.MessageEmbed()
            .setTitle(`Money Added!`)
            .setDescription(`User: <@${user.id}>\nTotal Amount: ${data}`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
        return interaction.reply({ embeds: [embed] })
    }
}