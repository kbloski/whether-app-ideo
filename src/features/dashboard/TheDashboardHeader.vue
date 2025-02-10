<template>
<div class="titleSection p-3 mb-3 text-light d-flex w-100">
    <span class="flex-grow-1 me-3"><strong>Weather App</strong></span>
    <span class="me-3">{{ authStore.user?.login }}</span>
    <button @click="handleLogOut" class="text-light">Log out ❌</button>
</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore();

function handleLogOut(){
    authStore.logOut()
    router.replace('/auth')
}
</script>

<style lang="scss" scoped>
.titleSection {
    background: var(--background-dark);
    border-radius: 1rem;
}

button {
    background: transparent;
}

</style>