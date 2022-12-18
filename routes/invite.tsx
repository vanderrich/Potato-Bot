/** @jsx h */
import { HandlerContext } from "$fresh/server.ts";
import { tw } from "@twind";
import { getCookies } from "cookie";
import { h } from "preact";
import TopNav from "../islands/TopNav.tsx";
import { AuthData } from "../static/apistuff.ts";
import { getUserData } from "../static/discordapistuff.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
    const authData: AuthData = JSON.parse(getCookies(req.headers)['authData'])
    const data = await getUserData(authData.tokens)
    return ctx.render(data.user)
}

export default function Invite() {
    return (
        <div class={tw`bg-background`}>
            <TopNav />
            <main>
                <h1 class={tw`text-5xl pl-4`}>Invite me to your Server!</h1>
                <br /><br />
                <div id="inviteLinks" class={tw`flex flex-col justify-around items-center mt-5 lg:flex-row`}>
                    <a href="https://top.gg/bot/894060283373449317" target="_blank">
                        <img src="top.gg.png" alt="top.gg" width="200px" height="200px" class={tw`hover:w-60 hover:h-60`} id="topgg" />
                    </a>

                    <a href="https://discord.bots.gg/bots/894060283373449317" target="_blank">
                        <img src="discord.bots.gg.png" alt="discord.bots.gg" width="200px" height="200px" class={tw`hover:w-60 hover:h-60`} id="discordbotsgg" />
                    </a>

                    <a href="https://discordbotlist.com/bots/potato-bot-1627" target="_blank">
                        <img src="discordbotlist.com.png" alt="discordbotlist.com" width="200px" height="200px" class={tw`hover:w-60 hover:h-60`} id="discordbotlist" />
                    </a>
                </div>
            </main>
        </div>
    );
}