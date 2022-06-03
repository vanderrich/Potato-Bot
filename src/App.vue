<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="topNav toHomepage">Potato Bot</RouterLink>
        <RouterLink to="/dashboard" class="topNav">Dashboard</RouterLink>
        <RouterLink to="/status" class="topNav">Status</RouterLink>
        <a href="https://discord.com/api/oauth2/authorize?client_id=894060283373449317&permissions=8&scope=bot%20applications.commands" class="topNav">Invite to server</a>
        <a href="https://discord.gg/cHj7nErGBa" target="_blank" class="topNav">Discord server</a>
        <a href="https://github.com/vanderrich/Potato-bot" target="_blank" class="topNav">Github</a>
      </nav>
    </div>
  </header><br><br>

  <main>
  <RouterView />
  </main>
</template>

<style>
@import '@/assets/base.css';
</style>
