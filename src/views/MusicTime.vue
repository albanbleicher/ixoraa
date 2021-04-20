<template>
  <div class="game">
    <span
      v-for="line in lines"
      :key="line.id"
      class="musicbutton line"
      id="line"
      :ref="'line' + line.id"
    ></span>
    <!--<span class="musicbutton line" id="line" ref="line"></span>-->

    <div>
      <button class="note" ref="note" @click="playNote()"></button>
    </div>
    <div>
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
      attempts: [],
      waveTime: "",
    };
  },
  created() {
    this.io = io("http://localhost:3000");
    console.log(this.io);
  },
  mounted() {
    this.io.on("phoneConnected", (test) => {
      this.connected = true;
    });
    this.io.on("musictime begin", (time) => {
      this.waveTime = time;
      this.handleMove();
    });
  },
  methods: {
    handleMove() {
      this.lines.forEach((el) => {
      const line = this.$refs["line" + el.id];
      //const line = this.$refs["line"];
      console.log(this.$refs);
      const timeline = gsap.timeline();
      setTimeout(() => {
        timeline.to(line, {
          width: 1200,
          height: 1200,
          duration: this.waveTime * 4,
        });
      }, (this.waveTime / el.id) * 2 * 1000);
      });

      // 8 is the good value
    },
    playNote() {
      this.lines.forEach((el) => {
        const identifier = "line" + el.id;
        console.log(identifier);
        const line = this.$refs[identifier];
        const note = this.$refs["note"];
        console.log(line);

        line.offsetBottom = line.offsetTop + line.offsetHeight;
        line.offsetRight = line.offsetLeft + line.offsetWidth;
        note.offsetBottom = note.offsetTop + note.offsetHeight;
        note.offsetRight = note.offsetLeft + note.offsetWidth;

        //console.log('line.offsetbottom :' + line.offsetBottom, 'note.offsettop :' + note.offsetTop, 'note.offsetbottom :' + note.offsetBottom, 'line.offsetBottom < note.offsetTop :' + line.offsetBottom < note.offsetTop, 'line.offsetBottom > note.offsetBottom: ', line.offsetBottom > note.offsetBottom)

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
        if (check) {
          this.attempts.push("Correct !");
        } else {
          this.attempts.push("False, noob");
        }
      });
    },
  },
};
</script>
