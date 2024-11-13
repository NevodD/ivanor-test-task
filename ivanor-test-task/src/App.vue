<template>
  <div class="main-wrapper">
    
  </div>
  <Loader v-if="appStore.loader" />
  <ErrorPage v-if="appStore.error" />
</template>

<script setup>
  import { useAppStore } from '@/stores/app.js'
  import Loader from '@/components/Loader.vue';
import ErrorPage from './components/ErrorPage.vue';

  const appStore = useAppStore()
  
</script>


<style lang="stylus">

</style>
