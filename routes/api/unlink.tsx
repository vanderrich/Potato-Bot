import { HandlerContext } from "$fresh/server.ts";
import * as cookie from "cookie";
import { ParseAuthData } from "../../static/apistuff.ts";
import * as discord from "../../static/discordapistuff.ts";

export const handler = {
    async GET(req: Request, _ctx: HandlerContext) {
        const headers = new Headers()
        const authData = ParseAuthData(cookie.getCookies(req.headers)['authData'])
        cookie.deleteCookie(headers, "authData", { path: "/" });
        headers.append('Location', '/')
        await discord.revokeAccess(authData.tokens)
        return new Response("", {
            status: 307,
            headers
        })
    }
}