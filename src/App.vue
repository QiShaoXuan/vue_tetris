<template>
  <div id="app" :style="{transform:'scale('+scale+')'}">
    <div class="box">
      <Panel/>
      <BtnGroup/>
    </div>
  </div>
</template>

<script>
  import Panel from './components/Panel'
  import BtnGroup from './components/BtnGroup'

  export default {
    name: 'App',
    data () {
      return {
        scale: 1
      }
    },
    components: {
      Panel,
      BtnGroup
    },
    mounted(){
//      let windowHeight = document.body.clientHeight
//      let minHeight = 780
//      if (windowHeight < minHeight) {
//        this.scale = windowHeight / minHeight
//      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/reset.scss";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 14px;
    height: 100%;
  }

  .box {
    // max-height:800px;
    height: 100%;
    width: 450px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: inset 0 0 10px #fff;
    background: rgb(244, 181, 56);
    border-radius: 20px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  body {
    height: 100%;
    background: #303841;
  }

  @media (min-width: 800px) {
      .box {
        height:800px;
      }
   }
</style>
