<template>
  <div class="counter-container">
    <h2>🍍 Pinia Plugin Logger Demo</h2>
    
    <!-- 카운터 섹션 -->
    <section class="section">
      <h3>기본 카운터</h3>
      <p class="count-display">Count: <strong>{{ counter.count }}</strong></p>
      <div class="button-group">
        <button @click="counter.increment" class="btn btn-primary">+1</button>
        <button @click="counter.decrement" class="btn btn-danger">-1</button>
        <button @click="counter.incrementBy(5)" class="btn btn-success">+5</button>
      </div>
    </section>

    <!-- 비동기 액션 테스트 -->
    <section class="section">
      <h3>비동기 액션 (실행 시간 확인)</h3>
      <button 
        @click="handleAsyncIncrement" 
        :disabled="loading"
        class="btn btn-info"
      >
        {{ loading ? '실행 중...' : '비동기 +1 (1초 대기)' }}
      </button>
    </section>

    <!-- 중첩 객체 변경 테스트 -->
    <section class="section">
      <h3>중첩 객체 변경 (Deep Clone 테스트)</h3>
      <div class="user-info">
        <p>이름: <strong>{{ counter.user.name }}</strong></p>
        <p>나이: <strong>{{ counter.user.age }}</strong></p>
        <p>테마: <strong>{{ counter.user.preferences.theme }}</strong></p>
        <p>알림: <strong>{{ counter.user.preferences.notifications ? '켜짐' : '꺼짐' }}</strong></p>
      </div>
      <div class="button-group">
        <button @click="updateUserInfo" class="btn btn-primary">사용자 정보 변경</button>
        <button @click="toggleTheme" class="btn btn-secondary">테마 변경</button>
      </div>
    </section>

    <!-- 에러 테스트 -->
    <section class="section">
      <h3>에러 처리 테스트</h3>
      <button @click="handleError" class="btn btn-danger">에러 발생시키기</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </section>

    <!-- 히스토리 -->
    <section class="section">
      <h3>변경 히스토리</h3>
      <p>{{ counter.history.length > 0 ? counter.history.join(' → ') : '아직 변경 없음' }}</p>
      <button @click="counter.clearHistory" class="btn btn-warning">히스토리 초기화</button>
    </section>

    <!-- 전체 리셋 -->
    <section class="section">
      <button @click="counter.reset" class="btn btn-danger">전체 리셋</button>
    </section>

    <!-- 개발자 안내 -->
    <section class="section info-box">
      <h4>💡 개발자 도구 콘솔을 확인하세요!</h4>
      <ul>
        <li>✅ 상태 변경 시: 녹색 체크</li>
        <li>⚪ 상태 변경 없음: 회색 원</li>
        <li>❌ 에러 발생: 빨간색 X</li>
        <li>⏱️ 실행 시간 표시</li>
        <li>🔍 Deep Clone으로 중첩 객체 추적</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
const loading = ref(false);
const errorMessage = ref('');

// 비동기 액션 처리
const handleAsyncIncrement = async () => {
  loading.value = true;
  try {
    await counter.incrementAsync();
  } finally {
    loading.value = false;
  }
};

// 사용자 정보 업데이트
const updateUserInfo = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomAge = Math.floor(Math.random() * 50) + 20;
  counter.updateUser(randomName, randomAge);
};

// 테마 토글
const toggleTheme = () => {
  const newTheme = counter.user.preferences.theme === 'light' ? 'dark' : 'light';
  counter.updatePreferences(newTheme, counter.user.preferences.notifications);
};

// 에러 처리
const handleError = () => {
  errorMessage.value = '';
  try {
    counter.incrementWithError();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '알 수 없는 에러';
  }
};
</script>

<style scoped>
.counter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h2 {
  text-align: center;
  color: #42b883;
  margin-bottom: 30px;
}

.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 15px;
}

.count-display {
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
}

.count-display strong {
  color: #42b883;
  font-size: 32px;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #42b883;
  color: white;
}

.btn-danger {
  background-color: #ed4981;
  color: white;
}

.btn-success {
  background-color: #4caf50;
  color: white;
}

.btn-info {
  background-color: #69B7FF;
  color: white;
}

.btn-warning {
  background-color: #ff9800;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.user-info {
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.user-info p {
  margin: 8px 0;
  font-size: 16px;
}

.error-message {
  color: #ed4981;
  background: #ffe0e9;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  font-weight: 500;
}

.info-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.info-box h4 {
  margin-top: 0;
  font-size: 18px;
}

.info-box ul {
  margin: 10px 0;
  padding-left: 20px;
}

.info-box li {
  margin: 8px 0;
  font-size: 14px;
}
</style>
