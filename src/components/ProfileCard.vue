<script setup>
import { useMessengerStore } from '@/stores/messengerStore';

const messengerStore = useMessengerStore()
</script>
<template>
    <div class="profile">
        <h1>{{ messengerStore.user.username }}</h1>
        <span>Name: {{ messengerStore.user.firstName }} {{ messengerStore.user.lastName }}</span>
        <span>Email: {{ messengerStore.user.email }}</span>
        <div class="friend-list">
            <span>Friends:&nbsp;</span>
            <span v-for="friend in messengerStore.user.friends" :key="friend">
                {{ friend.username }}&nbsp;
            </span>
        </div>
    </div>
</template>
<style scoped>
.profile {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--text-light);
}

.friend-list {
    display: flex;
    flex-direction: row;
}
</style>