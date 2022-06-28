import Discord from "discord.js";
import { Reactroles } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    name: "giverole",
    async execute(interaction: Discord.ButtonInteraction, client: Client) {
        const locale = client.getLocale(interaction, "commands.moderation.reactroles") as Reactroles
        let memberRoles = interaction.member!.roles
        if (!(memberRoles instanceof Discord.GuildMemberRoleManager)) return
        const role = interaction.customId.split("-")[1];
        const roleInfo = await interaction.guild!.roles.fetch(role);
        if (!roleInfo) return interaction.reply(locale.noRole);
        if (memberRoles.cache.has(roleInfo.id)) {
            await memberRoles.remove(roleInfo.id);
            return interaction.reply({ content: locale.removeSuccess, ephemeral: true });
        } else {
            await memberRoles.add(roleInfo);
            return interaction.reply({ content: locale.addSuccess, ephemeral: true });
        }
    }
}