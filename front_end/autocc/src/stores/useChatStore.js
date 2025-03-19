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
    { role: 'user', content: 'change the scatter track of the Synonymous Substitution to purple.'  },
    { role: 'ai', content: 'No problem! ' },
    { role: 'ai', content: 'I have turned track7 purple. anything else?' },
    { role: 'user', content: 'nice but I want the width of Track5 to be enlarged a bit, and Track4 to be reduced a bit.' },
    { role: 'ai', content: 'Done! Is this what you want? If not, you can click the track for finer adjustment.' },
    // { role: 'user', content: 'using file2.csv to generate a dark-green bar chart, and use the "Insertion" type column and Validation column should not be empty.' },
  ])

  const inputRecommendItems = ref([
    'What can you do?',
    'Save as png and download',
    'Modify the axes of Track9'
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
