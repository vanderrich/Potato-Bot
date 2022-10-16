import { config } from 'dotenv';
import { ETwitterStreamEvent, TweetSearchV2StreamParams, TwitterApi } from 'twitter-api-v2';
import { Client } from './types';
config();


const tClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)
const twitClient = tClient.readOnly.v2
const endPointParamters = {
    'tweet.fields': ['referenced_tweets'],
}


async function sendMessage(data: { url: string, username: string, name: string }, client: Client) {
    const { url, username, name } = data
    try {
        const subscriptionDatas = await client.subscriptions.find({ username })
        subscriptionDatas.forEach(async (subscriptionData) => {
            if (!subscriptionData) return
            const webhook = await client.fetchWebhook(subscriptionData.webhookId).catch(() => { })
            if (!webhook) return
            webhook.send({ content: `[${subscriptionData.text}](${url})` })
            if (webhook.name != name) webhook.edit({ name });
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
                const userInfo = await twitClient.userByUsername(tweet.matching_rules[0].tag)
                sendMessage({ url: "https://twitter.com/user/status/" + tweet.data.id, username: userInfo.data.username, name: userInfo.data.name }, client);
            }

            stream.on(ETwitterStreamEvent.ConnectionLost, () => stream.reconnect())
        });

    } catch (error) {
        if (error) {
            try {
                stream.reconnect();
            }
            catch(e){}
        }
        else {
            setupSubscriptionsTwitter(client);
        }
    }
}