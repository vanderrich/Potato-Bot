import { config } from 'dotenv';
import { ETwitterStreamEvent, TweetSearchV2StreamParams, TwitterApi } from 'twitter-api-v2';
import Parser from 'rss-parser'
import { Client } from './types';
config();

const parser = new Parser()

const tClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)
const twitClient = tClient.readOnly.v2
const endPointParamters = {
    'tweet.fields': ['referenced_tweets'],
}

// youtube

async function sendMessage(data: { url: string, username: string }, client: Client) {
    const { url, username } = data
    try {
        const subscriptionDatas = await client.subscriptions.find({ username })
        subscriptionDatas.forEach(async (subscriptionData) => {
            if (!subscriptionData) return
            const webhook = await client.fetchWebhook(subscriptionData.webhookId)
            webhook.send({ content: `[${subscriptionData.text}](${url})` })
        })
    } catch (error) {
        console.error(error);
    }
}

export async function setupSubscriptionsTwitter(client: Client) {
    const rules = (await client.subscriptions.find()).map((subscription) => {
        return {
            value: `from:${subscription.userId}`,
            tag: subscription.username
        }
    })
    const body = {
        "add": rules
    }
    await twitClient.updateStreamRules(body).catch((err) => { console.warn(err) })
    const stream = await twitClient.searchStream((endPointParamters as unknown) as Partial<TweetSearchV2StreamParams>);
    stream.autoReconnect = true;
    try {
        stream.on(ETwitterStreamEvent.Data, async (tweet) => {
            if (tweet.data.referenced_tweets === undefined) {
                sendMessage({ url: "https://twitter.com/user/status/" + tweet.data.id, username: tweet.matching_rules[0].tag }, client);
            }

            stream.on(ETwitterStreamEvent.ConnectionLost, () => stream.reconnect())
        });

    } catch (error) {
        if (error) {
            stream.reconnect();
        }
        else {
            setupSubscriptionsTwitter(client);
        }
    }
}

export async function setupSubscriptionsYoutube(client: Client) {
    const data = await parser.parseURL("https://youtube.com/feeds/videos.xml?channel_id=UCRj9SXOpZtjH_0nflkRqRCg")

}