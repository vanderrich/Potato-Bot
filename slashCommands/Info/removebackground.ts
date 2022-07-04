import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment } from "discord.js";
import fs from "fs";
import { SlashCommand } from "../../Util/types";
import axios from "axios";
import { AxiosResponse } from "axios";

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
        await interaction.deferReply();
        const image = interaction.options.getAttachment('image');
        if (!image) return interaction.editReply("Please attach an image to remove the background from");
        axios.post('https://api.remove.bg/v1.0/removebg/', {
            image_url: image.url,
            size: 'auto',
        }, {
            headers: {
                'X-Api-Key': process.env.REMOVEBG_API_KEY!,
            }
        }).then((res) => {
            fs.writeFileSync(`./${image.name}`, res.data);
            const attachment = new MessageAttachment(fs.readFileSync(`./${image.name}`), `${image.name}`);
            interaction.editReply({
                files: [attachment],
            });
            fs.unlinkSync(`./${image.name}`);
        });
    }
} as SlashCommand;