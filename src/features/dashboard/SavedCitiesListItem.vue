<template>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Oh no, error, please contact support...</div>
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
import { useDashboardStore } from "@/stores/dashboardStore";
import { useSavedCitiesStore } from "@/stores/savedCitiesStore";

const dashboardStore = useDashboardStore()

const savedCitiesStore = useSavedCitiesStore()

const props = defineProps<{
    city: TypeCity;
}>();

const { data, isLoading, isError} = useWeatherApiByCityId(props.city.id);

function handleDelete( cityId : number){
    savedCitiesStore.removeSavedCityById( cityId )
}

function handleSelectCity( cityId : number){
    dashboardStore.setSelectedCityId( cityId ) 
}

</script>

