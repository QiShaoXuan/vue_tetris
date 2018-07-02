<style scoped lang="scss">
  .score-container {
    font: 16px HanHei SC, PingHei, PingFang SC, STHeitiSC-Light, Helvetica Neue, Helvetica, Arial, sans-serif;
    flex-grow: 1;
    height:100%;
    padding: 0 11px;
    position: relative;
    .title {
      line-height: 47px;
      height: 47px;
      text-align: left;
    }

    .bottom-container{
      width:100%;
      position:absolute;
      left:0;
      bottom:0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:0 11px;
    }

    .score {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      .stop{
        height: 20px;
        width: 18px;
        background: url(../assets/imsges/font.png) no-repeat;
        background-position: -100px -75px;
      }
      .stop.active{
        background-position: -75px -75px;
      }
      .score-item {
        height: 24px;
        width: 14px;
        background: url(../assets/imsges/font.png) no-repeat;
        background-position: -215px -25px;
      }
      .colon{
        background-position: -243px -25px;
      }
      .colon.active{
        background-position: -229px -25px;
      }
      ._0 {
        background-position: -75px -25px;
      }
      ._1 {
        background-position: -89px -25px;
      }
      ._2 {
        background-position: -103px -25px;
      }
      ._3 {
        background-position: -117px -25px;
      }
      ._4 {
        background-position: -131px -25px;
      }
      ._5 {
        background-position: -145px -25px;
      }
      ._6 {
        background-position: -159px -25px;
      }
      ._7 {
        background-position: -173px -25px;
      }
      ._8 {
        background-position: -187px -25px;
      }
      ._9 {
        background-position: -201px -25px;
      }
    }
  }
</style>

<template>
  <div class="score-container">
    <div class="max-score" v-if="!hasStart">
      <p class="title">最高得分</p>
      <div class="score">
        <span v-for="item in maxScore" class="score-item" :class="'_'+item"></span>
      </div>
    </div>
    <div class="score-now" v-if="hasStart">
      <p class="title">得分</p>
      <div class="score">
        <span v-for="item in score" class="score-item" :class="'_'+item"></span>
      </div>
    </div>
    <p class="title">起始行数</p>
    <div class="score">
      <span v-for="item in startLine" class="score-item" :class="'_'+item"></span>
    </div>
    <p class="title">级别</p>
    <div class="score">
      <span v-for="item in level" class="score-item" :class="'_'+item"></span>
    </div>

    <div class="bottom-container">
      <div class="score">
        <span class="stop" :class="{active:stopActive}"></span>
      </div>
      <div class="score">
        <span v-for="item in hour" class="score-item" :class="'_'+item"></span>
        <span class="score-item colon" :class="{active:colonActive}"></span>
        <span v-for="item in minute" class="score-item" :class="'_'+item"></span>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'Score',
    data () {
      return {
        colonActive:true,
        hour:setTime((new Date()).getHours()),
        minute:setTime((new Date()).getMinutes()),
        stopActive:(this.$store.state.isStop && this.$store.state.hasStart),
      }
    },
    computed: {
      ...mapState({
        level: state => setNum(state.level),
        startLine: state => setNum(state.startLine),
        score: state => setNum(state.score),
        maxScore: state => setNum(state.maxScore),
        hasStart:state => state.hasStart,
      })
    },
    mounted(){
      let colonT = setInterval(() => {
        this.colonActive = !this.colonActive
      },1000)
      let timeT = setInterval(() => {
        this.hour = setTime((new Date()).getHours())
        this.minute = setTime((new Date()).getMinutes())
      },6000)
      let stopT = setInterval(() => {
        if(this.$store.state.isStop && this.$store.state.hasStart){
          this.stopActive = !this.stopActive
        }else{
          this.stopActive = false
        }
      },600)
    },
  }
  function setNum(number) {
    let arr = String(number).split('')
    let num = 8 - arr.length
    for (var i = 0; i < num; i++) {
      arr.splice(0, 0, '')
    }
    return arr
  }
  function setTime(time) {
    let arr = String(time).split('')
    if(arr.length === 1){
      arr.splice(0,0,'0')
    }
    return arr
  }
</script>


