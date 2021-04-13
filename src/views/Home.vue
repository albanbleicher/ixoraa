<template>
  <div class="game">
    <div ref="shape" class="shape"></div>
    <label for="idRoom"
      >Entrez le code inscrit sur votre écran d'ordinateur</label
    >
    <h2 v-if="connected">
      Your phone is connected, the game is about to start
    </h2>
    <input
      type="number"
      id="idRoom"
      value=""
      v-model="idRoom"
      v-on:keyup="writeCode"
    />
    <p>{{ idRoom }}</p>
  </div>
</template>
<script>
import io from "socket.io-client";
import gsap from "gsap";
export default {
  data() {
    return {
      idRoom: "",
      io: null,
      connected: false,
      positions: {
        x: 0,
        y: 0,
      },
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
    this.io.on("move up", () => {
      this.handleMove("up");
    });
    this.io.on("move down", () => {
      this.handleMove("down");
    });
    this.io.on("move left", () => {
      this.handleMove("left");
    });
    this.io.on("move right", () => {
      this.handleMove("right");
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
