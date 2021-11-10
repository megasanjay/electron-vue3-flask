<template>
  <div class="container mt-2">Current App Path: {{ appPath }}</div>
  <div>
    <TheCalculator></TheCalculator>
  </div>
</template>

<script>
import { app } from "@electron/remote";
import semver from "semver";
import axios from "axios";
import axiosRetry from "axios-retry";

const MIN_API_VERSION = "1.1.0";

import TheCalculator from "./components/TheCalculator.vue";

export default {
  name: "App",
  components: { TheCalculator },
  data() {
    return {
      appPath: app.getAppPath(),
    };
  },
  mounted() {
    const client = axios.create({ baseURL: `${this.SERVERURL}` });

    client
      .get("/echo", {
        "axios-retry": {
          retries: 5,
          retryDelay: axiosRetry.exponentialDelay,
        },
      })
      .then((response) => {
        console.log(response.data);
        axios
          .get(`${this.SERVERURL}/api_version`)
          .then((response) => {
            if (
              semver.lte(
                semver.clean(MIN_API_VERSION),
                semver.clean(response.data)
              )
            ) {
              console.log("API version satisfied");
            } else {
              alert("Invalid API version");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>
