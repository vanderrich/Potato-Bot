/** @jsx h */
import { tw } from '@twind';
import { h } from "preact";

export default function SideNav({ guildId, selected }: { guildId: string, selected: string }) {
    const sidenavEl = (name: string, url: string, icon: string, selected: boolean) => <li class={selected ? tw`py-4 bg-secondary-color` : tw`py-4 hover:bg-secondary-color`}>
        <a href={`/dashboard/${guildId}/${url}`} class={tw`text-macaroni-and-cheese py-4 w-48 leading-none`}>
            <span class={selected ? tw`text-main-color flex` : tw`flex`}>
                <i class={tw`fa fa-${icon} mx-2`} aria-hidden="true" /><div class={tw`hidden md:block`}>{name}</div>
            </span>
        </a>
    </li>

    return <ul class={tw`md:w-48 bg-features-bg float-left`}>
        <li class={tw`pl-2 py-2 text-sm text-macaroni-and-cheese hidden md:block`}>Utility</li>
        {sidenavEl("Miscellaneous", "main", "gear", selected == "main")}
        {sidenavEl("Welcome", "welcome", "sign-in", selected == "welcome")}
        {sidenavEl("Tags", "tags", "tags", selected == "tags")}
        {sidenavEl("Stat Channels", "stats", "bar-chart", selected == "stats")}
        {sidenavEl("Reaction Roles", "reactroles", "smile-o", selected == "reactroles")}
        {sidenavEl("Tickets", "tickets", "ticket", selected == "tickets")}
        {sidenavEl("Birthdays", "birthdays", "birthday-cake", selected == "birthdays")}
        {sidenavEl("Suggestions", "suggestions", "lightbulb", selected == "suggestions")}
        <li class={tw`pl-2 py-2 text-sm text-macaroni-and-cheese hidden md:block`}>Social Media</li>
        {sidenavEl("Twitter", "twitter", "twitter", selected == "twitter")}
    </ul>
}