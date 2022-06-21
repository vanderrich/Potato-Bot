import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, MessageAttachment } from "discord.js";
import { ApplicationCommandType } from "discord-api-types/v9";
import petPetGif from "pet-pet-gif";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("petpet")
        .setDescription("sends a gif of a hand patting someone")
        .addUserOption(option => option
            .setName("user")
            .setRequired(false)
            .setDescription("the user to pet, defaults to yourself")
    ) as SlashCommandBuilder,
    contextMenu: new ContextMenuCommandBuilder()
        .setName("petpet")
        .setType(ApplicationCommandType.User),
    category: "Fun",
    async execute(interaction: CommandInteraction | ContextMenuInteraction, client: Client) {
        const user = interaction.isContextMenu() ? await client.users.fetch(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
        const avatar = user.displayAvatarURL({ format: "png", size: 512 });

        const animatedGif = await petPetGif(avatar);
        interaction.reply({ files: [new MessageAttachment(animatedGif, "petpet.gif")] });
    }
} as SlashCommand;