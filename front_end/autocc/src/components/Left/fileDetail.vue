<script setup>
const fileRecommendItems = ref([
    { description: '统计变异类型（Insertion 和 Deletion）的数量，并将其用环形图分组可视化，展示两类变异的比例。' },
    { description: '统计变异类型（Insertion 和 Deletion）的数量，并将其用环形图分组可视化，展示两类变异的比例。' },
])
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
const file_name = ref(props.fileName)
const file_tags = ref(props.fileTags)
const file_description = ref(props.fileDescription)
const columns = ref([
    { colKey: 'type', title: 'type' },
    { colKey: 'count', title: 'count' },
    { colKey: 'ratio', title: 'ratio' },
    { colKey: 'action', title: 'action' },
    { colKey: 'action1', title: 'action1' },
    { colKey: 'action2', title: 'action2' },
    { colKey: 'action3', title: 'action3' },
    { colKey: 'action4', title: 'action4' },
    { colKey: 'action5', title: 'action5' },
    { colKey: 'action6', title: 'action6' },
])
const data = ref([
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },    { type: 'Deletion', count: 200, ratio: '20%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
    { type: 'Insertion', count: 100, ratio: '10%',action:'11',action1:'12',action2:'13',action3:'14',action4:'15',action5:'16',action6:'17' },
])
import myTable from './table.vue'
import myBar from './bar.vue'
import { ref } from 'vue'
const chartData = ref([
  { name: 'A', value: 30,color:'red',class:'red'},//name就是完整的内容
  { name: 'B', value: 80,color:'blue',class:'blue' },
  { name: 'C', value: 45,color:'green',class:'green' },
  { name: 'D', value: 60,color:'yellow',class:'yellow' },
  { name: 'E', value: 20,color:'purple',class:'purple' },
  { name: 'F', value: 90,color:'pink',class:'pink' },
  { name: 'G', value: 55,color:'orange',class:'orange' },
])
import { getSingleFileDetail } from '@/utils/server'
const fileInfoObj = ref({})
function getFileDetail(project_name_param,file_name_param){
  getSingleFileDetail(project_name_param,file_name_param).then(res => {
    //把res中的NaN替换为null
    res = res.replace(/NaN/g, 'null')
    //把res转换为json
    res = JSON.parse(res)
    columns.value = res.data_for_table.columns,
    data.value = res.data_for_table.data
    fileInfoObj.value = res.data_info.find(item => `${item.file_name}.csv` === file_name_param)
    console.log("ressssssssssss",fileInfoObj.value);
    file_description.value = fileInfoObj.value.description
    file_name.value = fileInfoObj.value.file_name
    file_tags.value = fileInfoObj.value.tags
    fileRecommendItems.value = fileInfoObj.value.recommends
    chartData.value = res.discrete_data
    console.log("chartData.value",chartData.value);
  })
}
import { onMounted } from 'vue'
onMounted(() => {
    getFileDetail('id_001','file1.csv')
})
</script>
<template>
    <div id="container">
        <div id="fileBoard">
            <div id="fileTitle">
                <t-icon name="download" />
                {{ file_name }}
            </div>

            <div id="fileTags">
                <span class="fileTag" v-for="tag in file_tags" :key="tag.id">{{ tag }}</span>
            </div>
            <p id="fileDescription">
                {{ file_description }}
            </p>
        </div>
        <div class="subtitle">
            File Preview
        </div>
        <div id="filePreview">
            <myTable :data="data" :columns="columns"></myTable>
        </div>
        <div class="subtitle">
            Discrete value statistics
        </div>
        <div id="fileBarChart">
            <myBar :data="chartData"></myBar>
        </div>
        <div class="subtitle">
            recommend the following visualization solutions 
        </div>
        <div id="fileRecommend">
            <div class="fileRecommendItem" v-for="item in fileRecommendItems" :key="item.id">
                <span style="font-weight: bold; color: var(--td-brand-color-2);">{{ item.chart_type }}</span>
                {{ item.chart_description }}
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.subtitle{
    color: gray;
    font-size:.5rem;
    width: 100%;
    text-align: left;
    font-weight: bold;
    margin-top: 10px;
    border-top: 1px solid rgb(214, 214, 214);
    padding-top: 5px;
}
#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    #filePreview {
        margin-top: 10px;
        width: 100%;
        height: 200px;
        overflow: scroll;
        //隐藏滚动条
        scrollbar-width: none;
        -ms-overflow-style: none;
        ::-webkit-scrollbar {
            display: none;
        }

    }
    #fileBarChart{
        width: 100%;
        height: 150px;
    }
    #fileBoard {
        background-color: rgb(239, 239, 239);
        padding: 10px 20px;
        border-radius: 10px;


        .fileTag {
            margin-right: 10px;
            background-color: var(--td-brand-color-7);
            color: white;
            padding: 2px 5px;
            font-size: .6rem;
            border-radius: 50px;
            display: inline-block;
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