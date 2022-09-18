import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import { Client, MessageComponent } from "../../Util/types";

module.exports = {
    name: "close-ticket-notsure",
    execute(interaction: ButtonInteraction, client: Client) {
        const areYouSure = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Close")
                    .setStyle('DANGER')
                    .setCustomId(`close-ticket-${interaction.customId.split("-")[3]}`)
            )
        interaction.reply({ content: client.getLocale(interaction, "commands.moderation.createticket.areYouSureClose"), components: [areYouSure], ephemeral: true });
    }
} as MessageComponent;