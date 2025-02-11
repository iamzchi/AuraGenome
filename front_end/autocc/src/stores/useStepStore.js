import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStepStore = defineStore('step', () => {
  const step = ref("root");

  const updateStep = (newStep) => {
    step.value = newStep;
  } 

  return { step, updateStep }
})