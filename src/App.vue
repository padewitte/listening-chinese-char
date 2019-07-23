<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>



<style>
* {
  margin: 0;
  padding: 0;
  color: #fdfdfe;
}

body {
  position: fixed;
  background-color: #FFFFFF;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

}

#app {
  position: absolute;
  height: 100%;
  width: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;

}

</style>
