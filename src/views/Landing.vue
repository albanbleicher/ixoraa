<template>
  <div class="game">
    <h1 for="idRoom">Entrez le code inscrit sur votre écran d'ordinateur</h1>
    <h2 v-if="connected">
      Your phone is connected, the game is about to start
    </h2>
    <div id="idRoom">
      <input type="number" value="" v-model="idRoom" v-on:keyup="writeCode" />
      <p>{{ idRoom }}</p>
    </div>
    <router-link v-if="connected" to="/home">Click here to start</router-link>
  </div>
</template>
<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      idRoom: "",
      io: null,
      connected: false,
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    this.io.on("equipment", (idRoom) => {
      console.log("equipment", idRoom);
    });
    this.io.on("phoneConnected", () => {
      this.connected = true;
    });
  },
  methods: {
    writeCode() {
      if (this.idRoom.length === 4) {
        this.io.emit("mobile connexion", parseInt(this.idRoom, 10));
        console.log("mobile connexion emitted");
      }
    },
  },
};
</script>
