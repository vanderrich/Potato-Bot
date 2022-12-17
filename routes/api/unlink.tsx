import { HandlerContext } from "$fresh/server.ts";
import * as discord from "../../static/discordapistuff.ts";
import * as cookie from "cookie";

export const handler = {
    async GET(req: Request, _ctx: HandlerContext) {
        const headers = new Headers()
        const userId = cookie.getCookies(req.headers)['userId']
        cookie.deleteCookie(headers, "userId", { path: "/" });
        headers.append('Location', '/')
        await discord.revokeAccess(userId)
        return new Response("", {
            status: 307,
            headers
        })
    }
}