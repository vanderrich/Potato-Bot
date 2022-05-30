import { admins } from "../../config.json";
import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setmoney")
        .setDescription("Set the balance of a user.")
        .addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("target")
                .setDescription("The user to set the balance of.")
                .setRequired(true)
        )
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("amount")
                .setDescription("The amount of money to set.")
                .setRequired(true)
        ),
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        if (!admins.includes(interaction.user.id)) return; // return if author isn't bot owner
        let user = interaction.options.getUser("target");
        if (!user) return interaction.reply("Please specify a user!");
        let amount = interaction.options.getInteger("amount");
        let data = await client.eco.setMoney(user.id, false, amount);

        const embed = new MessageEmbed()
            .setTitle(`Money Added!`)
            .setDescription(`User: <@${user.id}>\nTotal Amount: ${data}`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        return interaction.reply({ embeds: [embed] })
    }
}