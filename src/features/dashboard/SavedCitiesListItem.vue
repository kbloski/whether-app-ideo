<template>
    <div v-if="isLoading">Loading...</div>
    <Error v-else-if="isError">Oh no, error, please contact support...</Error>
    <li class="row mb-1 py-1 px-1" v-else>
        <span class="col-2 col-md-4 d-flex align-items-center">{{ city.name }}</span>
        <span class="col-2 col-md-3 d-flex align-items-center"
            >💧 {{ data?.main?.humidity }}%</span
        >
        <span class="col-4 col-md-3 d-flex align-items-center">🌡️ {{ data?.main?.temp }}°C</span>
        <span class="col-4 col-md-2 p-0 d-flex align-items-center">
            <button class="btn btn-primary m-0" @click="handleSelectCity( city.id)">i</button>
            <button class="btn btn-danger m-0 ms-2" @click="handleDelete(city.id)">x</button>
        </span>
    </li>
</template>

<script lang="ts" setup>
import type { TypeCity } from "@/services/useCitiesApi";
import { useWeatherApiByCityId } from "@/services/useWeatherApi";
import { useSavedCitiesStore } from "@/stores/savedCities";
import { inject } from "vue";


const savedCitiesStore = useSavedCitiesStore()
const setSelectedCityId = inject<(cityId: number) => void>('setSelectedCityId', () => {})

const props = defineProps<{
    city: TypeCity;
}>();

const { data, isLoading, isError} = useWeatherApiByCityId(props.city.id);

function handleDelete( cityId : number){
    savedCitiesStore.removeSavedCityById( cityId )
}

function handleSelectCity( cityId : number){
    setSelectedCityId( cityId ) 
}

</script>

