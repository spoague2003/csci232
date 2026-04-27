<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMessengerStore } from '@/stores/messengerStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const messengerStore = useMessengerStore()
const router = useRouter()
const targetUsername = ref('')
const groupName = ref('')
const { user } = storeToRefs(messengerStore)

function sendRequest() {
    messengerStore.sendFriendRequest(targetUsername.value)
    targetUsername.value = ''
    console.log('button clicked')
}

function createChat() {
    messengerStore.createChat(groupName.value)
    groupName.value = ''
}

function openChat(chat) {
    messengerStore.setActiveChat(chat)
    router.push('/home/chat-info')
}

const friendRequests = computed(() =>
    (messengerStore.user?.requests || []).filter(r => r.kind === 'FriendRequest')
)

const chatInvites = computed(() =>
    (messengerStore.user?.requests || []).filter(r => r.kind === 'ChatInvite')
)

onMounted(() => {
    messengerStore.loadCurrentUser()
})

onMounted(async () => {
    console.log('getting profile inside view')
    user.value = await messengerStore.getProfile()
    await messengerStore.getFriendRequests()
})

onMounted(async () => {
    console.log('getting chat info')
    await messengerStore.loadChats()
})

</script>
<template>
    <div class="main-content">
        <div class="sidebar">
            <h2>Friends</h2>
            <span class="none" v-if="messengerStore.user?.friends.length === 0">You have no friends</span>
            <div class="friends">
                <div class="friend-list" v-for="friend in messengerStore.user?.friends || []" :key="friend">
                    <button class="user-button">{{ friend.username }}</button>
                    <button class="remove" @click="messengerStore.removeFriend(friend)">Remove</button>
                </div>
            </div>

            <h2>Chats</h2>
            <div class="chats">
                <div class="chat-list" v-for="chat in messengerStore.chats" :key="chat">
                    <button class="chat-button" @click="openChat(chat)">{{ chat.group_name
                        }}</button>
                </div>
            </div>

            <h2>Friend Requests</h2>
            <div class="friend-requests">
                <span class="none" v-if="friendRequests.length === 0">No friend requests</span>
                <div class="request-list" v-for="request in friendRequests" :key="request._id">
                    <button class="user-button">{{ request.sender.username }}</button>
                    <button class="answer-yes" @click="messengerStore.acceptFriendRequest(request, 1)">✅</button>
                    <button class="answer-no" @click="messengerStore.acceptFriendRequest(request, 0)">❌</button>
                </div>
            </div>

            <h2>Chat Invites</h2>
            <div class="chat-invites">
                <span class="none" v-if="chatInvites.length === 0">No chat invites</span>
                <div class="request-list" v-for="invite in chatInvites" :key="invite._id">
                    <button class="user-button">{{ invite.sender.username }} → {{ invite.chat.name }}</button>
                    <button class="answer-yes" @click="messengerStore.acceptChatInvite(invite, 1)">✅</button>
                    <button class="answer-no" @click="messengerStore.acceptChatInvite(invite, 0)">❌</button>
                </div>
            </div>

            <h2 class="add-friend">Add Friends</h2>
            <input type="text" v-model="targetUsername" placeholder="Search friend's username">
            <button class="send-button" @click="sendRequest">
                Send Friend Request
            </button>

            <h2>Create Chat</h2>
            <input type="text" v-model="groupName" placeholder="Create a chat">
            <button class="send-button" @click="createChat">
                Create Chat
            </button>
        </div>
        <div class="main-view">
            <RouterView />
        </div>
    </div>
</template>
<style scoped>
* {
    box-sizing: border-box;
}

h2 {
    color: var(--text-light);
}

.none {
    color: var(--text-light);
    font-size: small;
}

.add-friend {
    margin-top: 50px;
}

.main-content {
    display: flex;
    flex-direction: row;
    gap: 20px;

    height: 90vh;
    aspect-ratio: 1/1;

    border: 3px solid var(--secondary-green);
    background-color: var(--secondary-blue);
    overflow: hidden;
}

.sidebar {
    display: flex;
    flex-direction: column;
    width: 260px;
    padding: 10px;

    border-radius: 5px;

    height: 100%;
    overflow-y: auto;

    background-color: var(--primary-blue);
}

.main-view {
    display: flex;
    flex: 1;

    height: 100%;
    overflow: hidden;
}

.friend-list {
    display: flex;
    margin-bottom: 5px;
}

.user-button {
    margin-right: 10px;
}

.user-button,
.send-button,
.chat-button {
    font-size: small;
    color: var(--text-light);
    background-color: var(--primary-green);
    border-radius: 999px;
    padding: 5px 10px;
    border: 0;
    gap: 5px;
}


.remove,
.answer-no {
    border-radius: 999px;
    border: none;
    font-size: small;
    padding: 5px 10px;
    color: var(--text-light);
}

.answer-yes {
    border-radius: 999px;
    border: none;
    font-size: small;
    padding: 5px 10px;
    margin-right: 5px;
    background-color: var(--primary-green);
}

.user-button:active {
    transform: scale(97%);
}


.send-button:active {
    transform: scale(97%);
}
</style>