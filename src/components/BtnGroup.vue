<style scoped lang="scss">
  .btn-container {
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    position: relative;
  }

  .btn-group {
    width: 220px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    margin-top:15px;
  }
  .group{
    position:relative;
    padding: 0 20px;
  }
  .btn-tip{
    position: absolute;
    margin:auto;
    font-size:16px;
    height:20px;
    line-height: 20px;
    &.right{
      right:-50%;
      top:0;
      bottom:0;
    }
    &.bottom{
      bottom:-25px;
      left:0;right:0;
    }
    &.right2{
      right:-50%;
      top:70%;
    }
    &.small-font{
      font-size: 14px;
    }
  }

  .btn-line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .center{
      height:100%;
      flex-grow: 1;
    }
  }
  .small-btn-group {
    margin-top:15px;
    width: 120px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .btn {
    position: relative;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 -5px 10px rgba(0,0,0,.4);
  }

  .normal-btn{
    background: #3ec1d3;
    width: 75px;
    height: 75px;
  }
  .small-btn {
    width: 40px;
    height: 40px;
    background: #11999e;
  }

  .big-btn {
    width: 110px;
    height: 110px;
    background: #ff165d;
    position: absolute;
    top:100px;
    left:30px;
  }

  .triangle-container{
    position: relative;
    .a{

    }
    .triangle{
      position:absolute;
      left:0;right:0;
      top:12px;
      margin:auto;
      transform-origin:  8px 26px;
    }
    .triangle.right{
      transform: rotate(-90deg);
    }
    .triangle.left{
      transform: rotate(90deg);
    }
    .triangle.down{
      transform: rotate(180deg);
    }
  }
  .triangle{
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 16px solid #111;
  }
  .btn::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    box-shadow: inset 0 5px 10px hsla(0, 0%, 100%, .6)
  }
</style>

<template>
  <div class="btn-container">
    <div class="small-btn-group">
      <div class="group">
        <div class="btn small-btn" @click="start"></div>
        <span class="btn-tip bottom small-font">重新开始</span>
      </div>
      <div class="group">
        <div class="btn small-btn" @click="stop"></div>
        <span class="btn-tip bottom small-font">暂停</span>
      </div>
    </div>
    <div class="btn big-btn" @click="dropDown"><span class="btn-tip bottom">掉落(SPACE)</span></div>
    <div class="btn-group">
      <div class="btn normal-btn" @click="up"><span class="btn-tip right">旋转</span></div>
      <div class="btn-line">
        <div class="btn normal-btn" @click="left"><span class="btn-tip bottom">左移</span></div>
        <div class="center triangle-container">
          <i class="triangle "></i>
          <i class="triangle right"></i>
          <i class="triangle left"></i>
          <i class="triangle down"></i>
        </div>
        <div class="btn normal-btn" @click="right"><span class="btn-tip bottom">右移</span></div>
      </div>
      <div class="btn normal-btn" @click="down"><span class="btn-tip right2">下移</span></div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'BtnGroup',
    data () {
      return {
//        level: this.$store.state.level,
//        startLine: this.$store.state.startLine
      }
    },
    mounted(){
      window.addEventListener('keyup', (e) => {
        switch (e.keyCode) {
          case 38:
            this.up()
            break
          case 87:
            this.up()
            break
          case 40:
            this.down()
            break
          case 83:
            this.down()
            break
          case 37:
            this.left()
            break
          case 65:
            this.left()
            break
          case 39:
            this.right()
            break
          case 68:
            this.right()
            break
          case 32:
            this.dropDown()
            break
        }
      })
    },
    computed: {
      ...mapState({
        level: state => state.level,
        startLine: state => state.startLine
      })
    },
    methods: {
      left(){
        if (this.checkHasStart()) {
          this.$store.commit('setLine', 'minus')
        } else {
          this.$store.commit('left')
        }
      },
      right(){
        if (this.checkHasStart()) {
          this.$store.commit('setLine', 'add')

        } else {
          this.$store.commit('right')
        }

      },
      up(){
        if (this.checkHasStart()) {
          this.$store.commit('setLevel', 'add')
        } else {
          this.$store.commit('rotate')
        }
      },
      down(){
        if (this.checkHasStart()) {
          this.$store.commit('setLevel', 'minus')
        } else {
          this.$store.commit('down')
        }
      },
      start(){
        if (this.$store.state.moving.render.length === 0) {
          this.$store.commit('start')
        } else {
          this.$store.commit('restart')
        }
      },
      stop(){
        if (!this.checkHasStart()) {
          if (this.$store.state.isStop) {
            this.$store.commit('goon')
          } else {
            this.$store.commit('stop')
          }
        }
      },
      dropDown(){
        if (this.checkHasStart()) {
          this.$store.commit('start')
        } else {
          if (this.$store.state.isStop) {
            this.$store.commit('goon')
          } else {
            this.$store.commit('dropDown')
          }
        }
      },
      checkHasStart(){
        //未开始返回true
        return (this.$store.state.moving.render.length === 0 && this.$store.state.hasStart === false)
      }
    }
  }
</script>


