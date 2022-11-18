/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";

export default function TopNav() {
    const [menu, menuClicked] = useState(false)
    const topNav = tw`text-macaroni-and-cheese text-center py-2 px-4 hover:text-secondary-color text-1xl`;
    const topNavNoPad = tw`text-macaroni-and-cheese hover:text-secondary-color text-1xl px-2`;
    const menuStyle = 'w-7 h-0.5 m-1.5 bg-macaroni-and-cheese transition duration-500';
    const textWImg = tw`text-macaroni-and-cheese text-center mx-2 hover:text-secondary-color text-1xl md:block hidden`;
    return (
        <header>
            <nav class={tw`p-4 bg-background flex justify-between`}>
                <a href="/" class={tw`m-1.5 flex`}>
                    <img src="potato.png" class={tw`w-7 h-7`} />
                    <div class={textWImg}>
                        Potato Bot
                    </div>
                </a>
                <div class={tw`md:flex flex-row-reverse hidden`}>
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
                </div>
                <div class={tw`md:hidden flex justify-end`}>
                    <div onClick={() => menuClicked(!menu)} class={tw`m-1.5`}>
                        <div class={menu ? tw`${menuStyle} translate-y-1.5 -rotate-45` : tw`${menuStyle}`}></div>
                        <div class={menu ? tw`${menuStyle} opacity-0` : tw`${menuStyle}`}></div>
                        <div class={menu ? tw`${menuStyle} -translate-y-2.5 rotate-45` : tw`${menuStyle}`}></div>
                    </div>
                </div>
            </nav>
            <ul class={menu ? tw`border-1 rounded-2xl border-macaroni-and-cheese p-2 md:hidden` : tw`hidden`}>
                <li>
                    <a href="/status"
                        class={topNavNoPad}>
                        Status
                    </a>
                </li>
                <li>
                    <a href="/invite"
                        class={topNavNoPad}>
                        Invite
                    </a>
                </li>
                <li>
                    <a href="https://discord.gg/cHj7nErGBa" target="_blank"
                        class={topNavNoPad}>
                        Discord Server
                    </a>
                </li>
                <li>
                    <a href="https://github.com/vanderrich/Potato-bot" target="_blank"
                        class={topNavNoPad}>
                        Github
                    </a>
                </li>
            </ul>
        </header>
    )
}