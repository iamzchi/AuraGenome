<script setup>
import { ref,onMounted } from 'vue';
const steps = ref([
    {
        step: 1,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 2,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 3,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 4,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 5,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 6,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 7,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
    {
        step: 8,
        title: 'Upload Files',
        description: 'Upload your files to get started.',
        note: "nothing to show"
    },
])
onMounted(()=>{
    console.log(steps.value)
    steps.value = steps.value.reverse()
})
</script>
<template>
    <div class="blockTitle">
        <t-icon name="work-history"> </t-icon>
        <span>Projects</span>
    </div>
    <div id="projects">
        <div class="project" v-for="i in 3" :key="i"></div>
    </div>
    <t-space />
    <div class="blockTitle">
        <t-icon name="animation"> </t-icon>
        <span>Step Snapshot</span>
    </div>
    <div id="steps">
        <div class="step" v-for="(item, index) of steps" :key="index">
            <div class="line" v-show="index != steps.length - 1"></div>
            <div class="row">
                <div class="snapshot">

                </div>
                <div class="content">

                    <div class="title">Step {{ item.step }}: {{ item.title }}</div>
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
    background-color: rgb(244, 244, 244);
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
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
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
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background-color: rgb(244, 244, 244);
    padding: 20px;
    height: 78vh;
    overflow-y: auto;

    .step {
        width: 100%;
        height: 120px;
        background-color: rgb(217, 217, 217);
        border-radius: 20px;
        margin-bottom: 40px;
        position: relative;
        padding: 10px;
        transition: all 0.3s ease;

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
            background-color: rgb(255, 255, 255);
            border-radius: 200px;
            z-index: 10;
        }
        .content{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 60%;
            margin-left: 10px;
            .title{
                font-size: .8rem;
                font-weight: bold;
            }
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
        background-color: rgb(207, 207, 207);
    }
}
</style>