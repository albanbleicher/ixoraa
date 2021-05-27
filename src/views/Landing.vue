<template>
  <div class="landing">
    <h1>Renseigne ton code pour connecter ton téléphone</h1>
    <InputCode v-model="code" @change="sync" />
    <!-- <span>{{status_message}}</span> -->
  </div>
</template>
<script>
import io from "socket.io-client";
import InputCode from "../components/InputCode.vue";
import router from "vue-router";

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
  created() {
    this.io = io("http://localhost:3000/");
  },
  computed: {
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
    this.io.on("room is_synced", (test) => {
      this.status = 1;
      this.$router.push("/play");
    });
    this.io.on("room error", (test) => {
      this.status = 2;
    });
  },
  methods: {
    sync() {
      console.log("sync", this.code);
      this.io.emit("room join", parseInt(this.code));
    },
  },
};
</script>
