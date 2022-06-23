import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment } from "discord.js";
import request from "request";
import fs from "fs";
import { SlashCommand } from "../../Util/types";

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
    async execute(interaction: CommandInteraction) {
        const image = interaction.options.getAttachment('image');
        if (!image) return interaction.reply("Please attach an image to remove the background from");
        request.post({
            url: 'https://api.remove.bg/v1.0/removebg/',
            formData: {
                image_url: image.url,
                size: 'auto',
            },
            headers: {
                'X-Api-Key': process.env.REMOVEBG_API_KEY,
            },
            encoding: null
        }, function (error: any, response: any, body: any) {
            console.log("e");
            if (error) return console.error('Request failed:', error);
            if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString());
            fs.writeFileSync(`./${image.name}.png`, body);
            const attachment = new MessageAttachment(fs.readFileSync(`./${image.name}.png`), `${image.name}.png`);
            interaction.reply({
                files: [attachment],
            });
            fs.unlinkSync(`./${image.name}.png`);
        });
    }
} as SlashCommand;