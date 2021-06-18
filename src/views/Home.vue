<template>
  <div class="landing">
    <h1>Renseigne ton code pour connecter ton téléphone</h1>
    <InputCode v-model="code" @change="sync" />
    <!-- <span>{{status_message}}</span> -->
  </div>
</template>
<script>
import InputCode from "../components/InputCode.vue";
import { mapGetters } from 'vuex'
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
    // Go on the next page when sended code is good
    this.socket.on("room is_synced", (test) => {
      this.status = 1;
      this.$router.push("/play");
    });
    this.socket.on("room error", (test) => {
      this.status = 2;
    });
  },
  methods: {
    // For each code change, then the code to the server
    sync() {
      this.socket.emit("room join", parseInt(this.code));
    },
  },
};
</script>
