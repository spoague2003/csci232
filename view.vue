<script setup>
import { ref, onMounted } from 'vue';
import grid from './grid.vue';

const pieces = [
    { id: 1, name: 'A', x: 0, y: 0 },
    { id: 2, name: 'B', x: 3, y: 0 },
    { id: 3, name: 'C', x: 5, y: 0 },
    { id: 4, name: 'D', x: 0, y: 2 },
    { id: 5, name: 'E', x: 1, y: 2 },
    { id: 6, name: 'F', x: 3, y: 2 },
    { id: 7, name: 'G', x: 0, y: 5 },
];


const slots = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const slotMap = ref({
    a: pieces[0],
    b: pieces[1],
    c: pieces[2],
    d: pieces[3],
    e: pieces[4],
    f: pieces[5],
    g: pieces[6],
});

function scramble() {
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    slots.forEach((slot, index) => {
        slotMap.value[slot] = shuffled[index];
    });
}

function identify() {
    slots.forEach((slot, index) => {
        slotMap.value[slot] = pieces[index];
    });
}

onMounted(() => {
    scramble();
});

</script>

<template>
    <div class="content">
        <div class="grid">
            <grid>
                <template v-for="(piece, slotName) in slotMap" :key="piece.id" v-slot:[slotName]>
                    <div class="piece" :style="{
                        backgroundPosition: `calc(-${piece.x} * (80vmin / 7)) calc(-${piece.y} * (80vmin / 7))`
                    }">
                        <div class="overlay">{{ piece.name }}</div>
                    </div>

                </template>
            </grid>
        </div>

        <div class="buttons">
            <button @click="scramble" class="button">Scramble</button>
            <button @click="identify" class="button">Identify</button>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    padding: 10px;

    background-color: cadetblue;
    border: 3px solid black;
}

.piece {
    width: 100%;
    height: 100%;

    background-image: url(/ZLB.webp);
    background-repeat: no-repeat;
    background-size: 80vmin 80vmin;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;

    margin-top: 20px;
    padding: 5px;

    border: 3px solid black;
}

.button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;

    border: 2px solid black;
    border-radius: 5px;
    background-color: lightblue;
}

.button:hover {
    background-color: deepskyblue;
}

.button:active {
    background-color: dodgerblue;
    color: white;
    transform: scale(0.95);
}

.grid {
    border: 3px solid black;
    background-color: lightgray;
    padding: 5px;
}
</style>