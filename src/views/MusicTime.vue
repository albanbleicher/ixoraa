<template>
  <div class="game">
    <div class="lines" v-if="this.lines">
      <span
        v-for="line in lines"
        :key="line.id"
        class="musicbutton line"
        id="line"
        :ref="'line' + line.id"
      ></span>
    </div>
    <!--<span class="musicbutton line" id="line" ref="line"></span>-->

    <div>
      <button class="note" ref="note" @click="playNote()"></button>
    </div>
    <div style="position: absolute; left: 50px">
      <p
        v-for="(attempt, index) in attempts"
        :key="index"
        :ref="'attempt' + index"
      >
        {{ attempt }}
      </p>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
import gsap from "gsap";
export default {
  data() {
    return {
      io: null,
      positions: {
        x: 0,
        y: 0,
      },
      lines: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      completedNotes: [],
      attempts: [],
      lines: [],
      waveTime: false,
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    this.io.on("phoneConnected", () => {
      this.connected = true;
    });
    this.io.on("musictime begin", async (time, lines) => {
      const result = await this.returnsPromise(time, lines);
      this.handleMove();
    });
  },
  methods: {
    handleMove() {
      // Pour chaque ligne, active l'animation d'ondes en décalée
      this.lines.forEach((el) => {
        const line = this.$refs["line" + el.id];
        const timeline = gsap.timeline();
        setTimeout(() => {
          timeline.to(line, {
            width: 1200,
            height: 1200,
            duration: this.waveTime * 4,
          });
        }, (this.waveTime / (2.5 / el.id)) * 2 * 1000);
      });
    },
    playNote() {
      // Pour la ligne courante ligne, vérifie si l'intersection avec le bouton est juste
      const currentLineId = "line" + (this.completedNotes.length + 1);
      const line = this.$refs[currentLineId][0];
      const note = this.$refs["note"];
      console.log(currentLineId);
      console.log(line);

      line.offsetBottom = line.offsetTop + line.offsetHeight;
      line.offsetRight = line.offsetLeft + line.offsetWidth;
      note.offsetBottom = note.offsetTop + note.offsetHeight;
      //note.offsetRight = note.offsetLeft + note.offsetWidth;

      const check = !(
        (
          line.offsetBottom < note.offsetTop ||
          line.offsetBottom > note.offsetBottom
        )
        // line.offsetTop > note.offsetBottom ||
        // line.offsetRight < note.offsetLeft ||
        // line.offsetLeft > note.offsetRight
      );
      console.log(check);

      // Si elle est juste, on l'ajoute au tableau des lignes juste, sinon on active le fade out, et recommence le jeu
      // Lorsque le jeu est réussi, on en informe le serveur
      if (check) {
        this.attempts.push(currentLineId + " is correct !");
        this.completedNotes.push(currentLineId + " is correct !");
        if (this.completedNotes.length === this.lines.length)
          this.io.emit("correct");
      } else {
        this.attempts.push("False, noob");
        this.io.emit("wrong");

        this.lines.forEach((el) => {
          const line = this.$refs["line" + el.id];
          const timeline = gsap.timeline({
            onComplete: () => this.restartMusicTime(),
          });
          setTimeout(() => {
            timeline.to(line, {
              opacity: 0,
              duration: this.waveTime / 3,
            });
          }, (this.waveTime / 10) * 1000);
        });
      }
    },
    restartMusicTime() {
      console.log("restart");
      this.waveTime = false;
      this.lines = [];
      this.completedNotes = [];
    },
    returnsPromise(time, lines) {
      return new Promise((resolve) => {
        this.waveTime = time;
        this.lines = lines;
        resolve();
      });
    },
  },
};
</script>
