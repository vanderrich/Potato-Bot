/** @jsx h */
import { tw } from "@twind";
import { APIUser } from "discord-api-types";
import { h } from "preact";
import { useState } from "preact/hooks";
import { Head } from "$fresh/runtime.ts";

export default function TopNav({ user }: { user?: APIUser }) {
    const [menu, menuClicked] = useState(false)
    const [userMenu, uMenuClicked] = useState(false)
    const topNav = tw`text-macaroni-and-cheese text-center py-2 px-4 hover:text-secondary-color text-1xl`;
    const topNavNoPad = tw`text-macaroni-and-cheese hover:text-secondary-color text-1xl px-2`;
    const menuStyle = 'w-7 h-0.5 m-1.5 bg-macaroni-and-cheese transition duration-500';
    const textWImg = tw`text-macaroni-and-cheese text-center mx-2 text-1xl md:block hidden`;
    return (
        <div>
            <Head>
                <script src="https://kit.fontawesome.com/4495e5dfc6.js" crossOrigin="anonymous"></script>
            </Head>
            <header>
                <nav class={tw`p-4 bg-background flex justify-between`}>
                    <a href="/" class={tw`m-1.5 flex`}>
                        <img src="potato.png" class={tw`w-7 h-7`} />
                        <div class={textWImg}>
                            <div class={tw`hover:text-secondary-color`}>
                                Potato Bot
                            </div>
                        </div>
                    </a>
                    <div class={tw`md:flex flex-row-reverse hidden`}>
                        <div>
                            {user ?
                                <div>
                                    <div onClick={() => uMenuClicked(!userMenu)} class={tw`m-1.5 flex border rounded-full border-macaroni-and-cheese ${userMenu ? '' : 'hover:'}bg-features-bg p-1`}>
                                        <img width="25" class={tw`rounded`} src={user?.avatar ? user?.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator}.png`} />
                                        <div class={textWImg}>{user?.username}
                                            <i width="10" class={`fa-solid fa-caret-${userMenu ? 'up' : 'down'} ${tw`ml-2`}`} /></div>
                                    </div>
                                    <div class={userMenu ? tw`p-2 position-absolute bg-features-bg border rounded-2xl border-macaroni-and-cheese` : tw`hidden`}>
                                        <a href="/api/unlink" class={topNavNoPad}>Log Out</a>
                                    </div>
                                </div>
                                : <a class={tw`m-0.5 flex border rounded-full border-macaroni-and-cheese text-macaroni-and-cheese py-1 px-5`} href="/api/link">Login</a>}
                        </div>
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
                        {user ?
                            <div>
                                <div onClick={() => uMenuClicked(!userMenu)} class={tw`m-1.5 flex border rounded-full border-macaroni-and-cheese ${userMenu ? '' : 'hover:'}bg-features-bg p-1`}>
                                    <img width="25" class={tw`rounded`} src={user?.avatar ? user?.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator}.png`} />
                                    <i width="10" class={`fa-solid fa-caret-${userMenu ? 'up' : 'down'} ${tw`ml-2 text-macaroni-and-cheese text-center mx-1 text-1xl`}`} />
                                </div>
                                <div class={userMenu ? tw`p-2 position-absolute bg-features-bg border rounded-2xl border-macaroni-and-cheese` : tw`hidden`}>
                                    <a href="/api/unlink" class={topNavNoPad}>Log Out</a>
                                </div>
                            </div>
                            : <a class={tw`m-0.5 flex border rounded-full border-macaroni-and-cheese text-macaroni-and-cheese py-1 px-5`} href="/api/link">Login</a>}
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
            </header >
        </div>
    )
}