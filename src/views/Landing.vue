<template>
    <div class="landing">
        <button class="start" @click="handleStart()">Start the experience</button>
    </div>
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
    this.io = io("https://ixoraa-api.herokuapp.com/");
    console.log(this.io);
  },
  methods: {
    handleStart(){
      this.io.emit('start experience');
    }
  },
};
</script>
