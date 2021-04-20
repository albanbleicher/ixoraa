<template>
  <main>
    <h1>Computer</h1>
    <div class="controller" v-if="!waveTime">
      <button @click="handleMove('up')">up</button>
      <div class="aside">
        <button @click="handleMove('left')">left</button>
        <button @click="handleMove('right')">right</button>
      </div>
      <button @click="handleMove('down')">down</button>
    </div>
    <div class="musicontroller">
      <button class="musicbutton red" id="red" ref="red"></button>
    </div>
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
      //melodyPlayed: [],
      //musicState: "",
      waveTime: "",
    };
  },
  created() {
    //localStorage.debug = '*';
    //this.io = io("http://ixoraa-api.herokuapp.com/");
    this.io = io("http://localhost:3000");
  },
  mounted() {
    this.io.on("musictime begin", (time) => {
      this.waveTime = time;
      this.handleMusicTimeBegin();
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
    handleMusic(color) {
      /*if (this.melodyPlayed.length === 5) {
        if (
          JSON.stringify(this.melodyPlayed) === JSON.stringify(this.waveTime)
        )
          this.musicState = "Correct !";
        else this.musicState = "Oh boy, no";
      }*/
    },
  },
};
</script>

