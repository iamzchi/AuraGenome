<script setup>
import panel from './Center/panel.vue'
import sequenceLog from './Center/sequenceLog.vue'
import { useChatStore } from '@/stores/useChatStore.js'
// const store = useChatStore();

// function testClick(){
//     store.sequence_log.push({  id: "9", text: "", parent: "7", status: 3, type: "circular" },);
// }
</script>
<template>
    <div id="panel">
        <panel></panel>
    </div>
    <div id="sequenceLog">
        <div class="blockTitle">
            <t-icon name="share"></t-icon>
            <span @click="testClick">SEQUENCE LOG</span>
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