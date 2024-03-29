import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildEmoji, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactroles")
        .setDescription("Make the bot send a reaction role")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("The title of the reaction role")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel to send the reaction role in")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("The description of the reaction role")
                .setRequired(true)
        )
        .addStringOption(option => option.setName("option1").setDescription("The first option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option1emoji").setDescription("The emoji of the first option of the reaction role").setRequired(true))
        .addRoleOption(option => option.setName("option1role").setDescription("The role of the first option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option2").setDescription("The second option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option2emoji").setDescription("The emoji of the second option of the reaction role").setRequired(true))
        .addRoleOption(option => option.setName("option2role").setDescription("The role of the second option of the reaction role").setRequired(true))
        .addStringOption(option => option.setName("option3").setDescription("The third option of the reaction role"))
        .addStringOption(option => option.setName("option3emoji").setDescription("The emoji of the third option of the reaction role"))
        .addRoleOption(option => option.setName("option3role").setDescription("The role of the third option of the reaction role"))
        .addStringOption(option => option.setName("option4").setDescription("The fourth option of the reaction role"))
        .addStringOption(option => option.setName("option4emoji").setDescription("The emoji of the fourth option of the reaction role"))
        .addRoleOption(option => option.setName("option4role").setDescription("The role of the fourth option of the reaction role")) as SlashCommandBuilder,
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    guildOnly: true,
    async execute(interaction, client, footers) {
        await interaction.deferReply({ ephemeral: true });
        const title: string = interaction.options.getString("title")!;
        const description: string | null = interaction.options.getString("description");
        const channel: any = interaction.options.getChannel("channel");
        if (!channel || !channel.isText()) return interaction.editReply(client.getLocale(interaction, "commands.moderation.reactroles.noTextChannel"));
        const options: Array<string> = [];
        const reactionRoles: Array<any> = [];
        const reactions: Array<GuildEmoji | string> = [];
        if (!interaction.guild!.me?.roles.highest.position) return interaction.editReply(client.getLocale(interaction, "commands.moderation.reactroles.noPerms"));
        for (let i = 1; i <= 25; i++) {
            const option = interaction.options.getString(`option${i}`);
            const emoji = interaction.options.getString(`option${i}emoji`);
            const role = interaction.options.getRole(`option${i}role`);
            if (option && emoji && role) {
                if (role.position < interaction.guild!.me.roles.highest.position) {
                    if (!client.emojis.cache.get(emoji.replace(/<:[a-z]+:/g, "").replace(/>/g, "")) && !emoji.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)) return interaction.editReply(client.getLocale(interaction, "commands.moderation.reactroles.invalidEmoji", emoji));
                    options.push(option);
                    reactionRoles.push(role);
                    reactions.push(emoji.trim());
                } else {
                    return interaction.editReply(client.getLocale(interaction, "commands.moderation.reactroles.roleTooHigh", role.name));
                }
            }
        }

        const embed = new MessageEmbed()
            .setTitle(title)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        if (description) embed.setDescription(description);
        for (const i in reactions) {
            embed.addFields({ name: `${reactions[i]}: ${options[i]}`, value: `${reactionRoles[i]}` });
        }

        const messageActionRow = new MessageActionRow();
        const messageActionRowComponents = []
        for (const i in reactions) {
            messageActionRowComponents.push(
                new MessageButton()
                    .setEmoji(reactions[i])
                    .setLabel(options[i])
                    .setStyle("PRIMARY")
                    .setCustomId(`giverole-${reactionRoles[i].id}`));
        }
        messageActionRow.addComponents(messageActionRowComponents);
        channel.send({ embeds: [embed], components: [messageActionRow] });
        interaction.editReply({ content: client.getLocale(interaction, "commands.moderation.reactroles.success") });
    }
} as SlashCommand;