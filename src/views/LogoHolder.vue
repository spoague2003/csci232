<script setup>

</script>
<template>
    <div class="container">
        <div class="logo">
            <h2 class="name"><b class="tongue">:P</b>laceholder</h2>
        </div>
        <h3 class="tagline">A Place you can call your own</h3>
    </div>
</template>
<style scoped>
.container {
    display: block;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.logo {
    background-image: linear-gradient(to bottom right, var(--secondary-blue), var(--background) 70%);
    border-left: 6px solid var(--secondary-blue);
    border-top: 3px solid var(--secondary-blue);
    border-radius: 40px 40px 40px 0;
    padding: 10px 20px;
    width: max-content;
    text-align: center;
    overflow: visible;
}

.name {
    font-size: 48px;
    background: linear-gradient(to right, var(--primary-blue), var(--primary-green));

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    overflow: visible;
}

.tongue {
    font-weight: bold;
    font-size: 100px;
}

.tagline {
    color: var(--primary-green);
}
</style>