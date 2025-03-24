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
    {role:'ai',content:'OK, I will generate the chart for you according to the configuration of Proj1, please upload your data.'},
    {role:'user',content:'✔ uploaded: 📄file1,📄file2'},
    {role:'ai',content:"Got it. I noticed that there are multiple discrete values in file1. I've recommended two solutions for you. Is there any one you like?"},
    {role:'user',content:'To display heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation.'},
    {role:'ai',content:'All right! Here it is!'},
    {role:'user',content:'Using file5.csv to generate a blue line chart, plotting Copy number column values against their genomic position.'  },
    {role:'ai',content:'Here it is! I generated a blue line chart to show the changes in copy number. '},
    {role:'user',content:'OK, but add axes to the line chart. A simple light gray color.'  },
    {role:'ai',content:'Done! Is this what you want? If not, you can click the track for finer adjustment.'},
    {role:'user',content:"Not bad, but I can't clearly see the ups and downs of the blue line. It looks like this broken line is quite flat. " },
    {role:'ai',content:"How about we narrow down the Substitution track and expand the line chart track? "},
    {role:'user',content:"Why?"},
    {role:'ai',content:"Because the scatter point distribution isn't very sensitive to height. Do you want me to adjust the chart for you? "},
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
