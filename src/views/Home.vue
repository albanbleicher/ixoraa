<template>
  <div class="game">
    <div class="shape"></div>
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
  mounted() {
    this.io.on('move up', () => {
      this.handleMove('up')
    })
  },
  methods:{
    handleMove(direction) {
      switch(direction) {
        case 'up': 
         console.log('moove up')
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
