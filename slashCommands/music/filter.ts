import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client } from "../../Util/types";
import { QueueFilters } from "discord-player";
import { Music } from "../../localization";

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
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);

        if (!queue || !queue.playing) return interaction.reply(locale.noMusicPlaying);


        const filters = [] as Array<keyof QueueFilters>;
        queue.getFiltersEnabled().map((x: keyof QueueFilters) => filters.push(x));
        queue.getFiltersDisabled().map((x: keyof QueueFilters) => filters.push(x));

        const filter = filters.find((x: string) => x.toLowerCase() === interaction.options.getString("filter")?.toLowerCase());

        if (!filter) return interaction.reply(locale.noFilter);

        const filtersUpdated: any = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);
        queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'
        interaction.reply(client.getLocale(interaction, "commands.music.filterSuccess", filter, queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'));
    },
};