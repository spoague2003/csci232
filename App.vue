<script setup>
import View from './components/view.vue';
import Grid from './components/grid.vue';
</script>

<template>
    <div class="content">
      <View>
          <Grid />
      </View>
    </div>
</template>

<style scoped>

.content {
    height: 100vh;
    width: 90vw;

    align-items: center;
    justify-content: center;
}
</style>
