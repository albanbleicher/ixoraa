<template>
  <div class="inputCode">
    <input
      v-for="(number, i) in length"
      :key="i"
      :ref="'input-' + i"
      maxlength="1"
      type="number"
      @input="(e) => handleTyping(e, i)"
    />
  </div>
</template>
<script>
export default {
  model: {
    prop: "code",
    event: "change",
  },
  props: {
    length: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      code: "",
    };
  },
  // Focus on the first number
  mounted() {
    this.$refs["input-0"][0].focus();
  },
  methods: {
    // Each number is an array, which goes to the parent. When a number is entered, it focuses on the next one
    handleTyping(event, key) {
      this.code += event.target.value;
      if (event.inputType == "deleteContentBackward") {
        this.code = "";
        console.log(key, event);
        for (let i = 0; i <= key; i++) {
          this.$refs["input-" + i][0].value = "";
          this.$refs["input-" + 0][0].focus();
        }
      } else if (key < this.length - 1) {
        this.$refs["input-" + (key + 1)][0].focus();
      } else {
        this.$refs["input-" + (this.length - 1)][0].blur();
        this.$emit("change", this.code);
      }
    },
  },
};
</script>