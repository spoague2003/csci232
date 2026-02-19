<script setup>
import { useMessageStore } from '@/pinia/MessageStore';
import { onMounted } from 'vue';

const messageStore = useMessageStore();

function login(user) {
    messageStore.login(user.username);
}

function logout() {
    messageStore.logout();
}

function refresh() {
    window.location.reload();
}

onMounted(() => {
    messageStore.logout();
});
</script>

<template>
    <div class="login">
        <h1>Login</h1>
        <button class="buttons" v-for="user in messageStore.users" :key="user.username"
            @click="login(user); refresh();">
            Login as {{ user.firstName }} {{ user.lastName }}
        </button>
        <button class="buttons" @click="logout(); refresh();">Logout</button>
    </div>
</template>

<style scoped>
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    width: 40vh;

    background-color: #00254F;
    border: 3px solid white;
    border-radius: 10px;

    font-family: Arial, sans-serif;
}

.buttons {
    padding: 10px 20px;
    margin: 10px;
    font-size: 16px;
    cursor: pointer;

    background-color: #0b93f6;
    border: 3px solid white;
    border-radius: 18px;
    color: white;
}

h1 {
    color: white;
    margin-bottom: 20px;
}
</style>