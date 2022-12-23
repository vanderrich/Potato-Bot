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
        console.log(guildId)
        const url = new URL(req.url);
        const formData = url.searchParams
        if (formData.get("submitted")) {
            const guildSettings = (await APIStuff.guildSettings.findOne({ guildId: guildId }))!
            await APIStuff.guildSettings.updateOne({ guildId: guildId }, {
                $set: {
                    tags: guildSettings.tags.concat([{ name: formData.get("name")!, value: formData.get("id")! }]),
                    [`tagDescriptions.${formData.get("id")!}`]: formData.get("description")!
                }
            })
            console.log(guildSettings)
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
    const tags: { name: string, id: string, description: string }[] = [];
    guildSettings.tags.forEach((tag) => {
        tags.push({ name: tag.name, id: tag.value, description: guildSettings.tagDescriptions[tag.value]! })
    })
    console.log(tags)
    return (<body class={tw`bg-background`}>
        <TopNav user={user} />
        <SideNav guildId={props.params.guild} selected="tags" />
        <table>
            <tr class={tw`text-main-color divide-x divide-sweet-brown`}>
                <th>Name</th>
                <th>Identifier</th>
                <th>Content</th>
            </tr>
            <tr class={tw`divide-x divide-sweet-brown`}>
                <form>
                    <input type="hidden" id="submitted" name="submitted" value="true" />
                    <td><input type="text" name="name" id="name" size={10} class={tw`bg-features-bg text-macaroni-and-cheese rounded-md m-1`} /></td>
                    <td><input type="text" name="id" id="id" size={10} class={tw`bg-features-bg text-macaroni-and-cheese rounded-md m-1`} /></td>
                    <td><input type="text" name="description" id="description" class={tw`bg-features-bg text-macaroni-and-cheese rounded-md m-1 w-full`} /></td>
                    <td><input type="submit" value="+ Create new tag" class={tw`m-1 px-1 rounded bg-features-bg text-macaroni-and-cheese`} /></td>
                </form>
            </tr>
            {tags.map((tag) => <tr class={tw`text-macaroni-and-cheese divide-x divide-sweet-brown even:bg-features-bg`}>
                <td>{tag.name}</td>
                <td>{tag.id}</td>
                <td>{tag.description}</td>
            </tr>)}
        </table>
    </body>
    )
}