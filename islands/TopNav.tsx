/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";

export default function TopNav() {
    const [menu, menuClicked] = useState(false)
    const topNav = tw`text-macaroni-and-cheese text-center py-3.5 px-4 hover:text-secondary-color text-1xl`;
    const topNavNoPad = tw`text-macaroni-and-cheese hover:text-secondary-color text-1xl px-2`;
    const menuStyle = 'w-7 h-0.5 m-1.5 bg-main-color transition duration-500'
    return (
        <header>
            <nav class={tw`p-2 bg-background z-10 relative`}>
                <a href="/" class={tw`fixed flex w-auto py-2 px-3 m-1.5 overflow-hidden box-border`}>
                    <div>
                        <img src="potato.png" class={tw`w-7 h-7 box-border`} />
                    </div>
                    <div class={tw`text-macaroni-and-cheese text-center ml-2 hover:text-secondary-color text-1xl md:block hidden`}>
                        Potato Bot
                    </div>
                </a>
                <div class={tw`fixed right-5 top-5.5 md:block hidden`}>
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
                <div class={tw`md:hidden fixed right-5 top-5.5`}>
                    <div onClick={() => menuClicked(!menu)} class={tw`fixed right-5`}>
                        <div class={menu ? tw`${menuStyle} mt-0 translate-y-2.5 rotate--45 w-8` : tw`${menuStyle}`}></div>
                        <div class={menu ? tw`${menuStyle} mt-0 opacity-0` : tw`${menuStyle}`}></div>
                        <div class={menu ? tw`${menuStyle} mt-0 translate-y--2.5 rotate-45 w-8` : tw`${menuStyle}`}></div>
                    </div>
                    <ul class={menu ? tw`block border-1 rounded-2xl p-2 mt-9 float-right` : tw`hidden`}>
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
                </div>
            </nav>
        </header >
    )
}