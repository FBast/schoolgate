<template>
  <div id="app">
    <header>
      <nav>
        <img src="@/assets/logo.png" alt="Logo ENSI" class="logo">
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>&copy; 2024 École des Nouvelles Images</p>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(!!localStorage.getItem('authToken'));
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem('authToken');
      isAuthenticated.value = false;
      router.push('/login');
    };

    return {
      isAuthenticated,
      logout,
    };
  }
};
</script>

<style scoped>
@import "@/styles/main.scss";

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

header {
  background-color: #e30947;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.logo {
  width: 150px;
}

main {
  flex: 1;
  padding: 20px;
  margin-top: 20px;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px 0;
  width: 100%;
  position: relative;
  bottom: 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
</style>
