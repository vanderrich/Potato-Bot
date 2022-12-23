/** @jsx h */
import { HandlerContext, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import { getCookies } from "cookie";
import { APIGuild, APIUser } from "discord-api-types";
import { h } from "preact";
import TopNav from "../islands/TopNav.tsx";
import { ParseAuthData } from "../static/apistuff.ts";
import { getUserData, getUserGuilds } from "../static/discordapistuff.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
    const unparsedAuthData = getCookies(req.headers)['authData']
    if (unparsedAuthData) {
        const authData = ParseAuthData(unparsedAuthData)
        const data = await getUserData(authData.tokens)
        const guilds = await getUserGuilds(authData.tokens)
        return ctx.render({ user: data.user, guilds })
    } else return ctx.render()
}

export default function Home({ data }: PageProps<{ user: APIUser, guilds: APIGuild[] }>) {
    const guilds = data.guilds.filter((guild) => (parseInt(guild.permissions!) & 1 << 5) == 1 << 5)
    console.log(guilds)
    return (
        <body class={tw`bg-background`}>
            <TopNav user={data.user} />
            <main>
                <h1 class={tw`text-5xl pl-4`}>Dashboard</h1>
                <h3 class={tw`text-2xl pl-4`}>Servers</h3>
                <div class={tw`flex flex-wrap mt-5 px-4`}>
                    {guilds.map((guild) => <a href={`/dashboard/${guild.id}/main`} class={tw`bg-features-bg w-40 m-2 text-center grow rounded-lg hover:-translate-y-2 hover:bg-secondary-color`}>
                        <div class={guild.icon ? 'mx-auto h-32 w-32 mt-4' : tw`mx-auto h-32 w-32 rounded-lg mt-4 bg-default-guild text-default-guild-text`}>
                            <img class={tw`m-auto rounded-lg`} src={guild.icon ? guild.icon.startsWith('a_') ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif?size=128` : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128` : ``} />
                            <div class={tw`font-black leading-[128px]`}>{guild.icon ? '' : guild.name.split(' ').map((v) => v.charAt(0).toUpperCase())}</div>
                        </div>
                        {guild.name}
                    </a>)}
                </div>
            </main>
        </body>
    );
}