import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { CommandInteraction, ContextMenuInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Play tictactoe")
        .addUserOption(option =>
            option
                .setName("opponent")
                .setDescription("The opponent to play against")
                .setRequired(true),
        ),
    contextMenu: new ContextMenuCommandBuilder()
        .setName("tictactoe")
        .setType(ApplicationCommandType.User),
    category: "Fun",
    async execute(interaction: CommandInteraction | ContextMenuInteraction, client: any) {
        const opponent = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
        if (interaction.user.id == opponent) return interaction.reply({ content: "You can't play against yourself!", ephemeral: true });
        if (opponent == client.user.id) return interaction.reply({ content: "You can't play against me!", ephemeral: true });
        if (opponent.bot) interaction.channel?.send('Have fun playing with a bot lol')

        const game = await interaction.reply({
            content: `${interaction.user}'s turn`,
            components: [
                {
                    type: 1, components: [
                        { type: 2, label: "_", style: 2, custom_id: "ttt11" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt12" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt13" },
                    ]
                },
                {
                    type: 1, components: [
                        { type: 2, label: "_", style: 2, custom_id: "ttt21" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt22" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt23" },
                    ]
                },
                {
                    type: 1, components: [
                        { type: 2, label: "_", style: 2, custom_id: "ttt31" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt32" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt33" },
                    ]
                },
            ],
            fetchReply: true,
        });
        client.tictactoe[game.id] = {
            x: interaction.user.id,
            o: opponent.id,
            message: game
        }
        setTimeout(() => {
            if (client.tictactoe[game.id]) {
                delete client.tictactoe[game.id]
            }
        }, 300000);
    }
}