<template>
  <div class="game">
    <div class="lines" v-if="this.lines">
      <span
        v-for="line in lines"
        :key="line.id"
        class="musicbutton line"
        id="line"
        :ref="'line' + line.id"
      ></span>
    </div>
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
      lines: [],
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
    this.io.on("musictime begin", async (time, lines) => {
      const result = await this.returnsPromise(time, lines);
      this.handleMusicTimeBegin();
    });

    this.io.on("wrong", () => {
      //On wrong, reset lines with anim and emptying array
      console.log("wrong");
      this.lines.forEach((el) => {
        const timeline = gsap.timeline({
          onComplete: () => this.restartMusicTime(),
        });
        const line = this.$refs["line" + el.id];
        setTimeout(() => {
          timeline.to(line, {
            opacity: 0,
            duration: this.waveTime / 3,
          });
        }, (this.waveTime / 10) * 1000);
      });
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
      // Pour chaque ligne, active l'animation d'ondes en décalée
      this.lines.forEach((el) => {
        const line = this.$refs["line" + el.id];
        const timeline = gsap.timeline();
        setTimeout(() => {
          timeline.to(line, {
            width: 1200,
            height: 1200,
            duration: this.waveTime * 4,
          });
        }, (this.waveTime / (5 / el.id)) * 2 * 1000);
      });
      console.log("client music time begin", this.waveTime);
    },
    restartMusicTime() {
      console.log("restart");
      this.waveTime = false;
      this.lines = [];
    },
    startMusic(e) {
      this.io.emit("musictime begin");
    },
    returnsPromise(time, lines) {
      return new Promise((resolve) => {
        this.waveTime = time;
        this.lines = lines;
        resolve();
      });
    },
  },
};
</script>