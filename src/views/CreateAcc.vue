<script setup>
import { useMessengerStore } from '@/stores/messengerStore.js';
import { onMounted, ref, toRaw } from 'vue';

const messengerStore = useMessengerStore();

const user = ref({})

function createAccount() {
    const newUser = toRaw(user.value)
    messengerStore.createAccount(newUser)
    user.value = {}
}

onMounted(() => {
    if (messengerStore.isLoggedIn) {
        messengerStore.username = ''
        messengerStore.password = ''
    }
})

</script>

<template>
    <div class="login-view" :class="{ centered: messengerStore.allValid }">
        <div class="login-form">
            <h1>Let's Begin!</h1>
            <h3>Create your account</h3>

            <div class="form-item">
                <label for="username">Username</label>
                <input id="username" v-model="user.username" type="text" />
            </div>

            <div class="form-item">
                <div class="password-header">
                    <label for="password">Password</label>

                    <label class="switch">
                        <input type="checkbox" v-model="messengerStore.showPassword">
                        <span class="slider"></span>
                    </label>
                </div>
                <input v-model="user.password" :type="messengerStore.showPassword ? 'text' : 'password'" />
            </div>

            <div class="form-item">
                <label for="firstName">First Name</label>
                <input id="firstName" v-model="user.firstName">
            </div>

            <div class="form-item">
                <label for="lastName">Last Name</label>
                <input id="lastName" v-model="user.lastName">
            </div>

            <div class="form-item">
                <label for="email">Email</label>
                <input id="email" v-model="user.email">
            </div>

            <button class="login-button" type="button" :disabled="!user.username || !user.password
                || !user.firstName || !user.lastName || !user.email" @click="createAccount()">Create
                Account</button>
        </div>
        <div v-if="messengerStore.createErrors.length" class="requirements">
            <ul>
                <li v-for="err in messengerStore.createErrors" :key="err">
                    {{ err }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
h1 {
    margin: 0;
}

h3 {
    text-align: center;
}

.login-view {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    transition: all 0.4s linear;
}

.login-view.centered {
    transform: translateX(20px);
}

.login-form {
    background-color: var(--secondary-blue);
    color: var(--text-dark);
    box-sizing: border-box;
    border-radius: 5px;
    padding: 20px;
    font-size: small;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 200px;
}

.form-item {
    box-sizing: border-box;
    width: 160px;
}

.form-item label {
    display: inline-block;
    margin-bottom: 5px;
}

.login-button {
    font-size: medium;
    color: var(--text-light);
    background-color: var(--primary-green);
    border-radius: 999px;
    padding: 5px 10px;
    border: 0;
}

.login-button:active {
    transform: scale(97%);
}

.requirements {
    font-size: small;
    box-sizing: border-box;
    font-size: 12px;
}

.requirements li {
    color: gray;
}

.requirements ul {
    margin: 0;
    padding-left: 20px;
    margin-bottom: 10px;
}

.password-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* switch container */
.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

/* hide default checkbox */
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* slider background */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 34px;
    transition: background-color 0.25s ease;
}

/* circle */
.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    transition: transform 0.25s ease;
}

/* when checked */
.switch input:checked+.slider {
    background-color: #007AFF;
    /* Apple blue */
}

.switch input:checked+.slider:before {
    transform: translateX(20px);
}
</style>