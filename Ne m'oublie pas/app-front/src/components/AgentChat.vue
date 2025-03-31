<template>
  <div class="flex flex-col h-full max-w-4xl mx-auto p-4 gap-4">
    <!-- Zone des messages -->
    <div class="flex-1 overflow-y-auto bg-white rounded-xl p-4 shadow-soft">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div :class="[
          'p-4 rounded-xl max-w-[80%]',
          message.isUser ? 'ml-auto bg-primary text-white' : 'bg-gray-100'
        ]">
          {{ message.content }}
        </div>
      </div>
      <div v-if="isLoading" class="flex items-center gap-2 text-gray-500">
        <div class="animate-pulse">Génération en cours</div>
        <div class="animate-bounce">...</div>
      </div>
    </div>

    <!-- Zone de saisie -->
    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input
        v-model="userInput"
        type="text"
        placeholder="Posez votre question..."
        class="input"
        :disabled="isLoading"
      >
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isLoading || !userInput.trim()"
      >
        Envoyer
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()
const userInput = ref('')

const { messages, isLoading } = storeToRefs(chatStore)

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const message = userInput.value
  userInput.value = ''
  await chatStore.generateResponse(message)
}
</script> 