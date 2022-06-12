import Discord from "discord.js";

module.exports = {
    name: "giverole",
    async execute(interaction: Discord.ButtonInteraction, client: any) {
        if (!interaction.member || !interaction.guild || !(interaction.member.roles instanceof Discord.GuildMemberRoleManager)) return interaction.reply("you are not in a guild! (no idea how this happened)");
        const role = interaction.customId.split("-")[1];
        const roleInfo = await interaction.guild.roles.fetch(role);
        if (!roleInfo) return interaction.reply("Role not found!");
        if (interaction.member.roles.cache.has(roleInfo.id)) {
            await interaction.member.roles.remove(roleInfo.id);
            return interaction.reply({ content: "Removed Role!", ephemeral: true });
        } else {
            await interaction.member.roles.add(roleInfo);
            return interaction.reply({ content: "Added Role!", ephemeral: true });
        }
    }
}