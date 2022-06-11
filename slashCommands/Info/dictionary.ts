import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dictionary")
        .setDescription("Look up a word in the dictionary")
        .addStringOption(option =>
            option
                .setName("word")
                .setDescription("The word to look up")
                .setRequired(true)
        ),
    category: "Info",
    async execute(interaction: CommandInteraction, client: any, footers: any) {
        const word = interaction.options.getString("word");
        const response = await axios.get(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.MERRIAMWEBSTER_API_KEY}`);
        const data = response.data[0];
        const locale = client.getLocale(interaction.user.id, "commands.info.dictionary");

        if (response.data.length < 1 || !word) return interaction.reply({ content: client.getLocale(interaction.user.id, "commands.info.dictionary.noWord"), ephemeral: true });
        const embed = new MessageEmbed()
            .setTitle(`${word} - ${data.fl}`)
            .setColor("RANDOM")
            .setDescription(`${data.hwi.hw} | ${data.hwi.prs[0].mw}\n${locale.offensive}: ${data.meta.offensive}\n${locale.stems}: ${data.meta.stems.join(", ")}`)
            .addField(client.getLocale(interaction.user.id, "commands.info.dictionary.topDefs"), "- " + data.shortdef.join("\n- "))
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        interaction.reply({ embeds: [embed] });
    }
}