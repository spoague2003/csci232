<script setup>
import { useMessengerStore } from '@/stores/messengerStore.js';
import { onMounted } from 'vue';

const messengerStore = useMessengerStore();

onMounted(() => {
    if (messengerStore.isLoggedIn) {
        messengerStore.username = ''
        messengerStore.password = ''
    }
})

</script>

<template>
    <div class="login-view">
        <p v-if="messengerStore.createSuccess" class="success">
            Account created successfully. Please sign in.
        </p>
        <div class="login-form">
            <h1>Welcome Back!</h1>
            <h3>Enter your credentials</h3>

            <div class="form-item">
                <label for="username">Username</label>
                <input v-model="messengerStore.username" type="text" />
            </div>

            <div class="form-item">
                <div class="password-header">
                    <label for="password">Password</label>

                    <label class="switch">
                        <input type="checkbox" v-model="messengerStore.showPassword">
                        <span class="slider"></span>
                    </label>
                </div>
                <input v-model="messengerStore.password" :type="messengerStore.showPassword ? 'text' : 'password'" />
            </div>

            <span v-if="messengerStore.loginError">Invalid username or password.</span>

            <button class="login-button" type="button" :disabled="!messengerStore.username || !messengerStore.password"
                @click="messengerStore.login(messengerStore.username, messengerStore.password)">Sign In</button>
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

.success {
    max-width: 200px;

    background-color: var(--secondary-blue);
    padding: 10px;
    border-radius: 3px;
}

.login-view {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
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
    color: var(--primary-green);
    font-size: small;
    box-sizing: border-box;
    font-size: 12px;
}

.requirements span {
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
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