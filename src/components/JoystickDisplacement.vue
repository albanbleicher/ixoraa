
<template>
  <!--<div class="joystick joystick-displacement">
    <div class="joystick-controller"></div>
  </div>-->

  <div id="joystick"></div>
</template>
<script>
import nipplejs from "nipplejs";
import io from "socket.io-client";

export default {
  data() {
    return {
      static: null,
      io: null,
    };
  },
  created() {
    console.log(this.io);
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    const self = this;
    this.io.on("musictime begin", async (time, lines) => {
      console.log('musicTime Begin')
    });
    this.static = nipplejs.create({
      zone: document.getElementById("joystick"),
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "red",
      size: 150,
    });
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