
<template>
  <div ref="joystick" class="joystickController"></div>
</template>
<script>
import nipplejs from "nipplejs";
import io from "socket.io-client";
import gsap from "gsap";
import { mapGetters } from 'vuex';

export default {
 computed:{
   ...mapGetters(['socket'])
 },
  mounted() {
    console.log(this.socket);
    const self = this;

    // this.socket.on("musictime begin", (time, lines) => {
    //   console.log("musicTime Begin");
    // });

    // Lorsque l'obstacle du totem de la force est lancé, on réalise un changement de couleur du joystick
    // Apparemment on ne peut pas changer les valeurs de options après avoir instancié le nipple, donc changement de couleur à la main
    // this.socket.on("strength", () => {
    //   const front = document.getElementById("nipple_0_0").firstChild;
    //   const back = document.getElementById("nipple_0_0").lastChild;
    //   gsap.to(front, { background: "green", duration: 1 });
    //   gsap.to(back, { background: "green", duration: 1 });
    //   setTimeout(() => {
    //     gsap.to(front, { background: "red", duration: 1 });
    //     gsap.to(back, { background: "red", duration: 1 });
    //   }, 10000);
    // });

    // On créer les options d'initialisation du joystick, puis on l'instancie avec
    const joystick = nipplejs.create({
      zone: this.$refs.joystick,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "red",
      size: 150,
    });

    joystick.on("move", (evt, nipple) => {
      self.socket.emit("move moving", nipple.vector);
    });

    joystick.on("end", () => {
      self.socket.emit("move end");
    });

  },
};
</script>