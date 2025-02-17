<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo_show from './demo_show.vue'
import consolePanel from './console.vue'
import root from './charts/id_001/root.vue'
import step1 from './charts/id_001/step1.vue'
import step2 from './charts/id_001/step2.vue'
import step3 from './charts/id_001/step3.vue'
import step4 from './charts/id_001/step4.vue'
import step5 from './charts/id_001/step5.vue'
import step6 from './charts/id_001/step6.vue'
import step7 from './charts/id_001/step7.vue'
import step8 from './charts/id_001/step8.vue'
import step9 from './charts/id_001/step9.vue'
import step10 from './charts/id_001/step10.vue'
import step11 from './charts/id_001/step11.vue'
import step12 from './charts/id_001/step12.vue'
import step13 from './charts/id_001/step13.vue'
import step14 from './charts/id_001/step14.vue'
import step15 from './charts/id_001/step15.vue'
import step16 from './charts/id_001/step16.vue'
import step17 from './charts/id_001/step17.vue'
import step18 from './charts/id_001/step18.vue'
import step19 from './charts/id_001/step19.vue'
import step20 from './charts/id_001/step20.vue'


import { useStepStore } from '@/stores/useStepStore';
import { watch, ref, onMounted } from 'vue'
import loading from './loading.vue'
//展示当前的step对应的图
const stepStore = useStepStore();
let step = ref('');

// 在 onMounted 中更新 step
onMounted(() => {
    console.log("onMounted triggered");
    // 确保 stepStore.step 已经被赋值
    step.value = stepStore.step;
    console.log(`Initial step value: ${step.value}`);
})

// 监听 stepStore.step 的变化
watch(() => stepStore.step, (stepCurrent) => {
    console.log(`step updated to: ${stepCurrent}`);
    step.value = stepCurrent;
})
const isloading = ref(false);
</script>
<template>
    <div id="container">
        <div id="circos">
            <div class="blockTitle">
                <t-icon name="chart-ring-1"></t-icon>
                <span>Panel</span>
            </div>
            <div id="loading" style="z-index: 1000;" v-show="isloading">
                <loading></loading>
            </div>
            <div id="circos_chart">
                <!-- <demo1></demo1> -->
                <!-- <demo2></demo2> -->
                <demo3></demo3>
                <!-- <demo_show></demo_show> -->
                <!-- <root v-show="step == 'root'"></root> -->
                <step1 v-show="step == 'step1'"></step1>
                <step2 v-show="step == 'step2'"></step2>
                <step3 v-show="step == 'step3'"></step3>
                <step4 v-show="step == 'step4'"></step4>
                <step5 v-show="step == 'step5'"></step5>
                <step6 v-show="step == 'step6'"></step6>
                <step7 v-show="step == 'step7'"></step7>
                <step8 v-show="step == 'step8'"></step8>
                <step9 v-show="step == 'step9'"></step9>
                <step10 v-show="step == 'step10'"></step10>
                <step11 v-show="step == 'step11'"></step11>
                <step12 v-show="step == 'step12'"></step12>
                <step13 v-show="step == 'step13'"></step13>
                <step14 v-show="step == 'step14'"></step14>
                <step15 v-show="step == 'step15'"></step15>
                <step16 v-show="step == 'step16'"></step16>
                <step17 v-show="step == 'step17'"></step17>
                <step18 v-show="step == 'step18'"></step18>
                <step19 v-show="step == 'step19'"></step19>
                <step20 v-show="step == 'step20'"></step20>
            </div>


        </div>

        <consolePanel id="console"></consolePanel>
    </div>


</template>
<style scoped lang="scss">
#container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    position: relative;

    #circos {
        width: 80%;
        position: relative;

        #loading {
            width: 100%;
            height: 100%;
            // background-color: salmon;
            position: absolute;
            top: -20px;
            left: 0;
        }
        #circos_chart{
            background-color: pink;
        }
    }

    #console {
        width: 20%;
        max-width: 300px;
        height: 100%;
        background-color: salmon;
    }

}
</style>