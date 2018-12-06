import Vue from 'vue';
import Vuex from 'vuex';
import level1 from '../levels/level1.js';
import level2 from '../levels/level2.js';
import _ from 'lodash';
import gameObjects from '../const/gameObjects.js';
import directions from '../const/directions.js';
//import level0 from '../levels/level0.js'; - test level

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currentLevelNum: null,
    currentLevel: null,
    levels: {
      level1,
      level2,
    },
    score: 0,
  },
  getters: {
    gameStarted(state) {
      return state.currentLevel != null;
    },
    levelsCount(state) {
      return Object.getOwnPropertyNames(state.levels).length;
    },
    currentLevel(state) {
      return state.currentLevelNum;
    },
    getLevel(state) {
      return state.currentLevel;
    },
    levelXCount(state) {
      return state.currentLevel[0].length;
    },
    levelYCount(state) {
      return state.currentLevel.length;
    },
    isLevelFinished(state) {
      const placesCount = _.reduce(state.currentLevel, (carry, levelRow) => {
        const isPlace = _.indexOf(levelRow, gameObjects.PLACE);
        if (isPlace !== -1) {
          carry = carry + 1;
        }
        return carry;
      }, 0);
  
      const isManOnPlace = _.reduce(state.currentLevel, (carry, levelRow) => {
        const isManOnPlace = _.indexOf(levelRow, gameObjects.MAN_ON_PLACE);
        if (isManOnPlace !== -1) {
          carry = true;
        }
        return carry;
      }, false);
  
      return placesCount === 0 && !isManOnPlace;
    },
    getManCoords(state) {
      return _.reduce(state.currentLevel, (carry, levelRow, levelKey) => {
        const manX = _.indexOf(levelRow, gameObjects.MAN);
        const manXOnPlace = _.indexOf(levelRow, gameObjects.MAN_ON_PLACE);
        
        if (manX !== -1) {
          carry = { x: manX, y: levelKey };
        }
        else if (manXOnPlace !== -1) {
          carry = { x: manXOnPlace, y: levelKey };
        }
        return carry;
      }, null);
    },
  },
  mutations: {
    setCurrentLevel(state, levelNumber) {
      state.currentLevelNum = levelNumber;
      state.currentLevel = _.cloneDeep(state.levels[`level${levelNumber}`]);
    },
    finishGame(state) {
      state.currentLevelNum = null;
      state.currentLevel = null;
    },
    setManCoords(state, { coords, direction }) {
      const oldCoords = this.getters.getManCoords;
      const currentLevel = _.clone(state.currentLevel);
      const prevElement = currentLevel[oldCoords.y][oldCoords.x];
      const nextElement = currentLevel[coords.y][coords.x];
      
      if (nextElement === gameObjects.WALL) {
        return false;
      }
      
      let afterNextCoords;
      if (direction === directions.UP) {
        afterNextCoords = { y: coords.y - 1, x: coords.x };
      }
      else if (direction === directions.DOWN) {
        afterNextCoords = { y: coords.y + 1, x: coords.x };
      }
      else if (direction === directions.LEFT) {
        afterNextCoords = { y: coords.y, x: coords.x - 1 };
      }
      else if (direction === directions.RIGHT) {
        afterNextCoords = { y: coords.y, x: coords.x + 1 };
      }
      
      const afterNextElement = currentLevel[afterNextCoords.y][afterNextCoords.x];
  
      const isNextBoxOrBoxOnPlace = nextElement === gameObjects.BOX || nextElement === gameObjects.BOX_ON_PLACE;
      const isAfterNextBoxOrBoxOnPlaceOrWall = afterNextElement === gameObjects.BOX || afterNextElement === gameObjects.BOX_ON_PLACE || afterNextElement === gameObjects.WALL;
      if (isNextBoxOrBoxOnPlace && isAfterNextBoxOrBoxOnPlaceOrWall) {
        return false;
      }
      
      const isNextBox = nextElement === gameObjects.BOX;
      const isNextPlace = nextElement === gameObjects.PLACE;
      const isNextBoxOnPlace = nextElement === gameObjects.BOX_ON_PLACE;
      
      const isAfterNextPlace = afterNextElement === gameObjects.PLACE;
      
      if (isNextBox && isAfterNextPlace) {
        currentLevel[afterNextCoords.y][afterNextCoords.x] = gameObjects.BOX_ON_PLACE;
      }
      else if (isNextBoxOnPlace && isAfterNextPlace) {
        currentLevel[afterNextCoords.y][afterNextCoords.x] = gameObjects.BOX_ON_PLACE;
      }
      else if (isNextBoxOnPlace) {
        currentLevel[afterNextCoords.y][afterNextCoords.x] = gameObjects.BOX;
      }
      else if (isNextBox) {
        currentLevel[afterNextCoords.y][afterNextCoords.x] = gameObjects.BOX;
      }
      
      currentLevel[coords.y][coords.x] = isNextPlace || isNextBoxOnPlace ? gameObjects.MAN_ON_PLACE : gameObjects.MAN;
      currentLevel[oldCoords.y][oldCoords.x] = prevElement === gameObjects.MAN_ON_PLACE ? gameObjects.PLACE : gameObjects.EMPTY;
      state.currentLevel = currentLevel;
    },
  },
  actions: {},
});