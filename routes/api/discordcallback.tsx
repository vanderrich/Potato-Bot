import { HandlerContext } from "$fresh/server.ts";
import * as discord from "../../static/discordapistuff.ts";
import * as cookie from "cookie";
import * as APIStuff from "../../static/apistuff.ts";
import { setCookie } from "https://deno.land/std@0.161.0/http/mod.ts";

export const handler = {
    async GET(req: Request, ctx: HandlerContext) {
        try {
            const query = new URL(req.url).searchParams;
            // 1. Uses the code and state to acquire Discord OAuth2 tokens
            const code = query.get('code')!;
            const discordState = query.get('state')!;

            // make sure the state parameter exists
            const clientState = cookie.getCookies(req.headers)["clientState"];
            if (clientState !== discordState) {
                return new Response('State verification failed.', { status: 403 });
            }

            const tokens = await discord.getOAuthTokens(code);

            // 2. Uses the Discord Access Token to fetch the user profile
            const meData = await discord.getUserData(tokens);
            const userId = meData.user!.id;
            await APIStuff.StoreDiscordTokens(userId, {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: Date.now() + tokens.expires_in * 1000,
            });

            const headers = new Headers;
            setCookie(headers, {
                name: "userId",
                value: userId,
                secure: true,
                path: "/",
                expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())
            })
            headers.append("Location", "/")
            console.log(headers)

            // 3. Update the users metadata, assuming future updates will be posted to the `/update-metadata` endpoint
            await discord.updateMetadata(userId);
            return new Response("", {
                status: 307,
                headers
            })
        } catch (e) {
            console.error(e);
            return new Response(e, { status: 500 });
        }
    }
}