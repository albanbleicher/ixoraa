<template>
  <div class="game">
    <div ref='shape' class="shape"></div>
  </div>
</template>
<script>
import io from 'socket.io-client';
import gsap from 'gsap'
export default {
  data() {
    return {
      io:null,
      positions:{
        x:0,
        y:0
      }
    }
  },
  created() {
    this.io  = io('https://ixoraa-api.herokuapp.com/');
  },
  mounted() {
    this.io.on('move up', () => {
      this.handleMove('up')
    })
    this.io.on('move down', () => {
      this.handleMove('down')
    })
    this.io.on('move left', () => {
      this.handleMove('left')
    })
    this.io.on('move right', () => {
      this.handleMove('right')
    })
  },
  methods:{
    handleMove(direction) {
      const shape = this.$refs['shape']
      const timeline = gsap.timeline()
      switch(direction) {
        case 'up': 
        this.positions.y-=30;
         timeline.to(shape, {y:this.positions.y})
        break;
        case 'down': 
        this.positions.y+=30;
         timeline.to(shape, {y:this.positions.y})
        break;
        case 'left': 
           this.positions.x-=30;
         timeline.to(shape, {x:this.positions.x})
        break;
        case 'right': 
            this.positions.x+=30;
         timeline.to(shape, {x:this.positions.x})
        break;
      }
    }
  },
}
</script>
