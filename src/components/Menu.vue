<template>
    <div>
        <h2>Меню</h2>
        <ul>
            <li v-for="levelNumber in levelsCount - 1" :key="levelNumber">
                <a @click.prevent="selectLevel(levelNumber)" href="#">Уровень {{ levelNumber }}</a>
            </li>
        </ul>
    </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        levelsCount: 'levelsCount',
      }),
    },
    methods: {
      selectLevel(levelNumber) {
        this.setLevel(levelNumber);
      },
      ...mapMutations({
        setLevel: 'setCurrentLevel',
      }),
    },
  };
</script>
<style type="text/css">
    h2 {
        text-align: center;
    }
</style>