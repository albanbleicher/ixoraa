<template>
  <div class="home">
    <img ref="logo" src="@/assets/images/logo.png" alt="Sprout" />
    <h1 ref="title">Sprout</h1>
    <p ref="sub">Hello, this is Sprout, a Vue starter with :</p>
    <ul ref="list">
      <li>well-organised assets folders</li>
      <li>SCSS</li>
      <li>vue router</li>
      <li>vuex</li>
      <li>gsap</li>
      <li>Prettier</li>
    </ul>
    <p ref="link">github <a href="#" class="link">here</a>. Enjoy 🌱</p>
  </div>
</template>
<script>
import gsap from 'gsap'
export default {
  mounted() {
    const timeline = gsap.timeline()
    timeline.from(this.$refs['logo'], { scale: 0, opacity: 0, duration: 1 })
    timeline.from(this.$refs['title'], { y: -20, opacity: 0, duration: 1 })
    timeline.from(this.$refs['sub'], { y: -20, opacity: 0, duration: 0.6 })
    timeline.from(this.$refs['list'].children, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2
    })
    timeline.from(this.$refs['link'], {
      opacity: 0,
      duration: 0.6,
      stagger: 0.2
    })
  }
}
</script>
