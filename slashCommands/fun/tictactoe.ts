import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { CommandInteraction, ContextMenuInteraction, User } from "discord.js";
import { Tictactoe } from "../../localization";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Play tictactoe")
        .addUserOption(option =>
            option
                .setName("opponent")
                .setDescription("The opponent to play against")
                .setRequired(true),
        ) as SlashCommandBuilder,
    contextMenu: new ContextMenuCommandBuilder()
        .setName("tictactoe")
        .setType(ApplicationCommandType.User),
    category: "Fun",
    async execute(interaction: CommandInteraction | ContextMenuInteraction, client: Client) {
        const opponent: User = interaction.isContextMenu() ? await client.users.fetch(interaction.targetId) : interaction.options.getUser("opponent")!;
        const locale: Tictactoe = client.getLocale(interaction, "commands.fun.tictactoe")
        if (interaction.user.id == opponent.id) return interaction.reply({ content: locale.playSelf, ephemeral: true });
        if (opponent.id == client.user!.id) return interaction.reply({ content: locale.playClient, ephemeral: true });
        if (opponent.bot) interaction.channel?.send(locale.playBot);

        const game = await interaction.reply({
            content: client.getLocale(interaction, "commands.fun.tictactoe.turn", opponent),
            components: [
                {
                    type: 1, components: [
                        { type: 2, label: "_", style: 2, custom_id: "ttt-11" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt-12" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt-13" },
                    ]
                },
                {
                    type: 1, components: [
                        { type: 2, label: "_", style: 2, custom_id: "ttt-21" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt-22" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt-23" },
                    ]
                },
                {
                    type: 1, components: [
                        { type: 2, label: "_", style: 2, custom_id: "ttt-31" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt-32" },
                        { type: 2, label: "_", style: 2, custom_id: "ttt-33" },
                    ]
                },
            ],
            fetchReply: true,
        });
        client.tictactoe[game.id] = {
            x: opponent.id,
            o: interaction.user.id,
            message: game
        }
        setTimeout(() => {
            if (client.tictactoe[game.id]) {
                delete client.tictactoe[game.id]
            }
        }, 300000);
    }
} as SlashCommand;