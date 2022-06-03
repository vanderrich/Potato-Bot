"use strict";
// const { SlashCommandBuilder } = require("@discordjs/builders");
// const twitterAvatar = "https://cdn.discordapp.com/avatars/972346560727896075/d86769a243b9a59dd554fdf326e22f96.webp"
// const youtubeAvatar = "./assets/youtube.png"
// const getYoutubeChannelIdFromURL = (url, socialmedia) => {
//     if (socialmedia === "youtube") {
//         let id = null;
//         url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
//         if (url[2]) {
//             id = url[2].split(/[^0-9a-z_-]/i)[0];
//         }
//         return id;
//     } else if (socialmedia === "twitter") {
//         return url.replace(/(>|<)/gi, "").split(/[^0-9a-z_-]/i)[0];
//     }
// }
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("subscribe")
//         .setDescription("Send a message to a channel every time someone does something.")
//         .addChannelOption(option => option
//             .setName("channel")
//             .setDescription("The channel to send the message to.")
//             .setRequired(true)
//         )
//         .addStringOption(option => option
//             .setName("socialmedia")
//             .setDescription("The social media to subscribe to.")
//             .addChoice("Twitter", "twitter")
//             .addChoice("YouTube", "youtube")
//             .setRequired(true)
//         )
//         .addStringOption(option => option
//             .setName("url")
//             .setDescription("The url of the person's social media to subscribe to.")
//             .setRequired(true)
//         ),
//     category: "Moderation",
//     permission: "MANAGE_WEBHOOKS",
//     async execute(interaction, client, Discord, footer) {
//         if (!interaction.guild.me.permissions.has("MANAGE_WEBHOOKS")) {
//             return interaction.reply("I do not have the permission to manage webhooks.");
//         }
//         const channel = interaction.options.getChannel("channel");
//         const socialMedia = interaction.options.getString("socialmedia");
//         const url = interaction.options.getString("url");
//         if (!url) return interaction.reply("Specify an url.");
//         await interaction.deferReply({ fetchReply: true });
//         switch (socialMedia) {
//             case "twitter":
//                 const username = getYoutubeChannelIdFromURL(url, "twitter");
//                 let webhook = await channel.fetchWebhooks();
//                 webhook.forEach(async hook => {
//                     if (hook.avatarURL() === twitterAvatar) {
//                         webhook = hook;
//                     }
//                 });
//                 if (!webhook.name) {
//                     await channel.createWebhook('Twitter', {
//                         avatar: twitterAvatar,
//                     }).then(hook => {
//                         webhook = hook;
//                     }).catch(err => {
//                         interaction.editReply(`There was an error while creating the webhook: ${err}`);
//                         return console.log('Error while creating webhook: ' + err);
//                     });
//                 }
//                 const twitterSubscription = new client.twitterHandlers({
//                     name: username,
//                     url: url,
//                     webhook: webhook.url,
//                     avatar_url: twitterAvatar,
//                     keywords: "*",
//                 });
//                 twitterSubscription.save();
//                 client.tweets[url] = [];
//                 client.twitterApiUrls.push(url);
//                 break;
//             case "youtube":
//                 const channelId = getYoutubeChannelIdFromURL(url, "youtube");
//                 let youtubeWebhook = await channel.fetchWebhooks();
//                 youtubeWebhook.forEach(async hook => {
//                     if (hook.avatarURL() === youtubeAvatar) {
//                         youtubeWebhook = hook;
//                     }
//                 });
//                 if (!youtubeWebhook.name) {
//                     await channel.createWebhook('YouTube', {
//                         avatar: youtubeAvatar,
//                     }).then(hook => {
//                         youtubeWebhook = hook;
//                     }).catch(err => {
//                         interaction.editReply(`There was an error while creating the webhook: ${err}`);
//                         return console.log('Error while creating webhook: ' + err);
//                     });
//                 }
//                 const youtubeSubscription = new client.youtubeHandlers({
//                     name: channelId,
//                     url: url,
//                     webhook: youtubeWebhook.url,
//                 });
//                 youtubeSubscription.save();
//                 client.youtubeApiUrls.push(url);
//                 break;
//         }
//         interaction.editReply(`Subscribed to ${url}.`);
//     }
// }
