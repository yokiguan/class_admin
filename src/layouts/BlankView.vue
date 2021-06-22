<template>
  <div class="animate__animated animate__fadeInRight">
    <keep-alive v-if="multiPage">
      <router-view />
    </keep-alive>
    <router-view v-else />
  </div>
</template>

<script>
import PageToggleTransition from '../components/transition/PageToggleTransition';
import {mapState} from 'vuex'

export default {
  name: 'BlankView',
  components: {PageToggleTransition},
  computed: {
    ...mapState('setting', ['multiPage', 'animate'])
  }
}
</script>

<style scoped>

</style>
