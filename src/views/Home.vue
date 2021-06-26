<template>
  <div v-if='status===0' class="home">
    <h1>Entre ton code</h1>
    <InputCode v-model="code" @change="sync" />
  </div>
  <div v-else class="loading">
    <span>Chargement...</span>
    <div ref='waves' class="waves">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
  </div>
</template>
<script>
import InputCode from "../components/InputCode.vue";
import { mapGetters } from 'vuex'
import gsap from 'gsap';
export default {
  components: { InputCode },
  data() {
    return {
      idRoom: "",
      io: null,
      status: 0,
      waveTime: "",
      code: "",
    };
  },

  computed: {
    ...mapGetters(['socket']),
    status_message() {
      let message = "";
      switch (this.status) {
        case 0:
          message = "Vous n'êtes pas connecté.e !";
          break;
        case 1:
          message = "Vous êtes connecté.e !";
          break;
        case 2:
          message = "Une erreur est survenue, veuillez réessayer.";
          break;
      }
      return message;
    },
  },
  mounted() {
    this.socket.on("room is_synced", (test) => {
      this.status = 1;
        this.$nextTick(()=> {
          this.loading()
        })

    });
    this.socket.on("user loaded", (test) => {
      this.status = 2;
        this.$router.push('play')

    });
    this.socket.on("room error", (test) => {
      this.status = 2;
      console.log('error')
    });
  },
  methods: {
    // For each code change, then the code to the server
    sync() {
      console.log('try sync');
      this.socket.emit("room join", parseInt(this.code));
    },
    loading() {
      gsap.to(this.$refs.waves.children, {opacity:0.6, duration:0.5, stagger:2})
      gsap.to(this.$refs.waves.children, {width:'250vh', height:'250vh', duration:8, ease:"slow(0.70.7, 0.70.7, false)", stagger:2})
    } 
  },
};
</script>
