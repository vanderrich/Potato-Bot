import { HandlerContext } from "$fresh/server.ts";
import * as discord from "../../static/discordapistuff.ts";
import * as cookie from "cookie";

export const handler = {
    GET(_req: Request, _ctx: HandlerContext) {
        const { url, state } = discord.getOAuthUrl();
        const headers = new Headers

        // Store the signed state param in the user's cookies so we can verify
        // the value later. See:
        // https://discord.com/developers/docs/topics/oauth2#state-and-security

        cookie.setCookie(headers, { name: 'clientState', value: state, maxAge: 1000 * 60 * 5, secure: true });
        headers.append("Location", url)

        // Send the user to the Discord owned OAuth2 authorization endpoint
        return new Response("", {
            status: 307,
            headers
        })
    }
}