import Discord from "discord.js";

module.exports = {
    name: "close-ticket-notsure",
    execute(interaction: Discord.ButtonInteraction) {
        const areYouSure = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel("Close")
                    .setStyle('DANGER')
                    .setCustomId(`close-ticket-${interaction.customId.split("-")[3]}`)
            )
        interaction.reply({ content: "Are you sure you want to close this ticket?", components: [areYouSure], ephemeral: true });
    }
}