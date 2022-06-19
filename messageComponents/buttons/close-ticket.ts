import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "close-ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const ticket = interaction.customId.split("-")[2];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (interaction.channel?.type !== "GUILD_TEXT") return interaction.reply("You can't close tickets in DM channels!");


        const controls = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setEmoji("📑")
                    .setStyle('SECONDARY')
                    .setCustomId(`transcribe-ticket-${interaction.customId.split("-")[2]}`),
                new Discord.MessageButton()
                    .setEmoji("🔓")
                    .setStyle('SECONDARY')
                    .setCustomId(`open-ticket-${interaction.customId.split("-")[2]}`),
                new Discord.MessageButton()
                    .setEmoji("⛔")
                    .setStyle('DANGER')
                    .setCustomId(`delete-ticket-${interaction.customId.split("-")[2]}`)
            )
        if (!interaction.member || !(interaction.member instanceof Discord.GuildMember)) return interaction.reply("You can't close tickets in DM channels!");

        interaction.channel.send({ content: `Ticket closed by ${interaction.user}`, components: [controls] });
        ticketInfo.updateOne({ $pull: { channelId: interaction.channel?.id } });
        const closecategory = client.guilds.cache.get(ticketInfo.guildId)?.channels.cache.get(ticketInfo.closeCategoryId);
        if (!closecategory || closecategory.type !== "GUILD_CATEGORY") return;
        interaction.channel.setParent(closecategory);
        await interaction.channel.edit({ name: `closed-${ticketInfo.title}-ticket-${ticketInfo.id}` });
        interaction.channel.permissionOverwrites.create(interaction.member.id, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ADD_REACTIONS: true
        });
        interaction.reply({ content: "Closed Ticket Successfully", ephemeral: true });
        return;
    }
}