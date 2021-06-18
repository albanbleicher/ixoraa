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
      completedNotes: [],
      attempts: [],
      levels: 2,
      currentLevel: 1,
      lines: [
        // { time: 0.5, id: 1 },
        // { time: 0.9, id: 2 },
        // { time: 1.8, id: 3 },
        // { time: 2.9, id: 4 },
        // { time: 3.3, id: 5 },
        // { time: 3.9, id: 6 },
        // { time: 4.2, id: 7 },
      ],
      waveTime: false,
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
    //const result = await this.returnsPromise(time, lines);
    //console.log(result)
  },
  mounted() {
    //this.handleMove();
    this.io.on("phoneConnected", () => {
      this.connected = true;
    });
    // Once a pattern is played in the desktop, it's send here, and then played
    this.io.on("musictime begin", async (lines) => {
      console.log("it started", lines);
      const result = await this.returnsPromise(lines);
      console.log(result);
      this.handleMove();
    });
    this.io.on("winned", () => {
      this.attempts.push("Winned ! Champion");
    });
  },
  methods: {
    handleMove() {
      console.log(this.lines);
      // Pour chaque ligne, active l'animation d'ondes en décalée
      this.lines.forEach((el, i) => {
        const line = this.$refs["line" + i];
        console.log(line);
        gsap
          .to(line, {
            width: 1200,
            height: 1200,
            duration: 4,
            delay: el.time,
            ease: "none",
          })
          .then(() => {
            gsap.to(line, {
              width: 2400,
              height: 2400,
              duration: 4,
              ease: "none",
            });
          });
      });
    },
    playNote() {
      console.log("test");
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
        console.log(this.completedNotes.length);
        console.log(this.lines.length);
        if (this.completedNotes.length === this.lines.length) {
          if (this.currentLevel === this.levels) {
            this.io.emit("winned");
            console.log("winned");
          } else {
            this.currentLevel += 1;
            this.io.emit("correct");
          }
          this.fadeOutOpacity();
        }
      } else {
        this.attempts.push("False, noob");
        this.io.emit("wrong");
        this.fadeOutOpacity();
      }
    },
    // On vide simplement les informations du pattern
    restartMusicTime() {
      console.log("restart");
      console.log(this.lines);
      this.waveTime = false;
      this.lines = [];
      this.completedNotes = [];
      console.log(this.lines);
    },
    // On fade out les lignes du pattern
    fadeOutOpacity() {
      this.lines.forEach((el, i) => {
        const line = this.$refs["line" + el[i]];
        console.log("fadeout", el[i]);
        const timeline = gsap.timeline({
          onComplete: () => this.restartMusicTime(),
        });
        gsap.to(line, {
          opacity: 0,
          duration: 2,
          delay: el.time,
        });
      });
    },
    // Le fait de le faire en async et promise permet de ne pas faire peter le composant lorsqu'il est monté
    returnsPromise(lines, time) {
      return new Promise((resolve) => {
        console.log(lines);
        this.lines = lines;
        resolve();
      });
    },
  },
};
</script>
