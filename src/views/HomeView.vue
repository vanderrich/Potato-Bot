<script setup lang="ts">
</script>

<template>
    <div>
        <div>
            <div class="float-left">
                <h1 class="text-6xl pl-4">Potato Bot</h1><br>
                <h3 class="text-2xl pl-4">Your local general purpose bot.<br>
                    Created by
                    <a href="https://discordapp.com/users/709950767670493275">vanderrich#9982</a>.
                </h3>
            </div>
            <img src="@/assets/potato.png" class="float-right pr-6">
        </div>
        <div id="thing" class="pt-72">
            <!--border thing-->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 280">
                <path fill="#ae5a4b" fill-opacity="1"
                    d="M0,96L30,90.7C60,85,120,75,180,64C240,53,300,43,360,69.3C420,96,480,160,540,181.3C600,203,660,181,720,160C780,139,840,117,900,106.7C960,96,1020,96,1080,117.3C1140,139,1200,181,1260,202.7C1320,224,1380,224,1410,224L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z">
                </path>
            </svg>
            <div class="bg-features-bg justify-around -mt-14">
                <h2 class="pl-12 -mt-14 text-2xl" v-motion-slide-visible-bottom>Features</h2>
                <div id="economy" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Economy</h3>
                    <p>Global Economy</p>
                </div>
                <div id="games" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Games</h3>
                    <p>Games.</p>
                </div>
                <div id="reactionroles" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Reaction Roles</h3>
                    <p>More like button roles but same thing ig</p>
                </div>
                <div id="moderation" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Moderation</h3>
                    <p>
                        Block words and unicode characters (currently not<br>
                        implemented), bulk delete messages and more!
                    </p>
                </div>
                <div id="tickets" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Tickets</h3>
                    <p>Tickets.</p>
                </div>
                <div id="giveaways" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Giveaways</h3>
                    <p>Literally just a creategiveaway command</p>
                </div>
                <div id="birthdays" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Birthdays</h3>
                    <p>why am i doing this</p>
                </div>
                <div id="tags" class="inline-block p-12" v-motion-slide-visible-bottom>
                    <h3>Tags</h3>
                    <p>Set tags and use them.</p>
                </div>
            </div>
        </div>
    </div>
</template>
