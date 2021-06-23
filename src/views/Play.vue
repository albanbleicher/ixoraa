<template>
  <div class="controller">
    <Joystick v-if="!nearTotem" />
    <Sync v-else />
  </div>
  <!-- <div class="joystickController">
      <JoystickDisplacement />
    </div>

    <div class="musicalController">
      <MusicTime />
    </div>
    <div class="test">
      <Lottie />
    </div>
  </div> -->
</template>
<script>
import Joystick from "@/components/Joystick";
import Sync from "@/components/Sync";
import MusicTime from "@/components/MusicTime";
import gsap from "gsap";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Joystick,
    Sync,
  },
  data() {
    return {
      nearTotem: false,
      time: null,
      lines: null,
    };
  },
  computed: {
    ...mapGetters(["socket"]),
  },
  mounted() {
    this.socket.on("totem approach", (totem) => {
      this.setTotem(totem);
      this.nearTotem = true;
    });
    this.socket.on("totem leave", (totem) => {
      this.setTotem("");
      this.nearTotem = false;
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
    ...mapMutations({
      setTotem: "SET_CURRENT_TOTEM",
    }),
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