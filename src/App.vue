<script setup lang="ts">
import { useQueryProvider } from 'vue-query';
import { RouterView } from 'vue-router'

useQueryProvider()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="change-page">
      <Component :is="Component"/>
    </Transition>
  </RouterView>
</template>

<style lang="scss">
:root {
  --background-dark: #1A1A4B;
}

body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: #87CEEB;
}


.change-page {
  &-enter{
    &-from {
      opacity: 0;
    }
    &-actve {
      transition: all .3s ease;
    }
  }

  &-leave{
    &-active {
      transition: all .3s ease;
    }
    &-to {
      opacity: 0;
    }
  }

}
</style>