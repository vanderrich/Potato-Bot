<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
    //listen to post requests
    created() {
        axios.post('/api/status')
            .then(response => {
                this.status = response.data
            })
    },
})
</script>

<template>
    <div id="status">
        <h1>Status</h1>

    </div>
</template>