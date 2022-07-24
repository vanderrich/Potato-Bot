import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { admins } from "../../config.json";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addmoney")
        .setDescription("Add money to a user.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to add money to.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of money to add.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("place")
                .setDescription("The place to add the money to.")
                .addChoices(
                    { name: "Bank", value: "bank" },
                    { name: "Wallet", value: "wallet" },
                )
                .setRequired(true)
        ),
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        if (!admins.includes(interaction.user.id)) return; // return if author isn't bot owner
        let user = interaction.options.getUser("target");
        if (!user) return interaction.reply("Please specify a user!");
        let amount = interaction.options.getInteger("amount");
        let place = interaction.options.getString("place");
        if (!place) return interaction.reply("Please specify a place!");
        let data = await client.eco.addMoney({ user: user.id, amount, wheretoPutMoney: place });

        const embed = new MessageEmbed()
            .setTitle(`Money Added!`)
            .setDescription(`User: <@${user.id}>\nBalance Given: ${amount}\nTotal Amount: ${data.rawData[place]}`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        return interaction.reply({ embeds: [embed] })
    }
}