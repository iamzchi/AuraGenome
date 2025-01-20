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

const sendMessage = () => {
  if (!inputText.value.trim()) return;
  addNewMessage('user', inputText.value);
  inputText.value = '';
};
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