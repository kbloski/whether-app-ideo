<script setup lang="ts">
import { useQueryProvider } from 'vue-query';
import { RouterView } from 'vue-router'

useQueryProvider()
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
:root {
  --background-dark: #1A1A4B;
}

body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: #87CEEB;
}

</style>