import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("filter")
        .setDescription("Add a filter to the music playing")
        .addStringOption(option => option
            .setName("filter")
            .setDescription("Filter")
            .setRequired(true)
            .addChoices(
                { name: "8D", value: "8D" },
                { name: "nightcore", value: "nightcore" },
                { name: "bassbost", value: "bassbost" }
            )
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const actualFilter = queue.getFiltersEnabled()[0];

        const filters: string[] = [];
        queue.getFiltersEnabled().map((x: string) => filters.push(x));
        queue.getFiltersDisabled().map((x: string) => filters.push(x));

        const filter = filters.find((x: string) => x.toLowerCase() === interaction.options.getString("filter")?.toLowerCase());

        if (!filter) return interaction.reply(`${interaction.user}, I couldn't find a filter with your name. ❌\n\`bassboost, 8D, nightcore\``);

        const filtersUpdated: any = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);

        interaction.reply(`Applied: **${filter}**, Filter Status: **${queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'}** ✅\n **Remember, if the music is long, the filter application time may be longer accordingly.**`);
    },
};