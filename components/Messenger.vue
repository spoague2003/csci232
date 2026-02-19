<script setup>
import { useMessageStore } from '@/pinia/MessageStore';
import { ref, onMounted } from 'vue';

import Message from '@/models/Message';

const messageStore = useMessageStore();

function redactMessage(index, msg) {
    if (msg.username !== messageStore.currentUser) return;

    if (!msg.isRedacted) {
        messageStore.redact(messageStore.currentUser, index);
    } else {
        messageStore.unredact(messageStore.currentUser, index);
    }
}

const newMessage = ref('');

function sendMessage() {
    if (newMessage.value.trim() === '') return;

    const user = messageStore.users.find(
        u => u.username === messageStore.currentUser
    );

    const msg = new Message(
        messageStore.currentUser,
        user.firstName,
        user.lastName,
        newMessage.value
    );

    messageStore.addMessage(msg);
    newMessage.value = '';
}
</script>

<template>
    <section class="messenger" v-show="messageStore.isLoggedIn">
        <div class="messages">
            <div class="message-row" v-for="(msg, index) in messageStore.messages" :key="index"
                :class="msg.username === messageStore.currentUser ? 'me' : 'them'">

                <div class="bubble">
                    <div class="name">{{ msg.firstName }}</div>
                    <div class="text" @contextmenu.prevent="redactMessage(index, msg)">{{ msg.message }}</div>
                </div>
            </div>
        </div>
        <div class="text-input">
            <input type="text" v-model="newMessage" @keyup.enter="sendMessage()"
                placeholder="Type your message here..." />
            <button @click="sendMessage()">Send</button>
        </div>
    </section>
</template>

<style scoped>
.messenger {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 15px;
    height: 60vh;
    overflow-y: auto;

    background-color: #00254F;
    border: 3px solid white;
    border-radius: 10px;

    overflow: hidden;
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

    border-top: 2px solid white;
    background-color: #00254F;
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