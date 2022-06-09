import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removevshopitem")
        .setDescription("Remove a shop item.")
        .addNumberOption(option => option
            .setName("itemnumber")
            .setDescription("The shop item number to remove.")
            .setRequired(true)
        ),
    category: "Currency",
    permissions: "ADMINISTRATOR",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        const itemNumber = interaction.options.getNumber("itemnumber");

        let result = await client.eco.removeItem({
            guild: interaction.guildId,
            item: itemNumber
        })
        if (result.error) {
            if (result.type == 'Invalid-Item-Number' || result.type == "Unknown-Item") return interaction.reply(client.getLocale(interaction.user.id, "currency.buy.noItem"));
        } else return interaction.reply(client.getLocale(interaction.user.id, "currency.addshopitem.success", name));
    }
}