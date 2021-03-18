<template>
  <div class="controller">
      <button @click='handleMove("up")'>up</button>
      <div class="aside">
        <button @click='handleMove("left")'>left</button>
      <button @click='handleMove("right")'>right</button>
      </div>
      <button @click='handleMove("down")'>down</button>
  </div>
</template>
<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      io:null
    }
  },
  created() {
    this.io  = io('https://ixoraa-api.herokuapp.com/');
  },
  methods:{
    handleMove(direction) {
      switch(direction) {
        case 'up': 
          this.io.emit('move up')
        break;
        case 'down': 
          this.io.emit('move down')
        break;
        case 'left': 
          this.io.emit('move left')
        break;
        case 'right': 
          this.io.emit('move right')
        break;
      }
    }
  },
}
</script>
