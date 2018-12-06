<template>
    <div id="app" class="flex-container">
        <Game v-if="gameStarted"></Game>
        <Menu v-else></Menu>
    </div>
</template>

<script>
  import Game from './components/Game';
  import Menu from './components/Menu';
  import {mapGetters} from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        gameStarted: 'gameStarted',
      }),
    },
    components: {
      Menu,
      Game
    },
  }
</script>