import { SlashCommandBuilder } from "@discordjs/builders"
import Discord from "discord.js"
import { Client, SlashCommand } from "../../Util/types";

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
    async execute(interaction: Discord.CommandInteraction, client: Client, footers: string[]) {
        let title = interaction.options.getString("title");
        let description = interaction.options.getString("description");
        let channel: any = interaction.options.getChannel("channel");
        if (!title) return interaction.reply("You must specify a title for the reaction role");
        if (!channel || !channel.isText()) return interaction.reply("Please specify a text channel!");
        let options: Array<string> = [];
        let reactionRoles: Array<any> = [];
        let reactions: Array<Discord.GuildEmoji | string> = [];
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        if (!interaction.guild.me?.roles.highest.position) return interaction.reply("I don't have permission to manage roles!");
        for (let i = 1; i <= 25; i++) {
            let option = interaction.options.getString(`option${i}`);
            let emoji = interaction.options.getString(`option${i}emoji`);
            let role = interaction.options.getRole(`option${i}role`);
            if (option && emoji && role) {
                if (role.position < interaction.guild.me.roles.highest.position) {
                    if (!client.emojis.cache.get(emoji.replace(/<:[a-z]+:/, "").replace(/>/, "")) && !emoji.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)) return interaction.reply(`The emoji ${emoji} is not valid!`);
                    options.push(option);
                    reactionRoles.push(role);
                    reactions.push(emoji.trim());
                } else {
                    return interaction.reply(`The role ${role.name}'s position is higher than my highest role's position!`);
                }
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        if (description) embed.setDescription(description);
        for (const i in reactions) {
            embed.addField(`${reactions[i]}: ${options[i]}`, `${reactionRoles[i]}`);
        }

        const messageActionRow = new Discord.MessageActionRow();
        const messageActionRowComponents = []
        for (const i in reactions) {
            messageActionRowComponents.push(
                new Discord.MessageButton()
                    .setEmoji(reactions[i])
                    .setLabel(options[i])
                    .setStyle("PRIMARY")
                    .setCustomId(`giverole-${reactionRoles[i].id}`));
        }
        messageActionRow.addComponents(messageActionRowComponents);
        channel.send({ embeds: [embed], components: [messageActionRow] });
        interaction.reply({ content: 'Reaction Role created!', ephemeral: true });
    }
} as SlashCommand;