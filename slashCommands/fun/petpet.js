const { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders");
const { ApplicationCommandType } = require("discord-api-types/v9");
const petPetGif = require("pet-pet-gif");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("petpet")
        .setDescription("sends a gif of a hand patting someone")
        .addUserOption(option => option
            .setName("user")
            .setRequired(false)
            .setDescription("the user to pet, defaults to yourself")
    ),
    contextMenu: new ContextMenuCommandBuilder()
        .setName("petpet")
        .setType(ApplicationCommandType.User),
    category: "Fun",
    async execute(interaction, client, Discord, footers) {
        const user = interaction.options.getUser("user") || client.users.cache.get(interaction.targetId) || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png", size: 512 });

        const animatedGif = await petPetGif(avatar);
        interaction.reply({ files: [new Discord.MessageAttachment(animatedGif, "petpet.gif")] });
    }
};