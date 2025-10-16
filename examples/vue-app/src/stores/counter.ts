import { defineStore } from "pinia";

interface User {
  name: string;
  age: number;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    history: [] as number[],
    user: {
      name: "Guest",
      age: 0,
      preferences: {
        theme: "light",
        notifications: true,
      },
    } as User,
  }),
  actions: {
    // 기본 액션
    increment() {
      this.count++;
      this.history.push(this.count);
    },
    decrement() {
      this.count--;
      this.history.push(this.count);
    },
    incrementBy(amount: number) {
      this.count += amount;
      this.history.push(this.count);
    },
    
    // 중첩된 객체 변경 테스트
    updateUser(name: string, age: number) {
      this.user.name = name;
      this.user.age = age;
    },
    
    // 깊은 객체 변경 테스트
    updatePreferences(theme: string, notifications: boolean) {
      this.user.preferences.theme = theme;
      this.user.preferences.notifications = notifications;
    },
    
    // 비동기 액션 테스트
    async incrementAsync() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.count++;
      this.history.push(this.count);
    },
    
    // 에러 발생 액션 테스트
    incrementWithError() {
      throw new Error("의도적인 에러 발생!");
    },
    
    // 히스토리 초기화
    clearHistory() {
      this.history = [];
    },
    
    // 전체 리셋
    reset() {
      this.count = 0;
      this.history = [];
      this.user = {
        name: "Guest",
        age: 0,
        preferences: {
          theme: "light",
          notifications: true,
        },
      };
    },
  },
});
