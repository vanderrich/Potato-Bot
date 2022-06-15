<script lang="ts">
import axios from "axios";
export default {
  data() {
    return {
      loading: true,
      status: "",
      errors: [],
      uptime: "",
    };
  },
  created() {
    axios
      .get("https://potato-bot-api.herokuapp.com/status")
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
      Status: <span v-if="!loading">{{ status }}</span
      ><span v-else>Loading...</span><br />
      Uptime: <span v-if="!loading">{{ status }} for {{ uptime }}</span><span v-else>Loading...</span>
    </p>
    <h2>Latest Errors</h2>
    <ul>
      <li v-if="loading">Loading...</li>
      <div v-else>
        <li v-for="(error, key) in errors">
          <a :href="`/status/${error.id}`"
            ><span>{{ error.id.slice(0, 4) }}...</span> -
            <strong>{{ error.error }}</strong></a
          >
        </li>
        <p v-if="errors.length === 0">No Errors, yay!</p>
      </div>
    </ul>
  </div>
</template>