import Discord from "discord.js";

module.exports = {
    name: "ticket",
    async execute(interaction: Discord.ButtonInteraction, client: any) {
        const ticket = interaction.customId.split("-")[1];
        const ticketInfo = await client.tickets.findOne({ title: ticket });
        if (!ticketInfo) return interaction.reply("Ticket not found!");
        const embed = new Discord.MessageEmbed()
            .setTitle(`New ${ticketInfo.title} ticket!`)
            .setDescription(`Support will be with you shortly.\nTo close this ticket react with 🔒\n**DO NOT PING ANYONE**`)
            .setColor('RANDOM')
        const guild = client.guilds.cache.get(ticketInfo.guildId);
        const category = guild.channels.cache.get(ticketInfo.categoryId);
        const channel = await category.createChannel(`${ticketInfo.title}-ticket-${ticketInfo.id}`, {
            permissionOverwrites: [
                {
                    id: interaction.member,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                },
                {
                    id: client.user.id,
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