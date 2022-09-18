import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v10";
import { GuildMember } from "discord.js";
import unidecode from "unidecode";
import { Asciify } from "../../localization";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("asciify")
        .setDescription("Set someone's nickname to a pingable ascii nickname")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("The member to set the nickname to")
        ) as SlashCommandBuilder,
    contextMenu: new ContextMenuCommandBuilder()
        .setName("asciify")
        .setType(ApplicationCommandType.User),
    category: "Moderation",
    guildOnly: true,
    permissions: "CHANGE_NICKNAME",
    async execute(interaction, client) {
        const locale = client.getLocale(interaction, "commands.moderation.asciify") as Asciify;
        let member = interaction.isContextMenu() ? await interaction.guild!.members.fetch(interaction.targetId) : interaction.options.getMember("member");
        if (!member) return interaction.reply(locale.userNotInGuild);
        if (!(member instanceof GuildMember)) member = await interaction.guild!.members.fetch(interaction.options.getUser("member")!);
        const oldUserName = member.user.username;
        let normalizedUserNickname: string = unidecode(oldUserName);
        if (oldUserName === normalizedUserNickname) return interaction.reply(locale.userAlreadyAsciified);
        if (normalizedUserNickname == " " || normalizedUserNickname == "") normalizedUserNickname = locale.blank;
        await member.setNickname(normalizedUserNickname, "Unicode");
        interaction.reply(client.getLocale(interaction, "commands.moderation.asciify.success", member.user.toString(), oldUserName, normalizedUserNickname));
    }
} as SlashCommand;