<template>
    <div class="row m-1 m-md-5">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <TheDashboardHeader></TheDashboardHeader>
        </div>
        <div class="col-lg-8 mb-4">
            <LeftPanel>
                <div v-if="!cities?.length">Loading...</div>
                <SearchPlace :cities="cities" v-else/>
                <SavedCitiesList class="mt-5 "/>
            </LeftPanel>
        </div>
        <div class="col-lg-4">
            <RightPanel v-if="selectedCityId">
                <ClimateChartMonitor    
                    :city-id="selectedCityId"                   
                    :key="selectedCityId"  
                />
                <button class="btn btn-danger mt-2" @click="() => selectedCityId = null">Close</button>
            </RightPanel>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SavedCitiesList from './SavedCitiesList.vue'
import SearchPlace from './SearchPlace.vue';
import LeftPanel from './LeftPanel.vue';
import RightPanel from './RightPanel.vue';
import TheDashboardHeader from './TheDashboardHeader.vue';
import ClimateChartMonitor from './ClimateChartMonitor.vue';
import useCitiesApi from '@/services/useCitiesApi';
import { ref, provide } from 'vue';


provide( 'setSelectedCityId', ( cityId : number ) => { 
    selectedCityId.value = cityId
})
const selectedCityId = ref<number | null>(null);

const { data:cities, isLoading, isError} = useCitiesApi()



</script>


<style lang="scss" scoped>
.sidebar {
    background-color: var(--background-dark);
}
</style>
