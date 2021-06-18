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
import JoystickDirection from "@/components/JoystickDirection";
import MusicTime from "@/components/MusicTime";
import gsap from "gsap";
import { mapGetters } from 'vuex'
export default {
  components: {
    JoystickDisplacement,
    JoystickDirection,
    MusicTime,
  },
  data() {
    return {
      nearTotem: false,
      time: null,
      lines: null,
    };
  },
  computed: {
    ...mapGetters(['socket'])
  },
  mounted() {
    console.log("mounted");
    // To replace when server works
    const joystickController = document.querySelector(".joystickController");
    const musicalController = document.querySelector(".musicalController");

    // When the player get close to a totem, do a smooth switch between the joystick and the musicalButton
    this.socket.on("near totem", () => {
      console.log("near totem");
      gsap.to(joystickController, {
        opacity: 0,
        display: "none",
        duration: 0.5,
        delay: 1,
      });
      gsap
        .to(musicalController, {
          display: "flex",
          duration: 0.5,
          delay: 1,
        })
        .then(() => {
          gsap
            .to(musicalController, { opacity: 1, duration: 1, delay: 1 })
            .then(() => {
              console.log("near totem is ok");
              this.socket.emit("near totem is ok");
            });
        });
    });
    this.socket.on("musictime begin", async (time, lines) => {
      console.log("it started");
      //const result = await this.returnsPromise(time, lines);
      //console.log(result);
      //console.log("musicTime Begin");
    });

  // And when an interaction is completed, do this switch back
    this.socket.on("winned", () => {
      console.log("winned");
      setTimeout(() => {
        gsap.to(musicalController, {
          opacity: 0,
          display: "none",
          duration: 0.5,
        });
        setTimeout(() => {
          gsap.to(joystickController, { display: "flex", duration: 0.5 });
          gsap.to(joystickController, { opacity: 1, duration: 1 });
        }, 1000);
      }, 1000);
    });

    /*gsap.to(joystickController, { opacity: 0 }).then(() => {
      gsap.to(joystickController, { display: "none" }).then(() => {
          gsap.to(musicalController, { opacity: 1})
      });
    });*/
  },
  updated() {
    console.log("child updated");
  },
  methods: {
    returnsPromise(time, lines) {
      console.log("return promise", time, lines);
      return new Promise((resolve) => {
        this.time = time;
        this.lines = lines;
        resolve();
      });
    },
  },
};
</script>