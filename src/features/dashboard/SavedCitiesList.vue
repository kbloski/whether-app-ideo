<template>

<div>
    <h2 class="border-bottom">Favorites<strong>Cities</strong></h2>
    <ul class="m-0 p-0">
        <strong>
            <li v-if="isLargeScreen" class="row mb-1">
                <span class="col-2 col-md-4">City name</span>
                <span class="col-2 col-md-3">Humadity</span>
                <span class="col-4 col-md-4">Temperature</span>
                <span class="col-4 col-md-1"> </span>
            </li>
        </strong>
        <div v-if="!savedCitiesStore.savedCities.length">Your list doesn't have any localizations yet.</div>
        <SavedCitiesListItem :city="city" :key="city.id" v-for="city in savedCitiesStore.savedCities" />
    </ul>
</div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';

import SavedCitiesListItem from './SavedCitiesListItem.vue';
import { useSavedCitiesStore } from '@/stores/savedCities';
const savedCitiesStore = useSavedCitiesStore()
const isLargeScreen = ref(document.body.scrollWidth > 600)

</script>

<style lang="scss" scoped>
ul > li:nth-child(even) {
    background-color: rgba(0, 4, 255, 0.03);
}
</style>
