<script setup>
import { useMessengerStore } from '@/stores/messengerStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue'

async function handleInvite(username) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    const searchResponse = await fetch(
        `${host}/users?search=${encodeURIComponent(username.trim())}&limit=10&skip=0`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )

    if (!searchResponse.ok) {
        alert('User search failed')
        return
    }

    const result = await searchResponse.json()
    const targetUser = result.users[0]

    if (!targetUser) {
        alert('User not found')
        return
    }

    messengerStore.invitetoChat(targetUser._id)
    invitee.value = ''
}

async function handleLeave() {
    await messengerStore.leaveChat(messengerStore.activeChat)
    router.push('/home')
}

const messengerStore = useMessengerStore()
const router = useRouter()
const invitee = ref('')
</script>
<template>
    <div class="profile">
        <h1>{{ messengerStore.activeChat.group_name }}</h1>
        <div class="member-list">
            <span>Members:&nbsp;</span>
            <span v-for="member in messengerStore.activeChat.users" :key="member">
                {{ member.username }}&nbsp;
            </span>
        </div>
        <br>
        <button class="button" @click="router.go(-1)">Open Chat</button>
        <br>
        <h2>Invite a User</h2>
        <input v-model="invitee" type="text" placeholder="enter invitee username">
        <button class="button" @click="handleInvite(invitee)">Invite to Chat</button>
        <br>
        <button class="leave" @click="handleLeave">Leave</button>
    </div>
</template>
<style scoped>
.profile {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

h1,
h2 {
    color: var(--text-light);
}

.member-list {
    display: flex;
    flex-direction: row;
    color: var(--text-light);
}

.button {
    font-size: medium;
    color: var(--text-light);
    background-color: var(--primary-green);
    border-radius: 999px;
    padding: 5px 10px;
    border: 0;
}

.leave {
    border-radius: 999px;
    border: none;
    font-size: small;
    padding: 5px 10px;
    color: var(--text-light);
}
</style>