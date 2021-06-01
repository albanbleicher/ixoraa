
<template>
  <!--<div class="joystick joystick-displacement">
    <div class="joystick-controller"></div>
  </div>-->

  <div id="joystick"></div>
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
      zone: document.getElementById("joystick"),
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "red",
      size: 150,
    };
    this.static = nipplejs.create(this.options);

    console.log(this.static);
    this.static.on("plain:up", (evt, nipple) => {
      console.log("up");
      self.io.emit("move up");
    });
    this.static.on("plain:right", (evt, nipple) => {
      console.log("right");
      self.io.emit("move right");
    });
    this.static.on("plain:down", (evt, nipple) => {
      console.log("down");
      self.io.emit("move down");
    });
    this.static.on("plain:left", (evt, nipple) => {
      console.log("left");
      self.io.emit("move left");
    });
    this.static.on("end", function (evt, nipple) {
      console.log("left");
      self.io.emit("end");
    });
  },
  methods: {},
};
</script>