<script setup>
import demo1 from './demo1.vue'
import console from './console.vue'
</script>
<template>
    <div id="container">
        <div id="circos">
            <div class="blockTitle">
                <t-icon name="chart-ring-1"></t-icon>
                <span>Panel</span>
            </div>
            <demo1></demo1>
        </div>

        <console id="console"></console>
    </div>


</template>
<style scoped lang="scss">
#container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    #circos{
        width: 80%;
    }
    #console{
        width: 20%;
        max-width: 300px;
        height: 100%;
        background-color: salmon;
    }
}
</style>