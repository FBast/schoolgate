<template>
  <div id="app">
    <!-- En-tête global -->
    <header>
      <nav>
        <img src="@/assets/logo.png" alt="Logo ENSI" class="logo">
      </nav>
    </header>

    <!-- Contenu principal rendu par le routeur -->
    <main>
      <router-view />
    </main>

    <!-- Pied de page global -->
    <footer>
      <p>&copy; 2024 École des Nouvelles Images</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
@import "@/styles/main.scss";

/* Style global du projet */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Utiliser toute la hauteur de la page */
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
  flex: 1; /* Le contenu principal prend tout l'espace disponible */
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
