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
    <div class="musicontroller">
      <button @click="handleMusic()">TAP</button>
    </div>
  </main>
</template>
<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      io: null,
    };
  },
  created() {
    localStorage.debug = '*';
    this.io = io("http://localhost:8080");
    console.log(this.io);
  },
  mounted() {
    this.io.on('musictime begin', (data) => {
      this.handleMusicTimeBegin(data)
    })
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
    handleMusicTimeBegin(data){
      console.log('client music time begin', data)
    },
    handleMusic(e){
      this.io.emit('musictime begin');
    }
  },
};
</script>
