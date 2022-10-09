/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function TopNav() {
    const topNav = tw`float-left text-macaroni-and-cheese text-center py-3.5 px-4 hover:bg-secondary-color bg-sweet-brown lg:text-2xl md:text-base sm:text-sm`;
    return (
        <header>
            <nav class={tw`pl-0.5`}>
                <a href="/" class={tw`float-left px-1.5 pt-1 overflow-hidden bg-main-color hover:bg-secondary-color`}>
                    <img src="potato.png" class={tw`lg:w-15 lg:h-15 md:w-14 md:h-14 sm:w-10 sm:h-10 w-12 h-12`} />
                </a>
                <a href="/status"
                    class={topNav}>
                    Status
                </a>
                <a href="/invite"
                    class={topNav}>
                    Invite
                </a>
                <a href="https://discord.gg/cHj7nErGBa" target="_blank"
                    class={topNav}>
                    Discord Server
                </a>
                <a href="https://github.com/vanderrich/Potato-bot" target="_blank"
                    class={topNav}>
                    Github
                </a>
            </nav>
        </header>
    )
}