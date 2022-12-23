/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from '@twind';
import { getCookies } from "cookie";
import { APIGuildChannel, APIRole, APIUser, TextChannelType } from "discord-api-types";
import { h } from "preact";
import SideNav from "../../../islands/DashboardSideNav.tsx";
import TopNav from "../../../islands/TopNav.tsx";
import * as APIStuff from '../../../static/apistuff.ts';
import { getGuildChannels, getGuildRoles, getUserData } from "../../../static/discordapistuff.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const formData = url.searchParams
        const guildId = ctx.params.guild
        if (formData.get("submitted")) {
            await APIStuff.guildSettings.updateOne({ guildId: guildId }, {
                $set: {
                    welcomeMessage: formData.get("msg")!,
                    welcomeChannel: formData.get("channel")!,
                    welcomeRole: formData.get("role")!
                }
            })
        }
        const unparsedAuthData = getCookies(req.headers)['authData']
        const authData = APIStuff.ParseAuthData(unparsedAuthData)
        const userData = await getUserData(authData.tokens)
        const guildSettings = await APIStuff.guildSettings.findOne({ guildId: guildId })
        const guildChannels = await getGuildChannels(guildId)
        const guildRoles = await getGuildRoles(guildId)
        if (guildSettings)
            return ctx.render({ guildSettings, guildData: { channels: guildChannels, roles: guildRoles }, user: userData })
        else {
            const headers = new Headers()
            headers.set("Location", "/invite")
            return new Response('', { status: 307, headers })
        }
    }
}


export default function Server(props: PageProps<{ guildSettings: APIStuff.GuildSettings, guildData: { channels: APIGuildChannel<any>[], roles: APIRole[] }, user: APIUser }>) {
    const { guildSettings, guildData, user } = props.data
    console.log(guildSettings)
    return (
        <body class={tw`bg-background`}>
            <TopNav user={user} />
            <SideNav guildId={props.params.guild} selected="welcome" />
            <form>
                <div class={tw`p-4`}>
                    <input type="hidden" id="submitted" name="submitted" value="true" />
                    <label for="msg">Welcome Message:</label><br />
                    <input class={tw`text-macaroni-and-cheese bg-features-bg`} id="msg" name="msg" value={guildSettings.welcomeMessage} /><br />
                    <label for="channel">Welcome Channel:</label><br />
                    <select class={tw`text-macaroni-and-cheese bg-features-bg`} id="channel" name="channel">
                        <option class={tw`bg-features-bg`} value="" selected={guildSettings.welcomeChannel ? false : 'selected'}>Select a channel</option>
                        {(guildData.channels.filter((channel) => channel.type === 0) as APIGuildChannel<TextChannelType>[]).sort((a, b) => a!.position! - b!.position!).map((channel) => <option class={tw`text-macaroni-and-cheese bg-features-bg`} value={channel.id} selected={guildSettings.welcomeChannel == channel.id ? 'selected' : false}>{channel.name}</option>)}
                    </select><br />
                    <label for="role">Welcome Role:</label><br />
                    <select class={tw`text-macaroni-and-cheese bg-features-bg`} id="role" name="role">
                        <option class={tw`bg-features-bg`} value="" selected={guildSettings.welcomeRole ? false : 'selected'}>Select a role</option>
                        {guildData.roles.sort((a, b) => b.position - a.position).map((role) => <option class={tw`text-macaroni-and-cheese bg-features-bg`} value={role.id} selected={guildSettings.welcomeRole == role.id ? 'selected' : false}>{role.name}</option>)}
                    </select><br />
                    <input type="submit" value="Save" class={tw`bg-features-bg text-macaroni-and-cheese cursor-pointer`} />
                </div>
            </form>
        </body>
    )
}