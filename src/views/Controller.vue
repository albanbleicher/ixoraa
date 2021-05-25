<template>
  <div class="controller">
    <div class="joystickController" v-if="!this.time">
      <JoystickDisplacement />
    </div>

    <div class="musicalController" v-if="this.time">
      <MusicTime timeProp="time" linesProp="lines" />
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
      time: false,
      lines: false,
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    this.io.on("musictime begin", (time, lines) => {
      console.log(typeof time, typeof lines);
      this.time = time;
      this.lines = lines;
    });

    // To replace when server works
    const joystickController = document.querySelector(".joystickController");
    const musicalController = document.querySelector(".musicalController");

    /*gsap.to(joystickController, { opacity: 0 }).then(() => {
      gsap.to(joystickController, { display: "none" }).then(() => {
          gsap.to(musicalController, { opacity: 1})
      });
    });*/

    setTimeout(() => {
      gsap.to(joystickController, { opacity: 0, duration: 1 });
      setTimeout(() => {
        this.time = 1;
        setTimeout(() => {
          gsap.to(joystickController, { opacity: 1, duration: 1 });
        }, 1000);
      }, 1000);
    }, 1000);
  },
};
</script>