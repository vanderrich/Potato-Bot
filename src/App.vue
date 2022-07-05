<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <header>
        <div class="wrapper">
            <nav>
                <RouterLink to="/" class="topNav toHomepage">
                    <img src="@/assets/potato.png" width="50" height="50">
                </RouterLink>
                <!-- <RouterLink to="/dashboard" class="topNav">Dashboard</RouterLink> -->
                <RouterLink to="/status" class="topNav">Status</RouterLink>
                <RouterLink to="/invite" class="topNav">Invite</RouterLink>
                <a href="https://discord.gg/cHj7nErGBa" target="_blank" class="topNav">Discord server</a>
                <a href="https://github.com/vanderrich/Potato-bot" target="_blank" class="topNav">Github</a>
            </nav>
        </div>
    </header><br><br><br>

    <main>
        <RouterView />
    </main>
</template>

<style>
@import "@/assets/base.css";
</style>
