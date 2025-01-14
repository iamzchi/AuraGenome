<script setup>
import HelloWorld from './components/HelloWorld.vue'
import demo1 from './components/demo1.vue'
</script>

<template>
  <h1>nihao</h1>
  <HelloWorld msg="Vite + Vue" />
  <demo1></demo1>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
