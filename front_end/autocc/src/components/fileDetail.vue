<script setup>
const fileRecommendItems = [
    { description: '统计变异类型（Insertion 和 Deletion）的数量，并将其用环形图分组可视化，展示两类变异的比例。' },
    { description: '统计变异类型（Insertion 和 Deletion）的数量，并将其用环形图分组可视化，展示两类变异的比例。' },
]
//使用props
const props = defineProps({
    fileName: {
        type: String,
        required: true,
        default: 'fileName'
    },
    fileTags: {
        type: Array,
        required: true,
        default: ['tag1', 'tag2', 'tag3']
    },
    fileDescription: {
        type: String,
        required: true,
        default: 'this is a description about the file which is uploaded by the user'
    },
})
const columns = [
    { colKey: 'type', title: '变异类型' },
    { colKey: 'count', title: '变异数量' },
    { colKey: 'ratio', title: '变异比例' },
    { colKey: 'action', title: '操作' },
    { colKey: 'action1', title: '操作1' },
    { colKey: 'action2', title: '操作2' },
    { colKey: 'action3', title: '操作3' },
    { colKey: 'action4', title: '操作4' },
    { colKey: 'action5', title: '操作5' },
    { colKey: 'action6', title: '操作6' },
]
const data = [
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
]
import myTable from './table.vue'
import myBar from './bar.vue'
import { ref } from 'vue'
const chartData = ref([
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 },
  { name: 'E', value: 20 },
  { name: 'F', value: 90 },
  { name: 'G', value: 55 },
])

</script>
<template>
    <div id="container">
        <div id="fileBoard">
            <div id="fileTitle">
                <t-icon name="download" />
                {{ fileName }}
            </div>

            <div id="fileTags">
                <span class="fileTag" v-for="tag in fileTags" :key="tag.id">{{ tag }}</span>
            </div>
            <p id="fileDescription">
                {{ fileDescription }}
            </p>
        </div>
        <div id="filePreview">
            <myTable :data="data" :columns="columns"></myTable>
        </div>
        <div id="fileBarChart">
            <myBar :data="chartData"></myBar>
        </div>
        <t-divider>为您推荐以下可视化方案</t-divider>
        <div id="fileRecommend">
            <div class="fileRecommendItem" v-for="item in fileRecommendItems" :key="item.id">
                {{ item.description }}
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    #filePreview {
        margin-top: 10px;
    }

    #fileBoard {
        background-color: rgb(221, 221, 221);
        padding: 10px 20px;
        border-radius: 30px;


        .fileTag {
            margin-right: 10px;
            background-color: var(--td-brand-color-7);
            color: white;
            padding: 2px 5px;
            font-size: .6rem;
            border-radius: 50px;
        }

        #fileTitle {
            display: flex;
            align-items: center;
        }

        #fileDescription {
            font-size: .8rem;
            color: var(--td-text-color-secondary);
        }
    }

    #fileRecommend {
        .fileRecommendItem {
            background-color: var(--td-brand-color-7);
            color: white;
            padding: .3rem;
            font-size: .8rem;
            border-radius: 5px;
            margin: 10px;
            transition: all 0.3s ease;
        }

        .fileRecommendItem:hover {
            background-color: var(--td-brand-color-8);
            cursor: pointer;
        }
    }
}
</style>