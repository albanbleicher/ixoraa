<template>
  <div class="controller">
    <div class="joystickController">
      <JoystickDisplacement />
    </div>

    <div class="musicalController">
      <MusicTime />
    </div>
  </div>
</template>
<script>
import JoystickDisplacement from "@/components/JoystickDisplacement";
import MusicTime from "@/components/MusicTime";
import io from "socket.io-client";
import gsap from "gsap";

export default {
  components: {
    JoystickDisplacement,
    MusicTime,
  },
  data() {
    return {
      nearTotem: false,
      time: null,
      lines: null
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    // To replace when server works
    const joystickController = document.querySelector(".joystickController");
    const musicalController = document.querySelector(".musicalController");

    this.io.on("near totem", () => {
      setTimeout(() => {
        gsap.to(joystickController, { opacity: 0, display: 'none', duration: 1 });
          setTimeout(() => {
            gsap.to(musicalController, { opacity: 1, display: 'flex', duration: 1 });
          }, 1000);
      }, 1000);
    });
    this.io.on("musictime begin", async (time, lines) => {
      console.log('it started')
      const result = await this.returnsPromise(time, lines);
      console.log(result);
      console.log("musicTime Begin");
    });

    /*gsap.to(joystickController, { opacity: 0 }).then(() => {
      gsap.to(joystickController, { display: "none" }).then(() => {
          gsap.to(musicalController, { opacity: 1})
      });
    });*/
    
  },
    updated(){
    console.log('child updated')
  },
  methods: {
    returnsPromise(time, lines) {
      console.log('return promise', time, lines)
      return new Promise((resolve) => {
        this.time = time;
        this.lines = lines;
        resolve();
      });
    },
  }
  
};
</script>