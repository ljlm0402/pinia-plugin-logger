<template>
  <div>
    <h2>Zenon Counter</h2>
    <p>Count: {{ counter.count }}</p>
    <button @click="counter.increment">+1</button>
    <button @click="counter.decrement">-1</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
</script>
