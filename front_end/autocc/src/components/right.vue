<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useChatStore } from '../stores/useChatStore';

const steps = ref([]);
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedProjectIndex = ref(null);

onBeforeMount(() => {
    const store = useChatStore();
    steps.value = [...store.snapshots].reverse();
})

onMounted(() => {
    console.log(steps.value);
    // 点击页面任意位置关闭右键菜单
    document.addEventListener('click', () => {
        showContextMenu.value = false;
    });
})

// 处理右键点击事件
const handleContextMenu = (event, index) => {
    event.preventDefault();
    selectedProjectIndex.value = index;
    contextMenuPosition.value = {
        x: event.clientX,
        y: event.clientY
    };
    showContextMenu.value = true;
};

// 处理菜单项点击
const handleMenuItemClick = (action) => {
    const projectIndex = selectedProjectIndex.value;
    console.log(`执行操作: ${action}，项目索引: ${projectIndex}`);
    
    switch(action) {
        case 'import':
            // 导入项目逻辑
            break;
        case 'reuse':
            // 重用配置逻辑
            break;
        case 'download':
            // 下载项目逻辑
            break;
        case 'delete':
            // 删除项目逻辑
            break;
    }
    
    showContextMenu.value = false;
};
</script>
<template>
    <div class="blockTitle">
        <t-icon name="work-history"> </t-icon>
        <span>PROJECTS</span>
    </div>
    <div id="projects" class="border">
        <div class="project" v-for="(i, index) in 3" :key="i" @contextmenu="handleContextMenu($event, index)"></div>
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
                <div class="snapshot" :style="{ backgroundImage: `url(${item.img})` }">
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

    <!-- 自定义右键菜单 -->
    <div v-if="showContextMenu" class="context-menu" :style="{ top: `${contextMenuPosition.y}px`, left: `${contextMenuPosition.x}px` }">
        <div class="menu-item" @click="handleMenuItemClick('import')">
            <t-icon name="upload"></t-icon>
            <span>Import</span>
        </div>
        <div class="menu-item" @click="handleMenuItemClick('reuse')">
            <t-icon name="refresh"></t-icon>
            <span>Reuse configs</span>
        </div>
        <div class="menu-item" @click="handleMenuItemClick('download')">
            <t-icon name="download"></t-icon>
            <span>Download</span>
        </div>
        <div class="menu-item delete" @click="handleMenuItemClick('delete')">
            <t-icon name="delete"></t-icon>
            <span>Delete</span>
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
        // background-color: rgb(217, 217, 217);
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .project:hover {
        // background-color: rgb(207, 207, 207);
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
                background-image: linear-gradient( -135deg, #6da9ff 10%, #367DB0 100%);
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
            // background-color: rgb(131, 131, 131);
            border-radius: 200px;
            z-index: 10;
            //background-image: url('@/assets/projects/project1.png');
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
                color: var(--td-font-gray-1);
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

/* 右键菜单样式 */
.context-menu {
    position: fixed;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 8px 0;
    z-index: 1000;
    min-width: 180px;
    
    .menu-item {
        padding: 8px 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: #f5f5f5;
        }
        
        .t-icon {
            margin-right: 8px;
            font-size: 16px;
        }
        
        span {
            font-size: 14px;
        }
        
        &.delete {
            color: #e34d59;
            
            &:hover {
                background-color: #ffebee;
            }
        }
    }
}
</style>