<script setup>
import { ref,onMounted } from 'vue';
const steps = ref([
  {
    title: "Insertion and Deletion Bar",
    step: 1,
    note: "add your note",
    time:"2025-1-23",
    description: "Visualizes insertion (dark green) and deletion (light green) events with validation status."
  },
  {
    title: "Zygosity Mutation Bar",
    step: 2,
    note: "add your note",
    time:"2025-1-23",
    description: "Displays heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation."
  },
  {
    title: "Mutation Types",
    step: 3,
    note: "add your note",
    time:"2025-1-23",
    description: "Shows different mutation effects (Silent, Missense, Nonsense, Splice site) using colored scatter plots."
  },
  {
    title: "Copy Number Changes",
    step: 4,
    note: "add your note",
    time:"2025-1-23",
    description: "Depicts copy number variations across the genome using a blue line chart."
  },
  {
    title: "Loss of Heterozygosity",
    step: 5,
    note: "add your note",
    time:"2025-1-23",
    description: "Represents LOH (Loss of Heterozygosity) regions in the genome with a red heatmap."
  },
  {
    title: "Rearrangements Links",
    step: 6,
    note: "add your note",
    time:"2025-1-24",
    description: "Shows chromosomal rearrangements using green (intra) and purple (inter) connection lines."
  }
]
)
onMounted(()=>{
    console.log(steps.value)
    steps.value = steps.value.reverse()
})
</script>
<template>
    <div class="blockTitle">
        <t-icon name="work-history"> </t-icon>
        <span>PROJECTS</span>
    </div>
    <div id="projects" class="border">
        <div class="project" v-for="i in 3" :key="i"></div>
    </div>
    <t-space />
    <div class="blockTitle">
        <t-icon name="animation"> </t-icon>
        <span>STEP SNAPSHOTS</span>
    </div>
    <div id="steps" class="border">
        <div class="step" v-for="(item, index) of steps" :key="index">
            <!-- <div class="line" v-show="index != steps.length - 1"></div> -->
            <div class="title">Step {{ item.step }}: {{ item.title }}
                <p class="time">{{ item.time }}</p>
            </div>
            <div class="row" style="padding: 10px;">
                <div class="snapshot">

                </div>
                <div class="content">

                    <!-- <div class="title">Step {{ item.step }}: {{ item.title }}</div> -->
                    <div class="description">{{ item.description }}</div>
                    <div class="note">{{ item.note }}</div>
                </div>
            </div>
            <t-button style="position: absolute;right: 10px;bottom: 10px;" variant="text" size="small" theme="primary">
                <template #icon>
                    <t-icon name="pen-ball"></t-icon>
                </template>
                Note
            </t-button>
        </div>
    </div>

</template>
<style scoped lang="scss">
#projects {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 20px;
    // background-color: rgb(244, 244, 244);
    padding: 10px;

    .project {
        width: 100px;
        height: 100px;
        background-color: rgb(217, 217, 217);
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .project:hover {
        background-color: rgb(207, 207, 207);
        cursor: pointer;
        transform: scale(1.1);
    }
    .project:nth-child(1){
        //add background image
        background-image: url('@/assets/projects/project1.png');
        background-size: cover;
        background-position: center;
    }
    .project:nth-child(2){
        background-image: url('@/assets/projects/project2.png');
        background-size: cover;
        background-position: center;
    }
    .project:nth-child(3){
        background-image: url('@/assets/projects/project3.png');
        background-size: cover;
        background-position: center;
    }
    
}

#steps {
    // display: flex;
    // flex-direction: column;
    border-radius: 20px;
    background-color: rgb(244, 244, 244);
    padding: 20px;
    height: 78vh;
    overflow-y: auto;
    //隐藏滚动条
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar{
        display: none;
    }

    .step {
        width: 100%;
        height:fit-content;
        border-radius: 10px;
        margin-bottom: 20px;
        position: relative;
        // padding: 10px;
        transition: all 0.3s ease;
        background-color: rgb(255, 255, 255);
        overflow: hidden;
        .title{
                font-size: .8rem;
                font-weight: bold;
                width: 100%;
                padding: 10px;
                padding-left: 15px;
                height: 3rem;
                text-align: left;
                // background-color: rgb(217, 217, 217);
                background-image: linear-gradient( 135deg, #6da9ff 10%, #367DB0 100%);
                color: white;
                .time{
                    font-size: 0.5rem;
                    font-weight: normal;
                    color: rgb(255, 255, 255);
                    position: relative;
                    top:-.2rem;
                }
            }

        .line {
            width: 10px;
            height: 80px;
            background-color: rgb(217, 217, 217);
            position: absolute;
            bottom: -60px;
            left: 30px;
            z-index: 1;
        }
        .snapshot{
            width: 100px;
            height: 100px;
            aspect-ratio: 1;
            background-color: rgb(131, 131, 131);
            border-radius: 200px;
            z-index: 10;
            background-image: url('@/assets/projects/project1.png');
            background-size: cover;
            background-position: center;
        }
        .content{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 60%;
            margin-left: 10px;
            padding: 10px;

            .description{
                font-size: 0.7rem;
                color: var(--td-brand-color-6);
            }
            .note{
                font-size: 0.7rem;
                color: rgb(100, 100, 100);
            }
        }
    }
    .step:hover{
        // background-color: rgb(207, 207, 207);
        transform: scale(1.05);
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 60px 40px -7px;
    }
}
</style>