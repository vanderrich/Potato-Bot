import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "close-ticket-notsure",
    execute(interaction: Discord.ButtonInteraction, client: Client) {
        const areYouSure = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel("Close")
                    .setStyle('DANGER')
                    .setCustomId(`close-ticket-${interaction.customId.split("-")[3]}`)
            )
        interaction.reply({ content: client.getLocale(interaction, "commands.moderation.createticket.areYouSureClose"), components: [areYouSure], ephemeral: true });
    }
}