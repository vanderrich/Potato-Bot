<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <header>
        <div>
            <nav class="pl-0.5">
                <RouterLink to="/" class="float-left px-1.5 pt-1 overflow-hidden bg-home-bg hover:bg-alto">
                    <img src="@/assets/potato.png" class="lg:w-15 lg:h-15 md:w-14 md:h-14 sm:w-10 sm:h-10 w-12 h-12">
                </RouterLink>
                <RouterLink to="/status"
                    class="float-left text-macaroni-and-cheese text-center py-3.5 px-4 hover:bg-alto bg-sweet-brown lg:text-2xl md:text-base sm:text-sm">
                    Status
                </RouterLink>
                <RouterLink to="/invite"
                    class="float-left text-macaroni-and-cheese text-center py-3.5 px-4 hover:bg-alto bg-sweet-brown lg:text-2xl md:text-base sm:text-sm">
                    Invite
                </RouterLink>
                <a href="https://discord.gg/cHj7nErGBa" target="_blank"
                    class="float-left text-macaroni-and-cheese text-center py-3.5 px-4 hover:bg-alto bg-sweet-brown lg:text-2xl md:text-base sm:text-sm">
                    Discord Server
                </a>
                <a href="https://github.com/vanderrich/Potato-bot" target="_blank"
                    class="float-left text-macaroni-and-cheese text-center py-3.5 px-4 hover:bg-alto bg-sweet-brown lg:text-2xl md:text-base sm:text-sm">
                    Github
                </a>
            </nav>
        </div>
    </header><br><br><br>

    <main>
        <RouterView />
    </main>
</template>

<style>
/* stuff that cant be done with tailwind i think */
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

body {
    background-color: #7F534B;
}

* {
    font-family: 'Lato', sans-serif;
}

a {
    color: #020122;
}

a:hover {
    color: #FCE762;
}

a:visited:not(nav > a) {
    color: #020122;
}

code {
    font-family: 'Roboto Mono', monospace;
    color: #A0A2A5;
}
</style>