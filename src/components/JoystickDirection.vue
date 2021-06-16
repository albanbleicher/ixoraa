
<template>
  <!--<div class="joystick joystick-displacement">
    <div class="joystick-controller"></div>
  </div>-->

  <div id="joystick_dir" ></div>
</template>
<script>
import nipplejs from "nipplejs";
import io from "socket.io-client";
import gsap from "gsap";

export default {
  data() {
    return {
      static: null,
      io: null,
      options: null,
    };
  },
  created() {
    console.log(this.io);
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    const self = this;

    this.io.on("musictime begin", (time, lines) => {
      console.log("musicTime Begin");
    });
    
    // Apparemment on ne peut pas changer les valeurs de options après avoir instancié le nipple, donc changement de couleur à la main
    this.io.on("strength", () => {
      console.log("strength");
      const front = document.getElementById("nipple_0_0").firstChild;
      const back = document.getElementById("nipple_0_0").lastChild;
      gsap.to(front, { background: "green", duration: 1 });
      gsap.to(back, { background: "green", duration: 1 });
      setTimeout(() => {
        gsap.to(front, { background: "red", duration: 1 });
        gsap.to(back, { background: "red", duration: 1 });
      }, 10000);
    });

    this.options = {
      zone: document.getElementById("joystick_dir"),
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "red",
      size: 150,
    };
    this.static = nipplejs.create(this.options);

     this.static.on('plain:left', (evt, nipple) => {
      self.io.emit("move left", nipple.angle.radian);
    })
    this.static.on('plain:right', (evt, nipple) => {
      self.io.emit("move right", nipple.angle.radian);
    })
   
    this.static.on('end', (evt, nipple) => {
            self.io.emit("end");
    })
  },
  methods: {},
};
</script>