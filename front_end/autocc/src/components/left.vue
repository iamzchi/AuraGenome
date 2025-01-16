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

import { ref } from 'vue';
const refVersion = ref('');

const messages = ref([
  {
    role: 'ai',
    content: '你好!我是AI助手,很高兴为您服务。'
  },
  {
    role: 'user',
    content: '请问你能帮我分析一下基因组数据吗?'
  },
  {
    role: 'ai',
    content: '当然可以,请问您想分析哪个物种的基因组数据呢?'
  }
]);
const inputText = ref(''); // 新增输入框绑定值

const sendMessage = () => {
  if (!inputText.value.trim()) return;

  messages.value.push({
    role: 'user',
    content: inputText.value
  });

  inputText.value = ''; // 清空输入框
};
import fileDetail from './fileDetail.vue'
</script>
<template>
  <div class="blockTitle">Reference Genome Ver</div>
  <t-select width="60%" v-model="refVersion" :options="options" placeholder="请选择" filterable />

  <t-divider />
  <div class="row" style="justify-content: space-between;">
    <div class="blockTitle">Data Store</div>
    <t-button size="small">
      <template #icon>
        <t-icon name="upload" />
      </template>
      upload</t-button>
  </div>
  <div id="dataStore" class="radius20">
    <t-menu width="30%">
      <t-menu-item v-for="i in 10" :value="i">
        <template #icon>
          <t-icon name="file" />
        </template>
        file{{ i }}
      </t-menu-item>
    </t-menu>
    <fileDetail style="width: 70%;"/>
  </div>
  <t-divider />
  <div class="blockTitle">Chat with GPT4o</div>

  <div id="chat" class="radius20">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index"
        :class="['message', msg.role === 'ai' ? 'ai-message' : 'user-message']">
        <div class="bubble">{{ msg.content }}</div>
      </div>
    </div>

    <div id="inputPanel">
      <div class="row">
        <t-input v-model="inputText"></t-input>
        <t-button @click="sendMessage">send</t-button>
      </div>
    </div>
  </div>


</template>
<style scoped lang="scss">
#chat {
  background-color: palevioletred;
  height: 40vh;
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
  height: 40vh;
  padding: 10px;
  display: flex;
  flex-direction: row;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
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