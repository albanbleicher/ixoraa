<template>
  <div class="code">
    <input ref='code' v-model='code' type="number" min="0" inputmode="numeric" @input='handleTyping' pattern="[0-9]*"/>
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
    this.$refs.code.focus();
  },
  methods: {
    handleTyping(event, key) {
     if(event.target.value.length===4)  this.$emit("change", this.code)
    },
  },
};
</script>