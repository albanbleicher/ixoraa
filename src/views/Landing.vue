<template>
  <div class="landing">
    <template v-if="this.idRoom">
      <h1>{{ this.idRoom }}</h1>
      <h2 v-if="!connected">Now, let's connect with your phone !</h2>
      <h2 v-if="connected">
        Your phone is connected, the game is about to start
      </h2>
      <router-link v-if="connected" to="/home">Click here to start</router-link>
    </template>
    <button class="start" @click="handleStart()" v-if="!this.idRoom">
      Start the experience
    </button>
  </div>
</template>
<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      io: null,
      idRoom: "",
      connected: false,
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    this.io.on("equipment", (idRoom) => {
      this.idRoom = idRoom;
      console.log("equipment", idRoom);
    });
    this.io.on("phoneConnected", () => {
      this.connected = true;
    });
  },
  methods: {
    handleStart() {
      this.io.emit("start experience");
    },
  },
};
</script>
