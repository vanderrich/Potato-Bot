import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
// import petPetGif from "pet-pet-gif";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("petpet")
        .setDescription("sends a gif of a hand patting someone")
        .addUserOption(option => option
            .setName("user")
            .setRequired(false)
            .setDescription("the user to pet, defaults to yourself")
        ) as SlashCommandBuilder,
    category: "Fun",
    async execute(interaction) {
        interaction.reply("This command cant be used at the moment, sorry for the inconvenience")
        // const user = interaction.options.getUser("user") || interaction.user;
        // const avatar = user.displayAvatarURL({ format: "png", size: 512 });

        // const animatedGif = await petPetGif(avatar);
        // interaction.reply({ files: [new MessageAttachment(animatedGif, "petpet.gif")] });
    }
} as SlashCommand;