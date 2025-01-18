import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  // 使用 ref 来定义响应式状态
  const messages = ref([
    { role: 'ai', content: "Hi! Let's create cool gene visualization charts together!" },
    { role: 'ai', content: "You can upload your files." },
    { role: 'user', content: '✔ uploaded: file1' },
    { role: 'ai', content: 'I got it!' },
    { role: 'ai', content: "What's your next plan?" },
    { role: 'user', content: 'Please display the gene mutation data in file1 for me with a bar chart.' },
    { role: 'ai', content: 'Here it is!' },
    { role: 'user', content: 'Change the color into Reds' },
    { role: 'ai', content: 'No problem! anything else?' },
  ])

  const inputRecommendItems = ref([
    'What can you do?',
    'add axes',
    'make it more beautiful'
  ])

  // 可以提供一些 actions 来操作这些状态
  const addMessage = (role, content) => {
    
    messages.value.push({ role: role, content: content })
  }

  const updateInputRecommendItems = (newItems) => {
    inputRecommendItems.value = newItems
  }

  return {
    messages,
    inputRecommendItems,
    addMessage,
    updateInputRecommendItems
  }
})
