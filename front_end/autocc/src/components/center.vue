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
            <span>Sequence Log</span>
        </div>
        <sequenceLog></sequenceLog>
    </div>
</template>
<style scoped lang="scss">
#panel{
    width: 100%;
    height: 60vh;
    // background-color: aliceblue;
}
#sequenceLog{
    width: 100%;
    height: 30vh;
    // background-color: greenyellow;
}
</style>