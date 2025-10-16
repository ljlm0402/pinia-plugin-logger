<template>
  <main>
    <div class="header">
      <h1>🍍 Pinia Plugin Logger</h1>
      <p class="subtitle">개발자 도구 콘솔을 열어 로그를 확인하세요</p>
    </div>
    <Counter />
  </main>
</template>

<script setup lang="ts">
import Counter from "./components/Counter.vue";
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

main {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
}

.header h1 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 16px;
}
</style>
