import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import axios from "axios";
import { SlashCommand } from "../../Util/types";
import FormData from "form-data";
config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removebackground')
        .setDescription('Remove background')
        .addAttachmentOption(option => option
            .setName('image')
            .setDescription('Image to remove background from')
            .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction) {
        await interaction.deferReply();
        const image = interaction.options.getAttachment('image');
        if (!image) return interaction.editReply("Please attach an image to remove the background from");
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_url', image.url);

        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': process.env.REMOVEBG_API_KEY,
            }
        }).then(async (res) => {
            console.log(res.data)
            fs.writeFileSync(`./${image.name}`, res.data);
            const img = fs.readFileSync(`./${image.name}`)
            const attachment = new MessageAttachment(img, `${image.name}`);
            await interaction.editReply({
                files: [attachment],
            })
            fs.unlinkSync(`./${image.name}`);
        });
    }
} as SlashCommand;