import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dictionary")
        .setDescription("Look up a word in the dictionary")
        .addStringOption(option =>
            option
                .setName("word")
                .setDescription("The word to look up")
                .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        const word = interaction.options.getString("word");
        const response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.MERRIAMWEBSTER_API_KEY}`);
        const data = (await response.json())[0];
        const locale = client.getLocale(interaction, "commands.info.dictionary");

        if (!data?.meta || !word) return interaction.reply({ content: client.getLocale(interaction, "commands.info.dictionary.noWord"), ephemeral: true });
        const embed = new MessageEmbed()
            .setTitle(`${data.meta.id} - ${data.fl}`)
            .setColor("RANDOM")
            .setDescription(`${data.hwi.hw} | ${data.hwi.prs[0].mw}\n${locale.offensive}: ${data.meta.offensive}\n${locale.stems}: ${data.meta.stems.join(", ")}`)
            .addField(client.getLocale(interaction, "commands.info.dictionary.topDefs"), "- " + data.shortdef.join("\n- "))
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.reply({ embeds: [embed] });
    }
} as SlashCommand;