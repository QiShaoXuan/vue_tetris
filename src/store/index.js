import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const saveData = localStorage.getItem('tetrisData')?JSON.parse(localStorage.getItem('tetrisData')):{
  maxScore:0
}

export default new Vuex.Store({
  state: {
    width: 10,
    height: 20,
    speed: 1,
    pile: [],
    moving: {
      type: -1,
      render: [],
      center: [],
    },
    dissapear: [],
    interval: 800,
    t: null,
    startLine: 0,
    level: 1,
    isStop: true,
    hasStart: false,
    maskShow:true,//遮罩是否显示
    fullLine: [],//刷新动画动画
    score: 0,
    maxScore:saveData.maxScore
  },
  mutations: {
    createTetirs(state){
      let type = Math.floor(Math.random() * 7)
      let cx = Math.round(state.width / 2)//中心点 5
      switch (type) {
        case 0://正方形
          state.moving = {
            type: 1,
            render: [[cx, 0], [cx + 1, 0], [cx, -1], [cx + 1, -1]],
            center: [cx, 0]
          }
          break
        case 1://L
          state.moving = {
            type: 2,
            render: [[cx - 1, 0], [cx, 0], [cx + 1, 0], [cx + 1, -1]],
            center: [cx, 0]
          }
          break
        case 2://反L
          state.moving = {
            type: 3,
            render: [[cx - 1, -1], [cx - 1, 0], [cx, 0], [cx + 1, 0]],
            center: [cx, 0]
          }
          break
        case 3://——
          state.moving = {
            type: 4,
            render: [[cx - 1, 0], [cx, 0], [cx + 1, 0], [cx + 2, 0]],
            center: [cx, 0]
          }
          break
        case 4://T
          state.moving = {
            type: 5,
            render: [[cx - 1, 0], [cx, 0], [cx + 1, 0], [cx, -1]],
            center: [cx, 0]
          }
          break
        case 5://S
          state.moving = {
            type: 6,
            render: [[cx - 1, 0], [cx, 0], [cx, -1], [cx + 1, -1]],
            center: [cx, 0]
          }
          break
        case 6://Z
          state.moving = {
            type: 7,
            render: [[cx - 1, -1], [cx, -1], [cx, 0], [cx + 1, 0]],
            center: [cx, 0]
          }
          break
      }
    },
    drop(state){
      if (state.isStop)return

      let newPosition = []
      state.moving.render.forEach((v) => {
        newPosition.push([v[0], v[1] + 1])
      })

      if (!checkBoundary(newPosition) && !checkPile(state, newPosition)) {
        state.moving.render = newPosition
        state.moving.center = [state.moving.center[0], state.moving.center[1] + 1]
      } else {
        state.pile.push(...state.moving.render)

        let dissapear = disappear(state)
        if (dissapear.length) {
          clearInterval(state.t)
          state.interval = 800
          this.commit('setDissapearAnimate', {
            fnName: 'start',
            dissapear: dissapear
          })
        } else {
          state.interval = 800
          this.commit('start')
        }
      }
    },
    setDissapearAnimate(state, {fnName = '', dissapear = []}){
      let num = 0
      state.dissapear = dissapear
      let t = setInterval(() => {
        if (num == 4) {
          clearInterval(t)
          state.dissapear = []
          deletePile(state, dissapear)
          setScore(state, dissapear)
          if (fnName) {
            this.commit(fnName)
          }
        } else {
          if (num % 2 == 0) {
            state.dissapear = dissapear
          } else {
            state.dissapear = []
          }
        }
        num++
      }, 200)
    },
    left(state){
      if (state.isStop)return

      let newPosition = []
      state.moving.render.forEach((v) => {
        newPosition.push([v[0] - 1, v[1]])
      })
      if (!checkBoundary(newPosition)) {
        state.moving.render = newPosition
        state.moving.center = [state.moving.center[0] - 1, state.moving.center[1]]
      }

    },
    right(state){
      if (state.isStop)return

      let newPosition = []
      state.moving.render.forEach((v) => {
        newPosition.push([v[0] + 1, v[1]])
      })
      if (!checkBoundary(newPosition)) {
        state.moving.render = newPosition
        state.moving.center = [state.moving.center[0] + 1, state.moving.center[1]]
      }
    },
    down(state){
      if (state.isStop)return

      let newPosition = []
      state.moving.render.forEach((v) => {
        newPosition.push([v[0], v[1] + 1])
      })
      if (!checkBoundary(newPosition) && !checkPile(state, newPosition)) {
        state.moving.render = newPosition
        state.moving.center = [state.moving.center[0], state.moving.center[1] + 1]
      }
    },
    rotate(state){
      if (state.isStop)return
      if (state.moving.type === 1)return

      let new_position = []

      let cx = state.moving.center[0]
      let cy = state.moving.center[1]

      if (state.moving.type === 4) {
        if (state.moving.render[0][0] === state.moving.render[1][0]) {
          new_position = [[cx - 1, cy], [cx, cy], [cx + 1, cy], [cx + 2, cy]]
        } else {
          new_position = [[cx, cy - 1], [cx, cy], [cx, cy + 1], [cx, cy + 2]]
        }
      } else {
        state.moving.render.forEach((v) => {
          let x = cx + cy - v[1]
          let y = -cx + cy + v[0]
          new_position.push([x, y])
        })
      }

      if (!checkBoundary(new_position)) {
        state.moving.render = new_position
      }
    },
    dropDown(state){
      clearInterval(state.t)
      state.interval = 20
      state.t = setInterval(() => {
        this.commit('drop')
      }, state.interval / state.level)
    },
    setLevel(state, type){
      switch (type) {
        case 'add':
          state.level = state.level + 1 > 5 ? 5 : state.level + 1
          break
        case 'minus':
          state.level = state.level - 1 < 1 ? 1 : state.level - 1
      }
    },
    setLine(state, type){
      switch (type) {
        case 'add':
          state.startLine = state.startLine + 1 > 10 ? 10 : state.startLine + 1
          break
        case 'minus':
          state.startLine = state.startLine - 1 < 0 ? 0 : state.startLine - 1
      }
    },
    goon(state){
      if (state.isStop && state.moving.render.length) {
        state.isStop = false
        this.commit('drop')
        state.t = setInterval(() => {
          this.commit('drop')
        }, state.interval / state.level)
      }
    },
    start(state){
      clearInterval(state.t)
      if (state.hasStart === false) {
        state.pile = setStartLine(state.startLine)
      }
      state.isStop = false
      state.hasStart = true
      state.maskShow = false

      this.commit('createTetirs')

      if (checkRestart(state)) {
        clearInterval(state.t)
        state.moving = {
          type: -1,
          render: [],
          center: [],
        }
        this.commit('setDissapearAnimate', {
          fnName: 'restart',
          dissapear: state.pile
        })
      } else {
        state.t = setInterval(() => {
          this.commit('drop')
        }, state.interval / state.level)
      }
    },
    stop(state){
      state.isStop = true
      clearInterval(state.t)
    },
    restart(state){
      clearInterval(state.t)
      state.isStop = true
      state.hasStart = false
      this.commit('restartAnimate', ['reset'])
    },
    restartAnimate(state, fnName){
      let newFullLine = []
      let lineNum = state.height - 1
      let counter = 0
      newFullLine.push(lineNum)
      let resetT = setInterval(() => {
        if (counter == 40) {
          clearInterval(resetT)
          if (fnName.length) {
            fnName.forEach((v) => {
              this.commit(v)
            })
          }
        }
        if (counter < 19) {
          lineNum = lineNum - 1
          newFullLine.push(lineNum)
          //检查删除pile和moving
          state.pile = state.moving.render.filter(v => v[1] != lineNum)
          state.moving.render = state.pile.filter(v => v[1] != lineNum)
        } else {
          newFullLine.splice(newFullLine.length - 1, 1)
        }
        counter++
        state.fullLine = newFullLine
      }, 40)
    },
    reset(state){
      state.moving = {
        type: -1,
        render: [],
        center: [],
      }
      state.pile = []
      state.interval = 800
      state.score = 0
      state.maskShow = true
    },
  },
})

//检查边界
function checkBoundary(newPosition) {
  return newPosition.find(v => v[0] < 0 || v[0] > 9 || v[1] > 19 || v[1] < 0) ? true : false
}
//检查堆积
function checkPile(state, newPosition) {
  let check = false
  state.pile.forEach((arr) => {
    if (newPosition.find(v => v[0] === arr[0] && v[1] === arr[1])) {
      check = true
    }
  })
  return check ? true : false
}
//返回需消失的y坐标
function disappear(state) {
  let disappearY = []
  let start = state.pile.filter(v => v[0] === 0)
  start.forEach((v) => {
    let sameY = state.pile.filter(arr => arr[1] === v[1])
    if (sameY.length === 10) {
      disappearY.push(...sameY)
    }
  })

  return disappearY.length ? disappearY : []
}
//删除一整行
function deletePile(state, dissapear) {
  let newPosition = []
  state.pile.forEach((v) => {
    if (dissapear.find(arr => (arr[0] === v[0] && arr[1] === v[1])) === undefined) {
      newPosition.push(v)
    }
  })
  let min = dissapear.sort((a, b) => b[1] - a[1])[0]
  let lineNum = dissapear.filter(v => v[0] === 0).length

  newPosition.forEach((v) => {
    if (v[1] <= min[1]) {
      v[1] += lineNum
    }
  })
  state.pile = newPosition
}
//设置分数
function setScore(state, dissapear) {
  let lineNum = dissapear.filter(v => v[0] === 0).length
  let newScore = state.score + lineNum * 100 + (lineNum - 1) * 50
  state.score = newScore
  if(state.score > state.maxScore){
    state.maxScore = newScore
    saveData.maxScore = newScore
    localStorage.setItem('tetrisData',JSON.stringify(saveData))
  }
}
//设置初始行
function setStartLine(startLine) {
  let startPile = []

  for (let i = 0; i < startLine; i++) {
    let sum = 4 + Math.floor(Math.random() * 7)
    let colArr = []
    for (var j = 0; j < sum; j++) {
      let x = setRandom(colArr)
      let y = 19 - i
      colArr.push([x, y])
    }
    if (colArr.length === 10) {
      let dis = Math.floor(Math.random() * 10)
      colArr.splice(dis, 1)
    }
    startPile.push(...colArr)
  }
  return startPile
}

function setRandom(hasArr = []) {
  let num = Math.floor(Math.random() * 10)
  let flag = hasArr.find(v => v[0] === num)
  if (flag === undefined) {
    return num
  } else {
    return setRandom(hasArr)
  }
}

//检查是否需要重新开始
function checkRestart(state) {
  let flag = false
  state.moving.render.forEach((v) => {
    if (state.pile.find(arr => (arr[0] === v[0] && arr[1] === v[1]))) {
      flag = true
    }
  })
  return flag
}
