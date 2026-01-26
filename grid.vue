<script setup>

</script>

<template>
    <div class="grid">
        <div class="seg a"><slot name='a'></slot></div>
        <div class="seg b"><slot name='b'></slot></div>
        <div class="seg c"><slot name='c'></slot></div>
        <div class="seg d"><slot name='d'></slot></div>
        <div class="seg e"><slot name='e'></slot></div>
        <div class="seg f"><slot name='f'></slot></div>
        <div class="seg g"><slot name='g'></slot></div>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);

    width: 80vmin;
    aspect-ratio: 1 / 1;

    gap: 0px;

    --cell: calc(80vmin / 7);
}

.seg {
    outline : 1px solid #000;
    position: relative;
}

.a {
  grid-column: 1 / 4;
  grid-row: 1 / 3;
}

.b {
  grid-column: 4 / 6;
  grid-row: 1 / 4;
}

.c {
  grid-column: 6 / 8;
  grid-row: 1 / 3;
}

.d {
  grid-column: 1 / 2;
  grid-row: 3 / 6;
}

.e {
  grid-column: 2 / 4;
  grid-row: 3 / 6;
}

.f {
  grid-column: 4 / 8;
  grid-row: 3 / 6;
}

.g {
  grid-column: 1 / 8;
  grid-row: 6 / 8;
}

</style>