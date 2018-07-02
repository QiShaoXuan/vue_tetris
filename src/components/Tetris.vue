<style scoped lang="scss">
  .square-container {
    width: 208px;
    height: 408px;
    background: #9ead86;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    margin: 0 auto;
    border: 2px solid #000;
    padding: 3px 1px 1px 3px;
    .square {
      display: block;
      width: 18px;
      height: 18px;
      padding: 2px;
      border: 2px solid #879372;
      margin: 0 2px 2px 0;
      &::after {
        content: "";
        display: block;
        width: 10px;
        height: 10px;
        background: #879372;
        overflow: hidden;
      }
    }
    .square.active {
      border-color: #000;
      &::after {
        background: #000;
      }
    }
    .square.dissapear {
      border-color: #560000;
      &::after {
        background: #560000;
      }
    }
  }

  .outer {
    position: relative;
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      .rex {
        width: 80px;
        height: 86px;
        margin: 90px auto 0;
        background: url(../assets/imsges/font.png) no-repeat;
      }
      .rex_eye_0 {
        background-position: 0 -100px;
      }
      .rex_eye_1 {
        background-position: -100px -100px;
      }
      .rex_leg_0 {
        background-position: -200px -100px;
      }
      .rex_leg_1 {
        background-position: -300px -100px;
      }
    }
  }
  .note{
    position: relative;
    font: 14px HanHei SC, PingHei, PingFang SC, STHeitiSC-Light, Helvetica Neue, Helvetica, Arial, sans-serif;
    margin-top:10px;
  }
  .title{
    font: 18px HanHei SC, PingHei, PingFang SC, STHeitiSC-Light, Helvetica Neue, Helvetica, Arial, sans-serif;
    margin-top:15px;
    margin-bottom:25px;
  }
  .triangle{
    width: 12px;
    height: 12px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 12px solid #111;
    display: inline-block;
    margin: 0 4px;
  }
  .triangle.down{
    transform: rotate(180deg);
  }
  .triangle.right{
    transform: rotate(90deg);
  }
  .triangle.left{
    transform: rotate(-90deg);
  }
</style>

<template>
  <div class="outer">
    <div class="mask" v-if="false">
      <div class="rex" :class="rexName"></div>
      <p class="title">俄罗斯方块</p>
      <p ><i class="triangle"></i>\<i class="triangle down"></i> | 调整等级</p>
      <p ><i class="triangle left"></i>\<i class="triangle right"></i> | 调整行数</p>
    </div>
    <div class="square-container">
      <div class="square" v-for="(n,index) in rows*cols"
           :class="{active:setActive(index),dissapear:setDissapear(index)}"></div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'Tetris',
    data () {
      return {
        rows: 10,
        cols: 20,
        rexName: 'rex_eye_0',
      }
    },
    computed: {
      ...mapState({
        maskShow: state => state.maskShow,
      })
    },
    methods: {
      setActive(index){
        let x = index % 10
        let y = Math.floor(index / 10)

        let state = this.$store.state

        let check1 = state.moving.render.find(v => (v[0] == x && v[1] == y))
        let check2 = state.pile.find(v => (v[0] == x && v[1] == y))
        let check3 = state.fullLine.includes(y)

        return (check1 || check2 || check3) ? true : false
      },
      setDissapear(index){
        let x = index % 10
        let y = Math.floor(index / 10)
        return this.$store.state.dissapear.find(v => (v[0] == x && v[1] == y))
      },
    },
    mounted(){
      let rex_step = 0
      let rexT = setInterval(() => {
        if (this.maskShow) {
          rex_step += 1
          if (rex_step < 5) {
            this.rexName = `rex_eye_${rex_step % 2}`
          } else {
            if (rex_step <12) {
              this.rexName = `rex_leg_${rex_step % 2}`
            }else{
              if(rex_step == 12){
                this.rexName = `rex_eye_0`
              }
              if(rex_step === 18){
                rex_step = 0
              }
            }

          }
        } else {
          this.rexName = 'rex_eye_0'
          rex_step = 0
        }
      }, 150)
    },

  }
</script>


