// const cheerio = require('cheerio');
// const request = require('request');
// const separateReqPool = { maxSockets: 15 };
// const async = require('async');
// const sendDiscordMessage = async (pl, socialMedia, client) => {
//     const { content, turl, author } = pl;
//     console.log(pl);
//     console.log(socialMedia);
//     if (socialMedia === "twitter") {
//         const { webhook, avatar_url } = await client.twitterHandlers.findOne({ url: turl });
//         request.post(webhook).form({ username: author, avatar_url: avatar_url, content: content });
//     } else if (socialMedia === "youtube") {
//         const { webhook, avatar_url } = await client.youtubeHandlers.findOne({ url: turl });
//         request.post(webhook).form({ username: author, avatar_url: avatar_url, content: content });
//     }
// }

// const { subscriptionCheckTime } = require('../config.json');


// const Parser = require("rss-parser"),
//     parser = new Parser(),
//     Youtube = require("simple-youtube-api"),
//     youtube = new Youtube(process.env.YOUTUBE_API_KEY);

// const startAt = 1651899600000;
// const lastVideos = {};


// class Util {
//     /**
//  * Format a date to a readable string
//  * @param {Date} date The date to format
//  */
//     static formatDate(date) {
//         let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//         let day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
//         return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
//     }

//     /**
//      * Get the youtube channel id from an url
//      * @param {string} url The URL of the youtube channel
//      * @returns The channel ID || null
//      */
//     static getYoutubeChannelIdFromURL(url) {
//         let id = null;
//         url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
//         if (url[2]) {
//             id = url[2].split(/[^0-9a-z_-]/i)[0];
//         }
//         return id;
//     }

//     /**
//      * Get infos for a youtube channel
//      * @param {string} name The name of the youtube channel or an url
//      * @returns The channel info || null
//      */
//     static async getYoutubeChannelInfos(name) {
//         console.log(`[${name.length >= 10 ? name.slice(0, 10) + "..." : name}] | Resolving channel infos...`);
//         let channel = null;
//         /* Try to search by ID */
//         let id = this.getYoutubeChannelIdFromURL(name);
//         console.log(id)
//         if (id) {
//             channel = await youtube.getChannelByID(id);
//             console.log(channel)
//         }
//         if (!channel) {
//             /* Try to search by name */
//             let channels = await youtube.searchChannels(name);
//             console.log(channels)
//             if (channels.length > 0) {
//                 channel = channels[0];
//             } else {
//                 return null
//             }
//         }
//         console.log(`[${name.length >= 10 ? name.slice(0, 10) + "..." : name}] | Title of the resolved channel: ${channel.raw ? channel.raw.snippet.title : "err"}`);
//         return channel;
//     }


//     /**
//      * Call a rss url to get the last video of a youtuber
//      * @param {string} youtubeChannelName The name of the youtube channel
//      * @param {string} rssURL The rss url to call to get the videos of the youtuber
//      * @returns The last video of the youtuber
//      */
//     static async getLastVideo(youtubeChannelName, rssURL) {
//         let content = await parser.parseURL(rssURL);
//         let tLastVideos = content.items.sort((a, b) => {
//             let aPubDate = new Date(a.pubDate || 0).getTime();
//             let bPubDate = new Date(b.pubDate || 0).getTime();
//             return bPubDate - aPubDate;
//         });
//         return tLastVideos[0];
//     }

//     /**
//      * Check if there is a new video from the youtube channel
//      * @param {string} youtubeChannelName The name of the youtube channel to check
//      * @param {string} rssURL The rss url to call to get the videos of the youtuber
//      * @returns The video || null
//      */
//     static async checkVideos(youtubeChannelName, rssURL) {
//         let lastVideo = await this.getLastVideo(youtubeChannelName, rssURL);
//         // If there isn't any video in the youtube channel, return
//         if (!lastVideo) return;
//         // If the date of the last uploaded video is older than the date of the bot starts, return
//         if (new Date(lastVideo.pubDate).getTime() < startAt) return;
//         let lastSavedVideo = lastVideos[youtubeChannelName];
//         // If the last video is the same as the last saved, return
//         if (lastSavedVideo && (lastSavedVideo.id === lastVideo.id)) return;
//         return lastVideo;
//     }
// }


// function setupTwitter(client, mongoose) {
//     client.tweets = {}
//     client.twitterApiUrls = []

//     client.twitterHandlers = mongoose.model('twitterHandlers', new mongoose.Schema({
//         name: String,
//         url: String,
//         webhook: String,
//         avatar_url: String,
//         keywords: String,
//     }));
//     client.twitterHandlers.find({}, (err, twitterHandlers) => {
//         twitterHandlers.forEach(twitterHandler => {
//             client.tweets[twitterHandler.url] = [];
//             client.twitterApiUrls.push(twitterHandler.url);
//         });
//     });



//     setInterval(() => {
//         async.map(client.twitterApiUrls, function (item, callback) {
//             request({ url: item, pool: separateReqPool }, function (error, response, body) {
//                 try {
//                     console.log(body, response, error, item)
//                     const $ = cheerio.load(body);
//                     console.log($);
//                     var turl = "https://twitter.com" + response.req.path;
//                     if (!client.tweets[turl].length) {
//                         //FIRST LOAD
//                         for (let i = 0; i < $('div.js-tweet-text-container p').length; i++) {
//                             client.tweets[turl].push($('div.js-tweet-text-container p').eq(i).text());
//                         }
//                     }
//                     else {
//                         //EVERY OTHER TIME
//                         for (let i = 0; i < $('div.js-tweet-text-container p').length; i++) {
//                             //GET THE LINK TO THE TWEET
//                             let s_tweet = $('div.js-tweet-text-container p').eq(i).text();
//                             //CHECK IF TWEET IS NEWS
//                             if (client.tweets[turl].indexOf(s_tweet) === -1) {
//                                 client.tweets[turl].push(s_tweet);

//                                 sendDiscordMessage({ content: s_tweet, turl: turl }, "twitter", client);
//                             }
//                         }
//                     }

//                 } catch (e) {
//                     console.log('Error =>' + e);
//                 }
//             });
//         }, function (err, results) { });
//     }, subscriptionCheckTime);
// }

// function setupYoutube(client, mongoose) {
//     client.youtubeApiUrls = []
//     client.youtubeHandlers = mongoose.model('youtubeHandlers', new mongoose.Schema({
//         name: String,
//         url: String,
//         webhook: String,
//         avatar_url: String,
//         keywords: String,
//     }));
//     client.youtubeHandlers.find({}, (err, youtubeHandlers) => {
//         youtubeHandlers.forEach(youtubeHandler => {
//             client.youtubeApiUrls.push(youtubeHandler.name);
//         });
//     });

//     setInterval(() => {
//         client.youtubeApiUrls.forEach(async (youtuber) => {
//             console.log(youtuber)
//             let channelInfos = await Util.getYoutubeChannelInfos(youtuber);
//             if (!channelInfos) return;
//             console.log(channelInfos);
//             let video = await Util.checkVideos(channelInfos.raw.snippet.title, "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelInfos.id);
//             if (!video) return;
//             console.log(video)
//             sendDiscordMessage({ content: video.link, turl: channelInfos.url, author: channelInfos.author }, "youtube", client);
//             lastVideos[channelInfos.raw.snippet.title] = video;
//         });
//     }, subscriptionCheckTime);
// }

// module.exports = function (client, mongoose) {
//     setupTwitter(client, mongoose);
//     setupYoutube(client, mongoose);
// }