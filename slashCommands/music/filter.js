const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("filter")
        .setDescription("Filter")
        .addStringOption(option => option
            .setName("filter")
            .setDescription("Filter")
            .setRequired(true)
            .addChoice("8D", "8D")
            .addChoice("nightcore", "nightcore")
            .addChoice("bassboost", "bassboost")
    ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const actualFilter = queue.getFiltersEnabled()[0];

        const filters = [];
        queue.getFiltersEnabled().map(x => filters.push(x));
        queue.getFiltersDisabled().map(x => filters.push(x));

        const filter = filters.find((x) => x.toLowerCase() === interaction.options.getString("filter").toLowerCase());

        if (!filter) return interaction.reply(`${interaction.user}, I couldn't find a filter with your name. ❌\n\`bassboost, 8D, nightcore\``);

        const filtersUpdated = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);

        interaction.reply(`Applied: **${filter}**, Filter Status: **${queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'}** ✅\n **Remember, if the music is long, the filter application time may be longer accordingly.**`);
    },
};