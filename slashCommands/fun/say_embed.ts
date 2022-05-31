import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";

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
        ),
    category: "Fun",
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        const title: string | null = interaction.options.getString("title");
        let description: string | null = interaction.options.getString("description");
        if (!description) {
            await interaction.deferReply();
            const message = await interaction.channel?.send("Enter a description, wait for 30 seconds to leave it empty.");
            const descriptionThingy = await interaction.channel?.awaitMessages({ filter: (m: Message) => m.author.id === interaction.user.id, max: 1, time: 30000 });
            description = descriptionThingy?.first()?.content || "";
            message?.delete();
            descriptionThingy?.first()?.delete();
        }

        if (!title) return interaction.reply("Please specify a title!");

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.editReply({ embeds: [embed] })
    }
}