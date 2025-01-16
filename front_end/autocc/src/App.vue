<script setup>
import demo1 from './components/demo1.vue'
import Left from './components/left.vue'
</script>

<template>
  <!-- <demo1></demo1> -->
  <div id="body">
    <div id="head">
      <h1>AutoCircos</h1>
      <div id="project_name">Breast Cancer Genetic Analysis</div>
      <div class="other">
        models
      </div>
    </div>
    <div id="content">
      <div id="left">
        <Left/>
      </div>
      <div id="center">

      </div>
      <div id="right">

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#body {
  max-width: 2000px;
  margin: 0 auto;
  background-color: rgb(238, 238, 238);

  #head {
    background-color: pink;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }

  #content {
    display: flex;
    flex-direction: row;

    #left {
      background-color: rgb(255, 247, 204);
      width: 30%;
      height: 100%;
      padding: 20px;
    }

    #center {
      background-color: rgb(220, 255, 255);
      height: 100%;
      width: 50%;
      padding: 20px;

    }

    #right {
      background-color: rgb(245, 255, 230);
      height: 100%;
      width: 20%;
      padding: 20px;

    }
  }

}
</style>
