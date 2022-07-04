<script lang="ts">
import axios from "axios";
export default {
    data() {
        return {
            loading: true,
            status: "",
            herokuStatus: {},
            discordStatus: {},
            errors: [],
            uptime: "",
        };
    },
    created() {
        axios
            .get("https://potato-bot-api.up.railway.app/status")
            .then((response) => {
                this.status = response.data.message ? "Online" : "Offline";
                this.errors = response.data.errors;
                let ms_num = response.data.uptime;
                let days = Math.floor(ms_num / (1000 * 60 * 60 * 24));
                let hours = Math.floor((ms_num / 1000 / 60 / 60) % 24);
                let minutes = Math.floor((ms_num / 1000 / 60) % 60);
                this.uptime = `${days} days, ${hours} hours, ${minutes} minutes`;
                this.loading = false;
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get("https://status.heroku.com/api/v4/current-status")
            .then((response) => {
                this.herokuStatus = response.data;
                this.loading = false;
            });
        axios
            .get("https://discordstatus.com/api/v2/summary.json")
            .then((response) => {
                this.discordStatus = response.data;
                this.loading = false;
            })
            .catch((error) => {
                console.error(error);
            });
        setTimeout(() => {
            console.log("e");
            this.$forceUpdate();
        }, 10000);
    },
};
</script>

<template>
    <div id="status">
        <h1>Status</h1>
        <p>
            Status:
            <span v-if="!loading"><span v-if="!status"><a href="https://potato-bot-api.up.railway.app/status">Our
                        API</a>
                    haven't responded yet, most likely because heroku is down (check the
                    heroku incidents below)</span><span v-else>{{ status }}</span></span><span
                v-else>Loading...</span><br />
            Heroku Status: <span v-if="loading">Loading...<br /></span>
            <span v-else>
                <li v-for="(status, index) in herokuStatus.status">
                    {{ status.system }}: {{ status.status }}
                </li>
                Incidents:
                <ul>
                    <li v-for="(incident, index) in herokuStatus.incidents">
                        <a :href="`https://status.heroku.com/incidents/${incident.id}`" target="_blank">{{
                                incident.title
                        }}</a>
                    </li>
                </ul>
                <br />
            </span>
            Uptime:
            <span v-if="!loading"><span v-if="!status"><a href="https://potato-bot-api.up.railway.app/status">Our
                        API</a>
                    haven't responded yet, most likely because heroku is down (check the
                    heroku incidents above)</span><span v-else>{{ status }} for {{ uptime }}</span></span><span
                v-else>Loading...</span>
        </p>
        <h2>Latest Errors</h2>
        <ul>
            <li v-if="loading">Loading...</li>
            <div v-else>
                <li v-for="(error, key) in errors">
                    <a :href="`/status/${error.id}`"><span>{{ error.id.slice(0, 4) }}...</span> -
                        <strong>{{ error.error }}</strong></a>
                </li>
                <p v-if="errors.length === 0">No Errors, yay!</p>
            </div>
        </ul>
    </div>
</template>