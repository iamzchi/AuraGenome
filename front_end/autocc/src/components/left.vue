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

import { ref, watch, watchEffect, nextTick, onMounted } from 'vue';
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
const sendMessage = async () => {
  if (!inputText.value.trim()) return;
  addNewMessage('user', inputText.value);
  let query = inputText.value;
  inputText.value = '';

  console.log("将目前有的前端文件内容传给后端");
  if (query == 'd' || query == 'D') {
    setTimeout(() => {
      addNewMessage('ai', "OK, I will use the default aggregation distance of 10Mb.");
    }, 1000);
    setTimeout(() => {
      addNewMessage('ai', "Generating, please wait a moment...");
    }, 2000);
    generateCode(lastQuery.value, queryInfo.value);
    lastQuery.value = '';
  } else if (lastQuery.value == '') {
    let queryResult = await getQueryResult(query);
    queryResult = queryResult.query_info;
    console.log("queryResult:", queryResult);
    queryInfo.value = queryResult;
    console.log("queryInfo.value:", queryInfo.value);

    console.log(queryResult.query_type);
    if (queryResult.query_type == "a") {
      // 添加新的代码
      if (queryResult.chart_type == "histogram" || queryResult.chart_type == "highlight" || queryResult.chart_type == "heatmap") {
        addNewMessage('ai', `Generating a ${queryResult.chart_type} requires aggregating the chromosome data ${queryResult.file_name} you uploaded. What aggregation distance do you want? (Reply "d" to aggregate according to the distance of 10Mb by default)`);
        lastQuery.value = query;
      } else if (queryResult.chart_type == "line" || queryResult.chart_type == "scatter") {
        addNewMessage('ai', `Generating ${queryResult.chart_type} using ${queryResult.file_name}, please wait a moment...`);
        generateCode(query, queryInfo.value);
      }
    } else if (queryResult.query_type == "b") {
      // 修改现有的文件
      console.log("修改现有的文件");
    }
  }
};
import { getGenerateCode } from '@/utils/server';
import { useStepStore } from '@/stores/useStepStore.js';
const stepStore = useStepStore();
const updateStep = stepStore.updateStep;
async function generateCode(query, queryInfojson) {
  let current_step = stepStore.step;
  console.log(`发送的内容：${query},${queryInfojson}`);
  let project_id = "id_001";
  // { query,queryInfo,project_id,current_step })
  const res = await getGenerateCode(query, queryInfojson, project_id, current_step);
  console.log(`generatecode返回的内容：${res.status},string:${res.status.toString()}`);
  if (res.status == 200) {
    console.log("成功拿到返回后（本次生成图表成功）");
    //成功拿到返回后（本次生成图表成功）
    if (current_step == "root") {
      updateStep("step1");
      addNewMessage('ai', "Done! and I will update the step to step1");
    } else {
      //获取current_step中的数字
      const stepNumber = current_step.match(/\d+/); // 使用正则表达式提取数字
      if (stepNumber) {
        const nextStep = `step${parseInt(stepNumber[0]) + 1}`;
        updateStep(nextStep); // 更新为下一步
        console.log(`更新到步骤：${nextStep}`);
        addNewMessage('ai', "Done! and I will update the step to " + nextStep);
      } else {
        console.log("当前步骤中没有数字，无法更新步骤");
      }
    }
  }else{
    console.log("本次生成图表失败");
  }
  
  console.log("本次生成图表全部结束");
  

}
import fileDetail from './Left/fileDetail.vue'

const inputRecommendItems = ref([])

const uploadFile = () => {
  console.log('uploadFile')
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
inputRecommendItems.value = chatStore.inputRecommendItems

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


</script>
<template>
  <div class="blockTitle">
    <t-icon name="attach"></t-icon>
    <span>Reference Genome Ver</span>
  </div>
  <t-select width="60%" v-model="refVersion" :options="options" placeholder="请选择" filterable />

  <t-divider />
  <div class="row" style="justify-content: space-between;">
    <div class="blockTitle">
      <t-icon name="app"></t-icon>
      <span>Data Store</span>
    </div>
    <t-button @click="uploadFile" size="small">
      <template #icon>
        <t-icon name="upload" />
      </template>
      upload</t-button>
  </div>
  <div id="dataStore" class="radius20">
    <t-menu width="15%">
      <t-menu-item v-for="i in 8" :value="i">
        <template #icon>
          <t-icon name="file" />
        </template>
        file{{ i }}
      </t-menu-item>
    </t-menu>
    <fileDetail style="width: 85%;" />
  </div>
  <t-divider />
  <div class="blockTitle">
    <t-icon name="chat-bubble-smile"></t-icon>
    <span>Chat with GPT4o</span>
  </div>

  <div id="chat" class="radius20">
    <div id="messages">
      <div v-for="(msg, index) in messages" :key="index"
        :class="['message', msg.role === 'ai' ? 'ai-message' : 'user-message']">
        <div class="bubble">{{ msg.content }}</div>
      </div>
    </div>

    <div id="inputPanel">
      <div class="row">
        <t-input v-model="inputText" @enter="sendMessage"></t-input>
        <t-button @click="sendMessage">
          send
        </t-button>
      </div>
      <div id="inputRecommend">
        <div class="inputRecommendItems" v-for="item in inputRecommendItems" :key="item.id">
          {{ item }} <t-icon name="enter" />
        </div>
      </div>
    </div>
  </div>


</template>
<style scoped lang="scss">
#inputRecommend {
  margin-top: .5rem;

  .inputRecommendItems {
    font-size: .7rem;
    background-color: var(--td-brand-color-7);
    padding: .2rem .6rem;
    border-radius: 40px;
    width: fit-content;
    color: white;
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

#chat {
  background-color: rgb(255, 255, 255);
  height: 36vh;
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
  border: 1px solid #ddd;
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
  background-color: #f0f0f0;
  color: #000;
  max-width: 90%; // 修改为90%
}

.user-message .bubble {
  background-color: #007AFF;
  color: white;
}
</style>