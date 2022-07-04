<script lang="ts">
import axios from "axios";
export default {
    data() {
        return {
            loading: true,
            error: {},
        };
    },
    created() {
        axios
            .get("https://potato-bot-api.up.railway.app/status")
            .then((response) => {
                this.error = response.data.errors.find(
                    (error) => error.id === this.$route.params.id
                );
                this.loading = false;
            });
    },
};
</script>

<template>
    <div id="error">
        <h1>Error {{ $route.params.id }}</h1>
        <p v-if="loading">Loading...</p>
        <div v-else>
            <h2>{{ error.error }}</h2>
            <p>Interaction Name: <strong>{{ error.name }}</strong></p>
            <p>Interaction Type: <strong>{{ error.type }}</strong></p>
            <p>Stack: </p>
            <pre class="code"><code>{{ error.stack }}</code></pre>
        </div>
    </div>
</template>