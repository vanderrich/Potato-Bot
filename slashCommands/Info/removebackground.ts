import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import fetch from "node-fetch";
import { SlashCommand } from "../../Util/types";
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
        fetch('https://api.remove.bg/v1.0/removebg/', {
            body: JSON.stringify({
                image_url: image.url,
                size: 'auto',
            }),
            headers: {
                'X-Api-Key': process.env.REMOVEBG_API_KEY!,
            },
            method: "POST"
        }).then(async (res) => {
            fs.writeFileSync(`./${image.name}`, await res.json());
            const attachment = new MessageAttachment(fs.readFileSync(`./${image.name}`), `${image.name}`);
            interaction.editReply({
                files: [attachment],
            });
            fs.unlinkSync(`./${image.name}`);
        });
    }
} as SlashCommand;