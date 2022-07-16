/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import TopNav from "../islands/TopNav.tsx";
import { apiStuff } from "../static/apistuff.ts"
import { Handlers, PageProps } from "$fresh/server.ts";
const { errors, uptime, online } = apiStuff;

export const handler: Handlers = {
    async GET(_req, ctx) {
        const discordStatusResponse = await fetch("https://discordstatus.com/api/v2/summary.json");
        const herokuStatusResponse = await fetch("https://status.heroku.com/api/v4/current-status");
        const discordStatus = discordStatusResponse.status == 200 ? await discordStatusResponse.json() : "Error while fetching status from discord";
        const herokuStatus = herokuStatusResponse.status == 200 ? await herokuStatusResponse.json() : "Error while fetching status from heroku";
        return ctx.render({ discordStatus, herokuStatus });
    },
};

export default function Status(props: PageProps) {
    const status = online ? "Online" : "Offline";
    const ms_num = uptime;
    const days = Math.floor(ms_num / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms_num / 1000 / 60 / 60) % 24);
    const minutes = Math.floor((ms_num / 1000 / 60) % 60);
    const uptimeFormatted = `${days} days, ${hours} hours, ${minutes} minutes`;
    console.log({ uptime, uptimeFormatted, days, hours, minutes });
    return (
        <div class={tw`bg-background h-screen`}>
            <TopNav /><br /><br /><br />
            <main>
                <h1 class={tw`text-5xl pb-3`}>Status</h1>
                <p>Status: {status}</p>
                <p>Uptime: {status} for {uptimeFormatted}</p>
                <p>Heroku Status: {props.data.herokuStatus instanceof String ? props.data.herokuStatus : props.data.herokuStatus.status.map((status: { system: string, status: string }) => {
                    return (<li>
                        {status.system}: {status.status}
                    </li>)
                })}Incidents: <ul>
                        {
                            props.data.herokuStatus.incidents.map((incident: { id: string, title: string }) => {
                                return (<li>
                                    <a href={`https://status.heroku.com/incidents/${incident.id}`} target="_blank">{incident.title}</a>
                                </li>)
                            })
                        }
                    </ul>
                </p>
                <h3 class={tw`text-3xl`}>Latest Errors</h3>
                <ul>
                    <div>
                        {errors.map((error) => {
                            return (
                                <li>
                                    <a href={`/error/${error.id}`}><span>{error.id.slice(0, 4)}...</span> -
                                        <strong>{error.error}</strong></a>
                                </li>
                            )
                        })}
                        {errors.length === 0 ? <p> No Errors, yay! </p> : null}
                    </div>
                </ul>
            </main>
        </div >
    );
}