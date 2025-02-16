<script setup>
const fileRecommendItems = ref([
    {
        description:
            "统计变异类型（Insertion 和 Deletion）的数量，并将其用环形图分组可视化，展示两类变异的比例。",
    },
    {
        description:
            "统计变异类型（Insertion 和 Deletion）的数量，并将其用环形图分组可视化，展示两类变异的比例。",
    },
]);
//使用props
const props = defineProps({
    fileName: {
        type: String,
        required: true,
        default: "fileName",
    },
    fileTags: {
        type: Array,
        required: true,
        default: ["tag1", "tag2", "tag3"],
    },
    fileDescription: {
        type: String,
        required: true,
        default:
            "this is a description about the file which is uploaded by the user",
    },
});
const file_name = ref(props.fileName);
const file_tags = ref(props.fileTags);
const file_description = ref(props.fileDescription);
const columns = ref([
    { colKey: "type", title: "type" },
    { colKey: "count", title: "count" },
    { colKey: "ratio", title: "ratio" },
    { colKey: "action", title: "action" },
    { colKey: "action1", title: "action1" },
    { colKey: "action2", title: "action2" },
    { colKey: "action3", title: "action3" },
    { colKey: "action4", title: "action4" },
    { colKey: "action5", title: "action5" },
    { colKey: "action6", title: "action6" },
]);
const data = ref([
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Deletion",
        count: 200,
        ratio: "20%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
    {
        type: "Insertion",
        count: 100,
        ratio: "10%",
        action: "11",
        action1: "12",
        action2: "13",
        action3: "14",
        action4: "15",
        action5: "16",
        action6: "17",
    },
]);
import myTable from "./table.vue";
import myBar from "./bar.vue";
import { ref } from "vue";
const chartData = ref([
    {
        "name": "Zygosity: het",
        "value": 26515,
        "color": "#ff2918",
        "class": "het"
    },
    {
        "name": "Zygosity: hom",
        "value": 6830,
        "color": "#ff4652",
        "class": "hom"
    },
    {
        "name": "Effect: Intergenic",
        "value": 23191,
        "color": "#ff2918",
        "class": "Intergenic"
    },
    {
        "name": "Effect: Intronic",
        "value": 9543,
        "color": "#ff4652",
        "class": "Intronic"
    },
    {
        "name": "Effect: UTR",
        "value": 198,
        "color": "#ff0f4b",
        "class": "UTR"
    },
    {
        "name": "Effect: Missense",
        "value": 168,
        "color": "#d4334f",
        "class": "Missense"
    },
    {
        "name": "Effect: Noncoding_RNA",
        "value": 114,
        "color": "#d53c25",
        "class": "Noncoding_RNA"
    },
    {
        "name": "Effect: Silent",
        "value": 104,
        "color": "#9b0000",
        "class": "Silent"
    },
    {
        "name": "Effect: Nonsense",
        "value": 14,
        "color": "#ff354a",
        "class": "Nonsense"
    },
    {
        "name": "Effect: Splice",
        "value": 13,
        "color": "#ff2f2d",
        "class": "Splice"
    },
    {
        "name": "Validation_status: SOMATIC",
        "value": 454,
        "color": "#ff2918",
        "class": "SOMATIC"
    },
    {
        "name": "Validation_status: COSMIC",
        "value": 43,
        "color": "#ff4652",
        "class": "COSMIC"
    },
    {
        "name": "Validation_status: REAL, STATUS UNKNOWN",
        "value": 25,
        "color": "#ff0f4b",
        "class": "REAL, STATUS UNKNOWN"
    },
    {
        "name": "Validation_status: UNCONFIRMED",
        "value": 16,
        "color": "#d4334f",
        "class": "UNCONFIRMED"
    },
    {
        "name": "Validation_zygosity: Het",
        "value": 322,
        "color": "#ff2918",
        "class": "Het"
    },
    {
        "name": "Validation_zygosity: Hom",
        "value": 171,
        "color": "#ff4652",
        "class": "Hom"
    },
    {
        "name": "Validation_zygosity: het",
        "value": 4,
        "color": "#ff0f4b",
        "class": "het"
    }
]);
import { getSingleFileDetail } from "@/utils/server";
const fileInfoObj = ref({});
function getFileDetail(project_name_param, file_name_param) {
    getSingleFileDetail(project_name_param, file_name_param).then((res) => {
        //把res中的NaN替换为null
        res = res.replace(/NaN/g, "null");
        //把res转换为json
        res = JSON.parse(res);
        (columns.value = res.data_for_table.columns),
            (data.value = res.data_for_table.data);
        fileInfoObj.value = res.data_info.find(
            (item) => `${item.file_name}.csv` === file_name_param
        );
        console.log("ressssssssssss", fileInfoObj.value);
        file_description.value = fileInfoObj.value.description;
        file_name.value = fileInfoObj.value.file_name;
        file_tags.value = fileInfoObj.value.tags;
        fileRecommendItems.value = fileInfoObj.value.recommends;
        chartData.value = res.discrete_data;
        console.log("chartData.value", chartData.value);
    });
}
import { onMounted } from "vue";
onMounted(() => {
    getFileDetail("id_001", "file1.csv");
});
</script>
<template>
    <div id="big_container">
        <div id="detail_container">
            <div id="fileBoard">
                <div id="fileTitle">
                    <t-icon name="download" />
                    {{ file_name }}
                </div>

                <div id="fileTags">
                    <span class="fileTag" v-for="tag in file_tags" :key="tag.id">{{
                        tag
                    }}</span>
                </div>
                <p id="fileDescription">
                    {{ file_description }}
                </p>
            </div>
            <div class="subtitle">File Preview</div>
            <div id="filePreview">
                <myTable :data="data" :columns="columns"></myTable>
            </div>

            <div class="subtitle">recommend the following visualization solutions</div>
            <div class="fileRecommendItem" v-for="(item, index) in fileRecommendItems" :key="item.id">
                <p class="fileRecommendItemTitle">{{
                    item.chart_type
                }}</p>
                {{ item.chart_description }}
                <p class="itemNumber">
                    Recommend No.{{ index + 1 }}
                </p>
            </div>
        </div>

        <div id="fileRecommend">
            <div class="subtitle">Discrete value statistics</div>
            <div id="fileBarChart">
                <myBar :data="chartData"></myBar>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.subtitle {
    color: gray;
    font-size: 0.5rem;
    width: 100%;
    text-align: left;
    font-weight: bold;
    margin-top: 10px;
    border-top: 1px solid rgb(214, 214, 214);
    padding-top: 5px;
}

#big_container {
    display: flex;
    flex-direction: row;
    // align-items: center;
    width: 100%;
    justify-content: space-between;
}

#fileRecommend {
    width: 35%;


}

.fileRecommendItem {
    background-color: var(--td-brand-color-7);
    color: white;
    padding: 0.3rem;
    font-size: 0.8rem;
    border-radius: 5px;
    margin: 2px;
    transition: all 0.3s ease;
    position: relative;
    margin-top: 20px;
    .fileRecommendItemTitle {
        position: absolute;
        background-color: var(--td-brand-color-7);
        border-radius: 5px;
        padding: 0.3rem;
        top: -30px;
        left: 0px;
        font-weight: bold;
        color: var(--td-brand-color-2);
    }
    .itemNumber {
        position: absolute;
        top: -25px;
        right: 0px;
        font-size: 0.7rem;
        color: var(--td-brand-color-7);
    }
}

.fileRecommendItem:hover {
    // background-color: var(--td-brand-color-8);
    //放大
    transform: scale(1.03);
    box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
    cursor: pointer;
}

#detail_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;

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


    #fileBoard {
        background-color: rgb(239, 239, 239);
        padding: 10px 20px;
        border-radius: 10px;

        .fileTag {
            margin-right: 10px;
            background-color: var(--td-brand-color-7);
            color: white;
            padding: 2px 5px;
            font-size: 0.6rem;
            border-radius: 50px;
            display: inline-block;
        }

        #fileTitle {
            display: flex;
            align-items: center;
        }

        #fileDescription {
            font-size: 0.8rem;
            color: var(--td-text-color-secondary);
        }
    }


}
#fileBarChart {
        width: 100%;
        height: 100%;
        // overflow-x: scroll;
        // overflow-y: visible;
        // background-color: pink;
    }

</style>
