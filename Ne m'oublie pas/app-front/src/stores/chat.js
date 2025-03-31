import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isLoading = ref(false)

  const addMessage = (message, isUser = true) => {
    messages.value.push({
      id: Date.now(),
      content: message,
      isUser,
      timestamp: new Date().toISOString()
    })
  }

  const generateResponse = async (userMessage) => {
    isLoading.value = true
    addMessage(userMessage, true)
    
    try {
      // Simuler un appel API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1500))
      addMessage("Je suis un agent AI simulé. Je peux vous aider avec vos questions.", false)
    } finally {
      isLoading.value = false
    }
  }

  return {
    messages,
    isLoading,
    addMessage,
    generateResponse
  }
}) 