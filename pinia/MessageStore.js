import initialMessageSet from '../data/Messages.js';
import Message from '../models/Message.js';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useMessageStore = defineStore('messageStore', () => {
    const messages = ref(initialMessageSet);

    function addMessage(message) {
        if (message instanceof Message) {
            messages.value.push(message);
        } else {
            console.error('Invalid message object');
        }
    }

    function redact(currentUser, index) {
        const message = messages.value[index];

        if (message.username === currentUser && !message.isRedacted) {
            message.message = '[REDACTED]';
            message.isRedacted = true;
        } else {
            console.error('Unauthorized redact attempt or message already redacted');
        }
    }

    function unredact(currentUser, index) {
        const message = messages.value[index];

        if (message.username === currentUser && message.isRedacted) {
            message.message = message.originalMessage;
            message.isRedacted = false;
        } else {
            console.error('Unauthorized unredact attempt');
        }
    }

    const users = computed(() => {
       const map = new Map();
       messages.value.forEach(msg => {
           if (!map.has(msg.username)) {
               map.set(msg.username, { firstName: msg.firstName, lastName: msg.lastName, username: msg.username });
           }
       });

       return Array.from(map.values());
    });

    const currentUser = computed(() => {
        return localStorage.getItem('username');
    });

    function login(username) {
        localStorage.setItem('username', username);
        currentUser.value = username
    };

    function logout() {
        localStorage.removeItem('username');
        currentUser.value = null
    };

    const isLoggedIn = computed(() => currentUser.value !== null);
    
    return { messages, addMessage, redact, unredact, users, currentUser,
        login, logout, isLoggedIn
    };
});