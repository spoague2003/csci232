<script setup>
import Login from '@/components/Login.vue';
import Messenger from './components/Messenger.vue';
import './main.css';
</script>

<template>
  <div class="app">
    <Login />
    <Messenger />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;

  background: linear-gradient(135deg, #4273A1 0%, #31465C 100%);
}
</style>
