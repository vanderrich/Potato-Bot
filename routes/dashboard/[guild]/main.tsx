/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "cookie";
import { APIUser } from "discord-api-types";
import { h } from "preact";
import SideNav from "../../../islands/DashboardSideNav.tsx";
import TopNav from "../../../islands/TopNav.tsx";
import * as APIStuff from '../../../static/apistuff.ts';
import { getUserData } from "../../../static/discordapistuff.ts";
import { tw } from '@twind'

export const handler: Handlers = {
    async GET(req, ctx) {
        const guildId = ctx.params.guild
        const url = new URL(req.url);
        const formData = url.searchParams
        if (formData.get("submitted")) {
            const ghostPing = formData.get("ghostping") == "true" ? true : false
            console.log(ghostPing)
            await APIStuff.guildSettings.updateOne({ guildId: guildId }, {
                $set: {
                    ghostPing
                }
            })
            return Response.redirect(req.url.split("?")[0])
        }
        const unparsedAuthData = getCookies(req.headers)['authData']
        const authData = APIStuff.ParseAuthData(unparsedAuthData)
        const userData = await getUserData(authData.tokens)
        const guildSettings = await APIStuff.guildSettings.findOne({ guildId: guildId })
        if (guildSettings)
            return ctx.render({ guildSettings, user: userData })
        else {
            const headers = new Headers()
            headers.set("Location", "/invite")
            return new Response('', { status: 307, headers })
        }
    }
}


export default function Server(props: PageProps<{ guildSettings: APIStuff.GuildSettings, user: APIUser }>) {
    const { guildSettings, user } = props.data
    return (<body class={tw`bg-background`}>
        <TopNav user={user} />
        <SideNav guildId={props.params.guild} selected="main" />
        <form>
            <input type="hidden" id="submitted" name="submitted" value="true" />
            <label for="ghostping">Ghost Ping Detection</label>
            <input type="checkbox" id="ghostping" name="ghostping" value="true" checked={guildSettings.ghostPing ? 'checked' : false} /><br />
            <input type="submit" value="Save" class={tw`bg-features-bg text-macaroni-and-cheese cursor-pointer`} />
        </form>
    </body>
    )
}