<template>
    <div class="row" v-if="levelObject !== null">
        <p><a href="#" @click.prevent="goToMenu()">В меню</a></p>
        <div class="flex-item">
            <div v-for="y in levelYCount" :key="y">
                    <span class="empty"
                          :class="{
                                box: isBox(x - 1, y - 1),
                                man: isMan(x - 1, y - 1),
                                wall: isWall(x - 1, y - 1),
                                place: isPlace(x - 1, y - 1),
                                'box-on-place': isBoxOnPlace(x - 1, y - 1),
                                'man-on-place': isManOnPlace(x - 1, y - 1),
                            }"
                          v-for="x in levelXCount" :key="x"></span>
            </div>
        </div>
    </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import gameObjects from '../const/gameObjects.js';
  import directions from '../const/directions.js';
  import _ from 'lodash';

  export default {
    data() {
      return {
        levelObject: null,
      };
    },
    computed: {
      ...mapGetters({
        currentLevel: 'currentLevel',
        levelYCount: 'levelYCount',
        levelXCount: 'levelXCount',
        isLevelFinished: 'isLevelFinished',
        levelsCount: 'levelsCount',
      }),
    },
    mounted() {
      this.levelObject = this.getLevel();
      document.addEventListener('keyup', this.move);
    },
    destroyed() {
      document.removeEventListener('keyup', this.move);
    },
    methods: {
      setLevel(number) {
        this.setCurrentLevel(number);
        this.levelObject = this.getLevel();
      },
      move(e) {
        e.preventDefault();
        e.stopPropagation();
        const direction = e.which;
        const isDirection = _.indexOf([directions.UP, directions.LEFT, directions.RIGHT, directions.DOWN], direction);
        if (isDirection === -1) {
          return false;
        }

        const coords = Object.assign({}, this.getManCoords());
        if (direction === directions.LEFT) {
          coords.x -= 1;
        }
        else if (direction === directions.UP) {
          coords.y -= 1;
        }
        else if (direction === directions.RIGHT) {
          coords.x += 1;
        }
        else if (direction === directions.DOWN) {
          coords.y += 1;
        }
        this.setManCoords({ coords, direction });
      },
      isMan(x, y) {
        return this.levelObject[y][x] === gameObjects.MAN;
      },
      isManOnPlace(x, y) {
        return this.levelObject[y][x] === gameObjects.MAN_ON_PLACE;
      },
      isBox(x, y) {
        return this.levelObject[y][x] === gameObjects.BOX;
      },
      isWall(x, y) {
        return this.levelObject[y][x] === gameObjects.WALL;
      },
      isPlace(x, y) {
        return this.levelObject[y][x] === gameObjects.PLACE;
      },
      isBoxOnPlace(x, y) {
        return this.levelObject[y][x] === gameObjects.BOX_ON_PLACE;
      },
      ...mapGetters({
        getLevel: 'getLevel',
        getManCoords: 'getManCoords',
      }),
      ...mapMutations({
        setManCoords: 'setManCoords',
        setCurrentLevel: 'setCurrentLevel',
        goToMenu: 'finishGame',
      }),
    },
    watch: {
      isLevelFinished(newVal) {
        if (newVal) {
          const nextLevelNum = this.currentLevel + 1;
          if (nextLevelNum < this.levelsCount) {
            this.setLevel(this.currentLevel + 1);
          }
          else {
            this.goToMenu();
          }
        }
      },
    },
  };
</script>