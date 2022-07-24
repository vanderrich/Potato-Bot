import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say_embed")
        .setDescription("Make the bot send an embed")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("The title of the embed")
                .setRequired(true),
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("The description of the embed"),
    ) as SlashCommandBuilder,
    category: "Fun",
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        await interaction.deferReply();
        const title = interaction.options.getString("title");
        let description = interaction.options.getString("description");
        if (!description) {
            const message = await interaction.channel?.send(client.getLocale(interaction, "commands.fun.say_embed.enterDesc"));
            const descriptionThingy = await interaction.channel?.awaitMessages({ filter: (m: Message) => m.author.id === interaction.user.id, max: 1, time: 30000 });
            description = descriptionThingy?.first()?.content || "";
            message?.delete();
            descriptionThingy?.first()?.delete();
        }

        if (!title) return interaction.editReply(client.getLocale(interaction, "commands.fun.say_embed.specifyTitle"));

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.editReply({ embeds: [embed] })
    }
} as SlashCommand;