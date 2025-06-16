<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
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

/**
 * 2025.5.10 
 * 重写了获取可视化代码的逻辑
 * 使用vue3-sfc-loader 动态加载和渲染 .vue 单文件组件
 */

// 模拟缺失的模块（需替换为实际实现）
import { readFile } from '@/utils/server'
import {
    reduceData,
    reduceData_Position,
    gieStainColor,
    transform_startend_position
} from './utils_circos.js'
import { add_hover_effect, addTrack, reverse } from './utils_interact.js'

import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue' // 使用命名导出，确保完整版 Vue
window.Vue = Vue
import * as d3 from 'd3';
window.d3 = d3
import Circos from 'circos'
window.Circos = Circos
// 存储动态组件和错误状态
const dynamicComponent = ref(null)
const error = ref(null)
const errorDetails = ref('')
import { useChatStore } from '../../stores/useChatStore'
const chatStore = useChatStore()
console.log('window.Vue exists:', !!window.Vue)
console.log('window.Vue version:', window.Vue?.version)
async function loadDynamicComponent(code) {
    console.log('Attempting to load dynamic component with code:', code)
    if (!code) {
        console.log('No code provided, resetting component')
        dynamicComponent.value = null
        error.value = null
        errorDetails.value = ''
        return
    }

    try {
        isloading.value = false;
        // 配置 vue3-sfc-loader
        const options = {
            moduleCache: {
                vue: window.Vue,
                d3: window.d3,
                circos: window.Circos,
                '@/utils/server': { readFile },
                '@/components/Center/utils_circos.js': {
                    reduceData,
                    reduceData_Position,
                    gieStainColor,
                    transform_startend_position
                },
                '@/components/Center/utils_interact.js': { add_hover_effect, addTrack, reverse }
            },
            async getFile() {
                console.log('Providing code to vue3-sfc-loader')
                return {
                    getContentData: () => code,
                    type: '.vue'
                }
            },
            addStyle(styleStr) {
                console.log('Adding style:', styleStr)
                const style = document.createElement('style')
                style.textContent = styleStr
                document.head.appendChild(style)
            },
            async resolveModuleId(id) {
                console.log('Resolving module:', id)
                const moduleMap = {
                    vue: window.Vue,
                    d3: window.d3,
                    circos: window.Circos,
                    '@/utils/server': { readFile },
                    '@/components/Center/utils_circos.js': {
                        reduceData,
                        reduceData_Position,
                        gieStainColor,
                        transform_startend_position
                    },
                    '@/components/Center/utils_interact.js': { add_hover_effect, addTrack, reverse },
                    // 添加相对路径的映射，指向绝对路径
                    './utils_circos.js': {
                        reduceData,
                        reduceData_Position,
                        gieStainColor,
                        transform_startend_position
                    },
                    './utils_interact.js': { add_hover_effect, addTrack, reverse }
                }
                if (moduleMap[id]) return moduleMap[id];
                console.error(`Module ${id} not found`);
                throw new Error(`Module ${id} not found`);
            }
        }

        console.log('Loading module...')
        const component = await loadModule('dynamic.vue', options)
        console.log('Module loaded:', component)
        dynamicComponent.value = component
        error.value = null
        errorDetails.value = ''
    } catch (err) {
        console.error('Failed to load component:', err)
        console.error('Error details:', {
            message: err.message,
            stack: err.stack
        })
        error.value = 'Failed to load component'
        errorDetails.value = `${err.message}\n${err.stack}`
        dynamicComponent.value = null
    } finally {
        isloading.value = false
    }
}
// 初始加载
console.log('Initial currentCode:', chatStore.currentCode)
loadDynamicComponent(chatStore.currentCode)

// 监听 currentCode 变化
watch(
    () => chatStore.currentCode,
    (newCode) => {
        console.log('currentCode changed:', newCode)
        loadDynamicComponent(newCode)
    }
)

</script>
<template>
    <div id="container">
        <div id="circos">
            <div class="blockTitle">
                <t-icon name="chart-ring-1"></t-icon>
                <span>PANEL</span>
            </div>
            <div id="loading" style="z-index: 1000;" v-show="isloading">
                <loading></loading>
            </div>
            <div id="circos_chart">
                <div id="polar_system">
                    <!-- 图表出现坐标轴才会出现，因为需要一个宽高撑起来。 -->
                    <div class="polar-container">
                        <div class="diagonal-lines"></div>
                        <div class="diagonal-lines-2"></div>
                        <div class="diagonal-lines-3"></div>
                        <div class="diagonal-lines-4"></div>
                        <div class="circle circle1"></div>
                        <div class="circle circle2"></div>
                        <div class="circle circle3"></div>
                        <div class="circle circle4"></div>
                        <div class="circle circle5"></div>
                        <div class="circle circle6"></div>
                        <div class="circle circle7"></div>
                        <div class="circle circle8"></div>
                        <div class="circle circle9"></div>
                        <div class="circle circle10"></div>
                        <div class="circle circle11"></div>
                        <div class="circle circle12"></div>
                        <div class="circle circle13"></div>
                        <div class="circle circle14"></div>
                        <div class="circle circle15"></div>
                        <div class="circle circle16"></div>
                        <div class="circle circle17"></div>
                        <div class="circle circle18"></div>
                        <div class="circle circle19"></div>
                        <div class="circle circle20"></div>
                    </div>
                </div>


                <!-- <demo1></demo1> -->
                <!-- <demo2></demo2> -->
                <!-- <demo3></demo3> -->
                <!-- <demo4></demo4> -->
                <!-- <demo_show></demo_show> -->
                <!-- <root v-show="step == 'root'"></root> -->

                <!-- 下面是动态组件的内容
暂时没时间做了，2025.5.21 -->
                <div>
                    <component :is="dynamicComponent" v-if="dynamicComponent" />
                    <div v-else-if="error" class="error">
                        加载组件失败: {{ error }}
                        <pre style="font-size: 12px; color: red;">{{ error }}</pre>
                    </div>
                    <div v-else>正在加载组件...</div>
                </div>


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
        // width: 80%;
        flex: 0 0 75%;
        position: relative;

        #loading {
            width: 100%;
            height: 100%;
            // background-color: salmon;
            position: absolute;
            top: -20px;
            left: 0;
        }

        #circos_chart {
            // background-color: pink;
            position: relative;
            left: 10px;

            #polar_system {
                // background-color: rgb(252, 0, 0);
                position: relative;
                top: -2px;
                left: -1px;
                border-radius: 50%;
                overflow: hidden;
                position: absolute;
                width: 100%;
                height: 100%;
                //shadow
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

            }

            /* 设置容器 */
            .polar-container {
                width: 100%;
                height: 100%;
                position: relative;
                // margin: 50px auto;
                border-radius: 50%;
                //shadow
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            }

            /* 设置环形圆圈 */
            .circle {
                position: absolute;
                border: 1px solid #ccc;
                border-radius: 50%;

            }

            /* 从外到内的20个圆圈 */
            .circle1 {
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }

            .circle2 {
                width: 95%;
                height: 95%;
                top: 2.5%;
                left: 2.5%;
            }

            .circle3 {
                width: 90%;
                height: 90%;
                top: 5%;
                left: 5%;
            }

            .circle4 {
                width: 85%;
                height: 85%;
                top: 7.5%;
                left: 7.5%;
            }

            .circle5 {
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
            }

            .circle6 {
                width: 75%;
                height: 75%;
                top: 12.5%;
                left: 12.5%;
            }

            .circle7 {
                width: 70%;
                height: 70%;
                top: 15%;
                left: 15%;
            }

            .circle8 {
                width: 65%;
                height: 65%;
                top: 17.5%;
                left: 17.5%;
            }

            .circle9 {
                width: 60%;
                height: 60%;
                top: 20%;
                left: 20%;
            }

            .circle10 {
                width: 55%;
                height: 55%;
                top: 22.5%;
                left: 22.5%;
            }

            .circle11 {
                width: 50%;
                height: 50%;
                top: 25%;
                left: 25%;
            }

            .circle12 {
                width: 45%;
                height: 45%;
                top: 27.5%;
                left: 27.5%;
            }

            .circle13 {
                width: 40%;
                height: 40%;
                top: 30%;
                left: 30%;
            }

            .circle14 {
                width: 35%;
                height: 35%;
                top: 32.5%;
                left: 32.5%;
            }

            .circle15 {
                width: 30%;
                height: 30%;
                top: 35%;
                left: 35%;
            }

            .circle16 {
                width: 25%;
                height: 25%;
                top: 37.5%;
                left: 37.5%;
            }

            .circle17 {
                width: 20%;
                height: 20%;
                top: 40%;
                left: 40%;
            }

            .circle18 {
                width: 15%;
                height: 15%;
                top: 42.5%;
                left: 42.5%;
            }

            .circle19 {
                width: 10%;
                height: 10%;
                top: 45%;
                left: 45%;
            }

            .circle20 {
                width: 5%;
                height: 5%;
                top: 47.5%;
                left: 47.5%;
            }

            .polar-container {
                width: 100%;
                height: 100%;
                position: relative;
                // margin: 50px auto;
                border-radius: 50%;
            }

            /* 添加交叉线 */
            .polar-container::before,
            .polar-container::after {
                content: '';
                position: absolute;
                background-color: #ccc;
            }

            /* 水平线 */
            .polar-container::before {
                width: 100%;
                height: 1px;
                top: 50%;
                left: 0;
            }

            /* 垂直线 */
            .polar-container::after {
                width: 1px;
                height: 100%;
                top: 0;
                left: 50%;
            }

            /* 对角线 */
            .diagonal-lines {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }

            /* 原有的45度和135度线 */
            .diagonal-lines::before,
            .diagonal-lines::after {
                content: '';
                position: absolute;
                background-color: #ccc;
                width: 141.4%;
                /* 100% * √2 */
                height: 1px;
                left: -20.7%;
                top: 50%;
            }

            .diagonal-lines::before {
                transform: rotate(45deg);
            }

            .diagonal-lines::after {
                transform: rotate(-45deg);
            }

            /* 添加更多对角线 */
            .diagonal-lines {

                &::after,
                &::before {
                    content: '';
                    position: absolute;
                    background-color: #ccc;
                    width: 141.4%;
                    height: 1px;
                    left: -20.7%;
                    top: 50%;
                }

                /* 15度和165度 */
                &::after {
                    transform: rotate(15deg);
                }

                &::before {
                    transform: rotate(165deg);
                }
            }

            /* 使用额外的元素添加更多线条 */
            .diagonal-lines-2,
            .diagonal-lines-3,
            .diagonal-lines-4 {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;

                &::after,
                &::before {
                    content: '';
                    position: absolute;
                    background-color: #ccc;
                    width: 141.4%;
                    height: 1px;
                    left: -20.7%;
                    top: 50%;
                }
            }

            /* 30度和150度 */
            .diagonal-lines-2 {
                &::after {
                    transform: rotate(30deg);
                }

                &::before {
                    transform: rotate(150deg);
                }
            }

            /* 60度和120度 */
            .diagonal-lines-3 {
                &::after {
                    transform: rotate(60deg);
                }

                &::before {
                    transform: rotate(120deg);
                }
            }

            /* 75度和105度 */
            .diagonal-lines-4 {
                &::after {
                    transform: rotate(75deg);
                }

                &::before {
                    transform: rotate(105deg);
                }
            }

        }
    }

    #console {
        // width: 20%;
        flex: 0 0 20%;
        max-width: 300px;
        height: 100%;
        background-color: salmon;
    }

}
</style>