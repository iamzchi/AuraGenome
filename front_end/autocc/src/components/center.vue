<script setup>
import panel from './Center/panel.vue'
import sequenceLog from './Center/sequenceLog.vue'
</script>
<template>
    <div id="panel">
        <panel></panel>
    </div>
    <div id="sequenceLog">
        <div class="blockTitle">
            <t-icon name="share"></t-icon>
            <span>SEQUENCE LOG</span>
        </div>
        <sequenceLog></sequenceLog>
    </div>
</template>
<style scoped lang="scss">
#panel{
    width: 100%;
    height: 75vh;
    // background-color: aliceblue;
}
#sequenceLog{
    width: 100%;
    height: 15vh;
    // background-color: greenyellow;
}
</style>