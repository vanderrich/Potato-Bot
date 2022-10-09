import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";
import { SlashCommand } from "../../Util/types";

type BinType = string & "src" | "hate" | "haste" | "paste"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("paste")
        .setDescription("Pastes text to a bin specified")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("The text to paste")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("bin")
                .setDescription("Bin to paste the text, defaults to SourceBin")
                .addChoices(
                    { name: "SourceBin", value: "src" },
                    { name: "HateBin", value: "hate" },
                    { name: "HasteBin", value: "haste" },
                    { name: "PasteBin", value: "paste" }
                )
        )
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Name of the paste")
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction, client) {
        const name = interaction.options.getString("name")
        const bin: BinType = interaction.options.getString("bin") as BinType || "src"
        const text = interaction.options.getString("text")!
        let url;
        const data = await fetch("https://sourceb.in/api/bins", {
            method: "POST",
            body: JSON.stringify({
                title: "uwu",
                files: [{
                    content: "i love you so much ❤"
                }]
            })
        })
        const dataProcessed = await data.json()
        console.log(dataProcessed)
        url = `https://srcb.in/${dataProcessed.key}`

        interaction.reply(`Pasted successfully! ${url}`)
    }
} as SlashCommand;