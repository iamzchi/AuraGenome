<script setup>
const options = [
  {
    group: 'Human',
    children: [
      { label: 'hg19/GRCh37', value: 'hg19/GRCh37' },
      { label: 'hg38/GRCh38', value: 'hg38/GRCh38' }
    ]
  },
  {
    group: 'Mouse',
    children: [
      { label: 'mm9', value: 'mm9' },
      { label: 'mm10', value: 'mm10' }
    ]
  },
  {
    group: 'Rat',
    children: [
      { label: 'rn5', value: 'rn5' },
      { label: 'rn6', value: 'rn6' }
    ]
  },
  {
    group: 'Chimpanzee',
    children: [
      { label: 'panTro4', value: 'panTro4' },
      { label: 'panTro5', value: 'panTro5' }
    ]
  },
  {
    group: 'Dog',
    children: [
      { label: 'canFam3', value: 'canFam3' },
      { label: 'canFam4', value: 'canFam4' }
    ]
  },
  {
    group: 'Pig',
    children: [
      { label: 'Sscrofa11.1', value: 'Sscrofa11.1' }
    ]
  },
  {
    group: 'Horse',
    children: [
      { label: 'EquCab3.0', value: 'EquCab3.0' }
    ]
  },
  {
    group: 'Macaque monkey',
    children: [
      { label: 'rheMac8', value: 'rheMac8' }
    ]
  },
  {
    group: 'Arabidopsis thaliana',
    children: [
      { label: 'TAIR10', value: 'TAIR10' },
      { label: 'Col-0', value: 'Col-0' }
    ]
  }
];

import { ref, watch, watchEffect, nextTick, onMounted, computed } from 'vue';
const refVersion = ref('');
//监听改变 refVersion的值，console出来
watch(refVersion, (newVal) => {
  console.log(newVal);
  addNewMessage('ai', 'Got it! I will use ' + newVal + ' as the reference genome version.');
  addNewMessage('ai', 'Now, you can upload your files.');
  updateRecommendations(['make it rainbow!', 'make it more beautiful!'])
});

const messages = ref([
  {
    role: 'ai',
    content: "Initializing..."
  }
]);

/***
 * 文件菜单的逻辑
 */
// 添加当前选中文件的状态
const currentFile = ref(1); // 默认选中file1
// 处理菜单项点击事件
const handleMenuChange = (value) => {
  currentFile.value = value;
  console.log('选中文件：file' + value);
};



const inputText = ref(''); // 新增输入框绑定值
function sendVueFileToBackend() {
  // 读取 Vue 文件的内容
  const filePath = '@/components/Center/demo1.vue';

  // 你需要将文件的内容读取到 JavaScript 中
  // 假设文件内容已经存在于变量 `fileContent` 中
  const fileContent = getVueFileContent(filePath);  // 获取 Vue 文件的内容，这个函数你需要实现

  // 后端接口 URL
  const backendUrl = 'https://your-backend-api.com/upload';

  // 创建请求的负载
  const payload = {
    filename: 'demo1.vue',
    content: fileContent
  };

  // 使用 Fetch API 将文件内容发送给后端
  fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => {
      console.log('成功上传文件内容:', data);
    })
    .catch(error => {
      console.error('上传文件失败:', error);
    });
}

// 这个函数只是一个示例，实际开发中你需要实现一个方法来获取 Vue 文件的内容
function getVueFileContent(filePath) {
}

import { getQueryResult } from '@/utils/server';
const lastQuery = ref('');
const queryInfo = ref('');
//点击send按钮
const sendMessage = async () => {
  if (!inputText.value.trim()) return;
  addNewMessage('user', inputText.value);
  let query = inputText.value;
  inputText.value = '';
  
  await chatStore.handleMessage(query);
};

// 删除原来的 sendVueFileToBackend、generateCode 函数
import { getGenerateCode } from '@/utils/server';
import { useStepStore } from '@/stores/useStepStore.js';
const stepStore = useStepStore();
const updateStep = stepStore.updateStep;
import fileDetail from './Left/fileDetail.vue'

const inputRecommendItems = ref([])

const uploadFile = () => {
  console.log('uploadFile')
}
const visible = ref(false)
const restart = () => {
  console.log('restart')
  visible.value = true;  // 直接设置visible的值为true
  console.log(visible.value);
}



const openDialog = () => {
  visible.value = true
}

const closeDialog = () => {
  visible.value = false
}
import { useChatStore } from '@/stores/useChatStore'
const chatStore = useChatStore()
function addNewMessage(role, content) {
  chatStore.addMessage(role, content)
}

function updateRecommendations(newArray) {
  chatStore.updateInputRecommendItems(newArray)
}
messages.value = chatStore.messages

// 将 const loading = chatStore.loading; 替换为：
const loading = computed(() => chatStore.loading);
//watch messages 每次一发生变化，对话框就滚动到最底部，添加动画效果
// 使用 watch 来监听 chatStore.messages 的变化

function scrollToBottom() {
  const messagesDom = document.getElementById('messages');
  if (messagesDom) {
    console.log(messagesDom);
    messagesDom.scrollTop = messagesDom.scrollHeight;
    messagesDom.style.transition = 'all 0.3s ease';
    messagesDom.style.scrollBehavior = 'smooth';
  }
}


watch(chatStore.messages, (newMessages) => {
  console.log("messages changed");
  nextTick(() => {
    scrollToBottom()
  }, {
    immediate: true,
    deep: true
  })
});
onMounted(() => {
  scrollToBottom()
})

//推荐内容
const fileRecommendItems = ref([
  {
    "chart_type": "Histogram",
    "chart_description": "To display heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation."
  },
  {
    "chart_type": "Heatmap",
    "chart_description": "A heatmap showing the density of different mutation effects across the genome, where the 'Position' column is used to plot and 'Effect' can be grouped for different mutation types."
  },
])

// 添加处理子组件传递数据的函数
const updateFileRecommends = (recommends) => {
  if (recommends && Array.isArray(recommends)) {
    fileRecommendItems.value = recommends;
    console.log('已更新推荐内容:', recommends);
  }
};

import svgIcon from './Left/svgIcon.vue'

// 添加新的响应式变量来控制边框样式
const isGradientBorder = ref(false);
const isFocused = ref(false);

// 处理鼠标进入和离开事件
const handleMouseEnter = () => {
  isGradientBorder.value = true;
};

const handleMouseLeave = () => {
  if (!isFocused.value) {
    isGradientBorder.value = false;
  }
};

// 处理输入框焦点事件
const handleInputFocus = () => {
  isFocused.value = true;
  isGradientBorder.value = true;
};

const handleInputBlur = () => {
  isFocused.value = false;
  isGradientBorder.value = false;
};




</script>
<template>
  <t-dialog closeBtn closeOnEscKeydown footer theme="danger" header="请检查并保存重要信息后新建项目。" v-model:visible="visible">
    <t-form requiredMark>
      <t-form-item label="演示项目" name="course" initial-data="['1']">
        <t-checkbox-group :max="1">
          <t-checkbox value="1">案例1：急性髓系白血病（AML）患者基因组中染色体易位可视化分析</t-checkbox>
          <t-checkbox value="2">案例2：恶性黑色素瘤患者基因组中体细胞突变的全面目录的研究</t-checkbox>
        </t-checkbox-group>
      </t-form-item>
      <t-form-item label="新项目ID" name="name" initial-data="TDesign">
        <t-input placeholder="不可与已有ID重复" />
      </t-form-item>
      <t-form-item label="手机号码" name="tel" initial-data="123456">
        <t-input placeholder="请输入" />
      </t-form-item>
    </t-form>
    <t-divider />
    <h4>或者你可以从之前的项目中恢复进度：</h4>
    <div style="display: flex;"> <t-input placeholder="请输入你的项目ID" /><t-button>确认</t-button></div>
   
  </t-dialog>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <img src="/aura_logo.png" height="48" alt="logo" class="logo">
    <div id="select_genome">
      <div class="blockTitle">
        <t-icon name="attach"></t-icon>
        <span>Reference Genome Ver</span>
      </div>
      <t-select v-model="refVersion" :options="options" placeholder="Please select" filterable />
    </div>
  </div>
  <t-divider />
  <div class="row" style="justify-content: space-between;">
    <div class="blockTitle">
      <t-icon name="app"></t-icon>
      <span>DATA STORE</span>
    </div>
    <div style="margin-bottom: .2rem;">
      <t-button @click="uploadFile" size="small">
        <template #icon>
          <t-icon name="upload" />
        </template>
        upload</t-button>
      <t-button style="margin-left: 10px;" @click="restart" size="small">
        <template #icon>
          <t-icon name="star" />
        </template>
        RESTART</t-button>
    </div>
  </div>
<div id="dataStore" class="border radius20">
  <t-menu width="15%" :value="currentFile" @change="handleMenuChange">
    <t-menu-item v-for="i in 6" :key="i" :value="i">
      <template #icon>
        <t-icon name="file" />
      </template>
      file{{ i }}
    </t-menu-item>
  </t-menu>
  <fileDetail style="width: 85%;" :current-file-number="currentFile" @update-recommends="updateFileRecommends" />
</div>
  <!-- <t-divider /> -->
  <t-space></t-space>
  <div id="chatContainer">
    <div id="recommendPanel" style="position: relative;">
      <div class="blockTitle">
        <t-icon name="filter-3"></t-icon>
        <span>Vis. SOLUTIONS</span>
      </div>
      <div class="fileRecommendItem" v-for="(item, index) in fileRecommendItems" :key="item.id">
        <div class="fileRecommendItemTitle">
          <p class="itemNumber">
            Recommend No.{{ index + 1 }}
          </p>
          <svgIcon :chartType="item.chart_type" /> {{
            item.chart_type
          }}
        </div>
        <div style="padding: 20px 10px;">
          {{ item.chart_description }}
        </div>

        <t-button style="margin-top: 10px;" size="small" variant="outline" shape="round" block>
          <template #icon>
            <t-icon name="check-double" />
          </template>
          Apply</t-button>
      </div>
      <t-button style="position: absolute; bottom:0" block shape="round" variant="outline">
        <template #icon>
          <t-icon name="chat-bubble-add" />
        </template>
        Start a new Chat</t-button>
    </div>

    <div id="chatPanel">
      <div class="blockTitle">
        <t-icon name="chat-bubble-smile"></t-icon>
        <span>CHAT WITH<span class="gradientText">Aura</span></span>
      </div>
      <t-loading :loading="loading" text="Estimated time consumption: 1 minute.">
      <div id="chat" :class="['radius20', isGradientBorder ? 'gradient-border' : 'border']"
        @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div id="messages">
          <div v-for="(msg, index) in messages" :key="index"
            :class="['message', msg.role === 'ai' ? 'ai-message' : 'user-message']">
            <img src="/aura.png" v-if="msg.role === 'ai'" height="35px">
            <div class="bubble">{{ msg.content }}</div>
          </div>
        </div>
        <div id="inputPanel">
          <div class="row">
            <t-input v-model="inputText" @enter="sendMessage" @focus="handleInputFocus" @blur="handleInputBlur"
              placeholder="How can I help you?">
            </t-input>
            <t-button @click="sendMessage">
              send
            </t-button>
          </div>
          <div id="inputRecommend">
            <div class="inputRecommendItems" v-for="(item,index) in chatStore.inputRecommendItems" :key="index">
              {{ item }} <t-icon name="enter" />
            </div>
          </div>
        </div>
      </div>
      </t-loading>
    </div>
  </div>

</template>
<style scoped lang="scss">
.gradientText {
  background: linear-gradient(to right, #007AFF, #89c2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#inputRecommend {
  margin-top: .5rem;

  .inputRecommendItems {
    font-size: .7rem;
    // background-color: var(--td-brand-color-7);
    background-color: var(--td-gray-color-3);
    padding: .2rem .6rem;
    border-radius: 40px;
    width: fit-content;
    color: var(--td-font-gray-1);
    display: inline-block;
    margin: .2rem .1rem;
    transition: all 0.3s ease;
    align-items: center;
    text-align: center;
    //文字上下居中
    line-height: 1rem;
  }

  .inputRecommendItems:hover {
    background-color: var(--td-brand-color-6);
    cursor: pointer;
  }
}

#chatContainer {
  width: 100%;
  // background-color: pink;
  display: flex;
  justify-content: space-between;
  // align-items: center;
  gap: 20px;

  #chatPanel {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
  }

  #recommendPanel {
    width: 40%;
    // background-color: red;
  }

  .fileRecommendItem {
    // background-color: var(--td-brand-color-7);
    // color: white;
    border: 1px solid var(--td-brand-color-7);
    color: var(--td-brand-color-7);
    // padding: 0.3rem;
    font-size: 0.8rem;
    border-radius: 10px;
    margin: 2px;
    transition: all 0.3s ease;
    position: relative;
    margin-top: 30px;
    overflow: hidden;

    .fileRecommendItemTitle {
      background-image: linear-gradient(-135deg, #6da9ff 10%, #367DB0 100%);
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      font-size: 1rem;
      gap: 5px;
      position: relative;
      height: 40px;
      padding-left: 1rem;
    }

    .itemNumber {
      position: absolute;
      top: -50px;
      right: 10px;
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
}

#chat {
  // background-color: #f4f4f4;
  height: 38.5vh;
  // width: 60%;
  padding: 10px;
  position: relative;

  #inputPanel {
    position: absolute;
    bottom: 20px;
    width: 90%;
    //make it center!
    left: 5%;

  }
}

#dataStore {
  background-color: rgb(255, 255, 255);
  // background-color: #f4f4f4;
  // border: 1px solid #9d9d9d;
  height: 40vh;
  padding: 10px;
  display: flex;
  flex-direction: row;
}

#messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  height: 80%;
  overflow: scroll;
  //hide scrollbar
  scrollbar-width: none;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    display: none;
  }

  padding-bottom: 40px;

}

.message {
  display: flex;
  width: 100%;
  align-items: center;

  img {
    margin-right: 10px;
  }
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  word-wrap: break-word;
  font-size: .9rem;
}

.ai-message .bubble {

  background: rgb(2, 0, 36);
  background: linear-gradient(164deg, rgba(2, 0, 36, 1) 0%, #deefff 0%, #f0f0f0 30%);
  background-color: #f0f0f0;
  // background-color: #ffffff;
  color: #000;
  max-width: 90%; // 修改为90%
}

.user-message .bubble {
  // background-color: var(--td-brand-color-7);
  // background-color: var(--td-gray-color-13);
  background-color: #89c2ff29;
  color: #000;
  // color: white;
}

// .gradient-border {
//   border: 2px solid transparent;
//   background-image: linear-gradient(white, white), 
//     linear-gradient(90deg, var(--td-brand-color-7), var(--td-brand-color-8));
//   background-origin: border-box;
//   background-clip: padding-box, border-box;
// }</style>
