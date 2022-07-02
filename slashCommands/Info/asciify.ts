import { SlashCommandBuilder, ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v10";
import { SlashCommand } from "../../Util/types";
import { CommandInteraction, UserContextMenuInteraction, GuildMember } from "discord.js"
import unidecode from "unidecode";
import { Asciify } from "../../localization";

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
    category: "Info",
    guildOnly: true,
    async execute(interaction: CommandInteraction | UserContextMenuInteraction, client) {
        const locale = client.getLocale(interaction, "commands.info.asciify") as Asciify;
        let member = interaction.isContextMenu() ? await interaction.guild!.members.fetch(interaction.targetId) : interaction.options.getMember("member");
        if (!member) return interaction.reply(locale.userNotInGuild);
        if (!(member instanceof GuildMember)) member = await interaction.guild!.members.fetch(interaction.options.getUser("member")!);
        const oldUserName = member.user.username;
        const normalizedUserNickname: string = unidecode(oldUserName);
        if (oldUserName === normalizedUserNickname) return interaction.reply(locale.userAlreadyAsciified);
        await member.setNickname(normalizedUserNickname, "Unicode");
        interaction.reply(client.getLocale(interaction, "commands.info.asciify.success", member.user.toString(), oldUserName, normalizedUserNickname));
    }
} as SlashCommand;