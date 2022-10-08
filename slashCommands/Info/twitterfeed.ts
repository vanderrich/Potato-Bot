import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseGuildTextChannel } from "discord.js";
import { config } from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { SlashCommand } from "../../Util/types";
config()

const defaultImageURL = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'

module.exports = {
    data: new SlashCommandBuilder()
        .setName("twitterfeed")
        .setDescription("Get notified whenever your favorite accounts tweets!")
        .addStringOption(option =>
            option
                .setName("username")
                .setDescription("The username of the twitter account, protected accounts wont work")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel to send the tweets to")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("The message content of the tweet notifications")
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction, client) {
        const username = interaction.options.getString("username")!
        const channel = interaction.options.getChannel("channel")!
        const text = interaction.options.getString("text") || "Tweeted"
        const tClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)
        const twitterClient = tClient.v2
        const userInfo = await twitterClient.userByUsername(username)
        if (!userInfo.data.id) return interaction.reply("Couldn't find user with that username");
        if (!(channel instanceof BaseGuildTextChannel)) return interaction.reply("Channel cant be a category channel")
        const webhook = await channel.createWebhook(`${username}`, { avatar: userInfo.data.profile_image_url || defaultImageURL })
        const subscription = new client.subscriptions({
            type: "Twitter",
            text,
            username,
            userId: userInfo.data.id,
            webhookId: webhook.id
        })
        subscription.save()
        interaction.reply("Feed created!")
    },
} as SlashCommand;