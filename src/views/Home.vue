<template>
  <main>
    <div class="controller">
      <button @click="handleMove('up')">up</button>
      <div class="aside">
        <button @click="handleMove('left')">left</button>
        <button @click="handleMove('right')">right</button>
      </div>
      <button @click="handleMove('down')">down</button>
    </div>
    <div v-if="!musicPatern" class="musicontroller">
      <button @click="startMusic()">TAP</button>
    </div>
    <div v-if="musicPatern" class="musicontroller">
      <button @click="handleMusic('green')" class="musicbutton green" id="green"></button>
      <button @click="handleMusic('red')" class="musicbutton red" id="red"></button>
      <button @click="handleMusic('blue')" class="musicbutton blue" id="blue"></button>
    </div>

    <p>{{ musicState || musicPatern }}</p>
  </main>
</template>
<script>
import io from "socket.io-client";
import gsap from "gsap";

export default {
  data() {
    return {
      io: null,
      musicPatern: null,
      melodyPlayed: [],
      musicState: "",
    };
  },
  created() {
    //localStorage.debug = '*';
    //this.io = io("http://ixoraa-api.herokuapp.com/");
    this.io = io("http://localhost:3000");
  },
  mounted() {
    this.io.on("musictime begin", (data) => {
      this.handleMusicTimeBegin(data);
    });
  },
  methods: {
    handleMove(direction) {
      switch (direction) {
        case "up":
          this.io.emit("move up");
          break;
        case "down":
          this.io.emit("move down");
          break;
        case "left":
          this.io.emit("move left");
          break;
        case "right":
          this.io.emit("move right");
          break;
      }
    },
    startMusic(e) {
      this.io.emit("musictime begin");
    },
    handleMusicTimeBegin(melody) {
      this.musicPatern = melody;
      console.log("client music time begin", melody);
    },
    handleMusic(color) {
      const element = document.getElementById(color)
      console.log(element)
      this.melodyPlayed.push(color);
      const timeline = gsap.timeline();
      timeline.to(element, {opacity: 0.5, duration: 1})
      timeline.reverse();
      if (this.melodyPlayed.length === 5) {
        if (
          JSON.stringify(this.melodyPlayed) === JSON.stringify(this.musicPatern)
        )
          this.musicState = "Correct !";
        else this.musicState = "Oh boy, no";
      }
    },
  },
};
</script>
