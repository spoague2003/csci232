<script setup>
import { useMessengerStore } from '@/stores/messengerStore';
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

const messageStore = useMessengerStore();
const newMessage = ref('');
const messagesContainer = ref(null)
let messageInterval = null

function handleSend() {
    messageStore.sendMessage(newMessage.value)
    newMessage.value = ''
}

function startPolling() {
    stopPolling()
    messageInterval = setInterval(() => {
        if (messageStore.activeChat) {
            console.log('refetching messages')
            messageStore.getMessages()
        }
    }, 5000)
}

function stopPolling() {
    if (messageInterval) {
        clearInterval(messageInterval)
        messageInterval = null
    }
}

onMounted(() => startPolling())
onUnmounted(() => stopPolling())


watch(() => messageStore.activeChat, () => startPolling())

function getSenderName(senderId) {
    if (senderId === messageStore.user?._id) return 'You'

    const member = messageStore.activeChat?.users?.find(
        u => u.user_id === senderId
    )

    return member?.username || 'Unknown'
}

watch(() => messageStore.currentMessages, async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}, { deep: true })
</script>

<template>
    <section class="messenger">
        <h2 class="chat-head" v-if="messageStore.activeChat">
            {{ messageStore.activeChat.group_name }}
        </h2>
        <h2 class="chat-head" v-else>Select a Friend to chat with</h2>
        <div class="messages" ref="messagesContainer">
            <div class="message-row" v-for="(msg, index) in messageStore.currentMessages" :key="index" :class="{
                me: msg.sender === messageStore.user?._id,
                them: msg.sender !== messageStore.user?._id
            }">
                <div class="bubble">
                    <div class="name">{{ getSenderName(msg.sender) }}</div>
                    <div class="text">{{ msg.content }}</div>
                </div>
            </div>
        </div>
        <div v-if="messageStore.activeChat" class="text-input">
            <input type="text" v-model="newMessage" placeholder="Type your message here..." />
            <button @click="handleSend">Send</button>
        </div>
    </section>
</template>

<style scoped>
.messenger {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 15px;
    height: 100%;
    width: 100%;
    overflow-y: auto;

    background-color: var(--primary-blue);
    border-radius: 10px;

    overflow: hidden;
}

.chat-head {
    text-align: center;
    color: var(--text-light);
}

.messages {
    display: flex;
    flex: 1;
    flex-direction: column;

    padding: 15px;
    gap: 8px;

    overflow-y: auto;
}

.text-input {
    display: flex;

    gap: 8px;
    padding: 10px;

    border-top: 2px solid var(--secondary-green);
    background-color: var(--primary-blue);
}

.text-input input {
    flex: 1;

    padding: 10px;

    border-radius: 18px;
    border: none;
    outline: none;
}

.text-input button {
    padding: 10px 16px;

    border-radius: 18px;
    border: none;
    background-color: #0b93f6;
    color: white;
    cursor: pointer;
}

.message-row {
    display: flex;
    min-width: 20vw;
    width: 100%;
}

.message-row.me {
    justify-content: flex-end;
}

.message-row.them {
    justify-content: flex-start;
}

.bubble {
    max-width: 60%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.4;
    word-wrap: break-word;
}

.message-row.me .bubble {
    background-color: #0b93f6;
    color: white;
    border-bottom-right-radius: 4px;
}

.message-row.them .bubble {
    background-color: #ffffff;
    color: black;
    border-bottom-left-radius: 4px;
}

.name {
    font-size: 11px;
    margin-bottom: 2px;
}

.text {
    white-space: pre-wrap;
}
</style>