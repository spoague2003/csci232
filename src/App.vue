<script setup>
import { onMounted } from 'vue';
import { useMessengerStore } from './stores/messengerStore';

const messengerStore = useMessengerStore()

onMounted(async () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    messengerStore.isLoggedIn = true
    messengerStore.user = await messengerStore.getProfile()
  }
})

</script>

<template>
  <div class="app">
    <nav class="navbar">
      <span class="welcome" v-if="messengerStore.isLoggedIn && messengerStore.user">Welcome, {{
        messengerStore.user.username }}!</span>
      <RouterLink v-if="!messengerStore.isLoggedIn" class="link" to="/sign-in">Sign In</RouterLink>
      <RouterLink v-if="!messengerStore.isLoggedIn" class="link" to="/create">Create Account</RouterLink>
      <RouterLink v-if="messengerStore.isLoggedIn" class="link" @click="messengerStore.logout" to="/">Sign Out
      </RouterLink>
      <RouterLink v-if="messengerStore.isLoggedIn" class="link" to="/home/profile">Profile</RouterLink>
      <RouterLink v-if="messengerStore.isLoggedIn" class="link" to="/home">Home</RouterLink>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --primary-blue: #5DADE2;
  --secondary-blue: #85C1E9;
  --primary-green: #58D68D;
  --secondary-green: #A9DFBF;

  --background: #F8F9F9;
  --text-dark: #2F4F4F;
  --text-light: #FDFEFE;
}

.app {
  background-color: var(--background);
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.navbar {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;

  justify-content: flex-end;

  background-color: var(--primary-blue);
}

.welcome {
  margin-right: auto;
  margin-top: 5px;
  justify-content: flex-start;

  color: var(--text-light);
}

.link {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  color: var(--text-light)
}

.router-link-active {
  background-color: var(--background);
  color: var(--text-dark);
  transition: background-color .25s ease-in, color 0s ease-in .25s;
}

.router-link-exact-active {
  background-color: var(--primary-green);
  color: var(--text-dark);
  transition: background-color .25s ease-in, color 0s ease-in .25s;
}

.main-content {
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  padding: 10px;
}
</style>
