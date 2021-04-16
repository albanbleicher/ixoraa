<template>
  <div class="game">
    <div ref="line" class="line"></div>
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
      waveTime: "",
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    this.io.on("phoneConnected", (test) => {
      this.connected = true;
    });
    this.io.on("musictime begin", (time) => {
      this.waveTime = time;
      this.handleMove();
    });
  },
  methods: {
    handleMove() {
      const line = this.$refs["line"];
      const timeline = gsap.timeline();
      setTimeout(() => {
        timeline.to(line, {
          width: 1200,
          height: 1200,
          duration: this.waveTime,
        });
      }, this.waveTime / 8 * 1000);
    },
  },
};
</script>
