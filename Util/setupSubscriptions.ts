import { config } from 'dotenv';
import { ETwitterStreamEvent, TweetSearchV2StreamParams, TweetV2SingleStreamResult, TwitterApi } from 'twitter-api-v2';
import { Client } from './types';
config();
const tClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)
const twitClient = tClient.readOnly.v2
const endPointParamters = {
    'tweet.fields': ['referenced_tweets'],
}

async function sendMessage(tweet: TweetV2SingleStreamResult, client: Client) {
    const url = "https://twitter.com/user/status/" + tweet.data.id;
    try {
        const subscriptionDatas = await client.subscriptions.find({ username: tweet.matching_rules[0].tag })
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
    await twitClient.updateStreamRules(body).catch((err) => { console.log(err) }).then(() => console.log("e"))
    const stream = await twitClient.searchStream((endPointParamters as unknown) as Partial<TweetSearchV2StreamParams>);
    stream.autoReconnect = true;
    try {
        stream.on(ETwitterStreamEvent.Data, async (tweet) => {
            if (tweet.data.referenced_tweets === undefined) {
                console.log(tweet)
                sendMessage(tweet, client);
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

// setupSubscriptionsTwitter();
// while (true) { }