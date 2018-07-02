<style scoped lang="scss">
  .panel {
    width: 360px;
    height: 428px;
    margin: 0 auto;
    background: #9ead86;
    padding: 8px;
    border: 2px solid #494536;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
  }
  .panel-outer{
    background: rgb(124,85,83);
    border-radius: 20px;
    /*border-bottom-right-radius: 100px;*/
    /*border-top-left-radius: 100px;*/
    padding:15px 0 ;
    width:410px;
    /*transform: scale(.9);*/
    transform-origin: center top;
  }
</style>

<template>
  <div class="panel-outer">
    <div class="panel">
      <Tetris/>
      <Score/>
    </div>
  </div>

</template>

<script>
  import Tetris from './Tetris'
  import Score from './Score'
  export default {
    name: 'Panel',
    data () {
      return {}
    },
    components: {
      Tetris,
      Score
    }
  }
</script>


