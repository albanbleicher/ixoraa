<template>
  <div class="game">
    <div ref="shape" class="shape"></div>
    <div class="musicbutton line" id="line" ref="line"></div>
    <div v-if="!waveTime" class="musicontroller">
      <button @click="startMusic()">Get close to artifact</button>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
import gsap from "gsap";
export default {
  data() {
    return {
      io: null,
      positions: {
        x: 0,
        y: 0,
      },
      waveTime: false,
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
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
    this.io.on("musictime begin", (time) => {
      this.waveTime = time;
      this.handleMusicTimeBegin();
    });
    this.io.on("wrong", () => {
      console.log("wrong");
      this.waveTime = null;
      this.restartMusicTime();
    });
  },
  methods: {
    handleMove(direction) {
      const shape = this.$refs["shape"];
      const timeline = gsap.timeline();
      switch (direction) {
        case "up":
          this.positions.y -= 30;
          timeline.to(shape, { y: this.positions.y });
          break;
        case "down":
          this.positions.y += 30;
          timeline.to(shape, { y: this.positions.y });
          break;
        case "left":
          this.positions.x -= 30;
          timeline.to(shape, { x: this.positions.x });
          break;
        case "right":
          this.positions.x += 30;
          timeline.to(shape, { x: this.positions.x });
          break;
      }
    },
    handleMusicTimeBegin() {
      const element = this.$refs["line"];
      const timeline = gsap.timeline();
      timeline.to(element, {
        width: 1200,
        height: 1200,
        duration: this.waveTime,
      });
      console.log("client music time begin", this.waveTime);
    },
    restartMusicTime() {
      console.log("restart");
      this.$forceUpdate();
    },
    startMusic(e) {
      this.io.emit("musictime begin");
    },
  },
};
</script>