<script setup>
import demo1 from './components/Center/demo1.vue'
import Left from './components/left.vue'
import Center from './components/center.vue'
import Right from './components/right.vue'

const modelOptions = [
  { content: 'gpt-4', value: 'gpt-4' },
  { content: 'gpt-4o', value: 'gpt-4o' },
  { content: 'claude-3-5-sonnet-20240620', value: 'claude-3-5-sonnet-20240620' },
]
</script>

<template>
  <!-- <demo1></demo1> -->
  <div id="body">
    <div id="head">
      <h1>AuraGenome</h1>
      <div id="project_name">Breast Cancer Genetic Analysis <t-icon name="pen-ball" /> </div>
      <div class="other">
        <t-dropdown :options="modelOptions">
          <t-button variant="text">
            <template #icon>
              <t-icon name="icon" />
            </template>
            <span class="tdesign-demo-dropdown__text">
              Models<t-icon name="chevron-down" />
            </span>
          </t-button>
        </t-dropdown>
        <t-dropdown :options="modelOptions">
          <t-button variant="text">
            <template #icon>
              <t-icon name="ticket" />
            </template>
            <span class="tdesign-demo-dropdown__text">
              SSH     <t-icon name="chevron-down" />
            </span>
          </t-button>
        </t-dropdown>
      </div>
    </div>
    <div id="content">
      <div id="left">
        <Left />
      </div>
      <div id="center">
        <Center />
      </div>
      <div id="right">
        <Right />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#body {
  max-width: 2500px;
  margin: 0 auto;
  // background-color: rgb(238, 238, 238);

  #head {
    background-color: rgb(235, 235, 235);
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }

  #content {
    display: flex;
    flex-direction: row;
    overflow: hidden;

    #left {
      // background-color: rgb(255, 247, 204);
      width: 35%;
      height: 100%;
      padding: 20px;
    }

    #center {
      // background-color: rgb(220, 255, 255);
      height: 100%;
      width: 50%;
      padding: 20px;

    }

    #right {
      // background-color: rgb(245, 255, 230);
      height: 100%;
      width: 15%;
      padding: 20px;

    }
  }

}
</style>
