import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "close-ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const ticketType = interaction.customId.split("-")[2];
        const ticket = (ticketType as unknown) as Capitalize<typeof ticketType>;
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (interaction.channel?.type !== "GUILD_TEXT") return interaction.reply("You can't close tickets in DM channels!");
        if (!ticketInfo) return interaction.reply("Ticket not found!");

        const controls = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setEmoji("📑")
                    .setStyle('SECONDARY')
                    .setCustomId(`transcribe-ticket-${ticketType}`),
                new Discord.MessageButton()
                    .setEmoji("🔓")
                    .setStyle('SECONDARY')
                    .setCustomId(`open-ticket-${ticketType}`),
                new Discord.MessageButton()
                    .setEmoji("⛔")
                    .setStyle('DANGER')
                    .setCustomId(`delete-ticket-${ticketType}`)
            )
        let member = interaction.member;
        if (!(member instanceof Discord.GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id)

        interaction.channel.send({ content: `Ticket closed by ${interaction.user}`, components: [controls] });
        ticketInfo.updateOne({ $pull: { channelId: interaction.channel?.id } });
        const closecategory = client.guilds.cache.get(ticketInfo.guildId)?.channels.cache.get(ticketInfo.closeCategoryId);
        if (!closecategory || closecategory.type !== "GUILD_CATEGORY") return;
        interaction.channel.setParent(closecategory);
        await interaction.channel.edit({ name: `closed-${ticketType}-ticket-${ticketInfo.id}` });
        interaction.channel.permissionOverwrites.create(member.id, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ADD_REACTIONS: true
        });
        interaction.reply({ content: "Closed Ticket Successfully", ephemeral: true });
        return;
    }
}