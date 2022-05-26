const { SlashCommandBuilder } = require("@discordjs/builders");
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
    async execute(interaction, client, Discord, footers) {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png", size: 512 });

        const animatedGif = await petPetGif(avatar);
        interaction.reply({ files: [new Discord.MessageAttachment(animatedGif, "petpet.gif")] });
    }
};