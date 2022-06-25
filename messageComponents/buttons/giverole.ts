import Discord from "discord.js";
import { Client } from "../../Util/types";

module.exports = {
    name: "giverole",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        let memberRoles = interaction.member!.roles
        if (!(memberRoles instanceof Discord.GuildMemberRoleManager)) return
        const role = interaction.customId.split("-")[1];
        const roleInfo = await interaction.guild!.roles.fetch(role);
        if (!roleInfo) return interaction.reply("Role not found!");
        if (memberRoles.cache.has(roleInfo.id)) {
            await memberRoles.remove(roleInfo.id);
            return interaction.reply({ content: "Removed Role!", ephemeral: true });
        } else {
            await memberRoles.add(roleInfo);
            return interaction.reply({ content: "Added Role!", ephemeral: true });
        }
    }
}