import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { SlashCommand } from "../../Util/types";
import { config } from "dotenv";
import FormData from "form-data";
config();

type BinType = string & "src" | "haste" | "paste"
const BinAPIURLs: { [K in BinType]: string } = {
    "src": "https://sourceb.in/api/bins",
    "haste": "https://hastebin.com/documents",
    "paste": "https://pastebin.com/api/api_post.php"
}
const BinURLs: { [K in BinType]: string } = {
    "src": "https://srcb.in/",
    "haste": "https://hastebin.com/",
    "paste": "https://pastebin.com/"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("paste")
        .setDescription("Pastes text to a bin specified")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Name of the paste (required for some but not for all, will be ignored if not)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("The text to paste")
        )
        .addStringOption(option =>
            option
                .setName("bin")
                .setDescription("Bin to paste the text, defaults to SourceBin")
                .addChoices(
                    { name: "SourceBin", value: "src" },
                    { name: "HasteBin", value: "haste" },
                    { name: "PasteBin", value: "paste" }
                )
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction, client) {
        await interaction.deferReply()
        const name = interaction.options.getString("name")
        const bin: BinType = interaction.options.getString("bin") as BinType || "src"
        let text = interaction.options.getString("text")
        if (!text) {
            const message = await interaction.channel?.send("Enter the text you want to paste in this channel.");
            const descriptionThingy = await interaction.channel?.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1, time: 30000 });
            text = descriptionThingy?.first()?.content || "";
            message?.delete();
            descriptionThingy?.first()?.delete();
        }
        const binApiUrl = BinAPIURLs[bin]
        const binUrl = BinURLs[bin]

        let body;
        switch (bin) {
            case "src":
                body = {
                    title: name,
                    files: [{
                        content: text
                    }]
                }
                break;

            case "haste":
                body = text;
                break;

            case "paste":
                body = new FormData();
                body.append('api_dev_key', process.env.PASTEBIN_API_KEY);
                body.append('api_paste_code', text);
                body.append('api_option', "paste");
                body.append('api_paste_name', name)
                break;

            default:
                break;
        }

        let url;
        const data = await axios({
            url: binApiUrl,
            method: "post",
            data: body
        });

        console.log(data)
        url = bin == "paste" ? data.data : `${binUrl}${data.data.key}`;

        interaction.editReply(`[Pasted successfully!](${url})`);
    }
} as SlashCommand;