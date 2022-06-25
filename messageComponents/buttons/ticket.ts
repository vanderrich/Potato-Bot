import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "ticket",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const ticket = interaction.customId.split("-")[1];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!ticketInfo) return interaction.reply("Ticket not found!");
        const embed = new Discord.MessageEmbed()
            .setTitle(`New ${ticketInfo.title} ticket!`)
            .setDescription(`Support will be with you shortly.\nTo close this ticket react with 🔒\n**DO NOT PING ANYONE**`)
            .setColor('RANDOM')
        const guild = client.guilds.cache.get(ticketInfo.guildId);
        const category = guild?.channels.cache.get(ticketInfo.categoryId)!;
        if (!category || category.type !== "GUILD_CATEGORY") return interaction.reply("Category not found!");
        let member = interaction.member
        if (!(member instanceof Discord.GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id)
        const channel = await category.createChannel(`${ticketInfo.title}-ticket-${ticketInfo.id}`, {
            permissionOverwrites: [
                {
                    id: member,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: guild!.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: client.user!,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                }
            ]
        })
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setEmoji("🔒")
                    .setStyle('SECONDARY')
                    .setCustomId(`close-ticket-notsure-${ticketInfo.title}`)
            );
        await ticketInfo.updateOne({ $set: { channelId: channel.id } });
        await channel.send({ embeds: [embed], content: `${interaction.user} ${ticketInfo.title} ticket opened!`, components: [row] })
        return interaction.reply({ content: "Ticket opened!", ephemeral: true });
    }
}