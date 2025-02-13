<template>
    <div class="row m-1 m-md-5">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <TheDashboardHeader></TheDashboardHeader>
        </div>
        <div class="col-lg-8 mb-4">
            <LeftPanel>
                <div v-if="isLoading">Loading...</div>
                <TheError v-else-if="isError">Oh no, error, please contact support...</TheError>
                <SearchPanel :cities="cities" v-else-if="cities"/>
                <SavedCitiesList class="mt-5 "/>
            </LeftPanel>
        </div>
        <div class="col-lg-4">
            <Transition name="right-panel-transition" mode="out-in">
                <RightPanel v-if="dashboardStore.selectedCityId">
                    <Transition name="climate-monitor-transition" mode="out-in">
                        <ClimateChartMonitor    
                            :city-id="dashboardStore.selectedCityId"                   
                            :key="dashboardStore.selectedCityId"  
                        />
                    </Transition>
                    <button class="btn btn-danger mt-2" @click="dashboardStore.clearSelectedCityId">Close</button>
                </RightPanel>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SavedCitiesList from './SavedCitiesList.vue'
import SearchPanel from './SearchPanel.vue';
import LeftPanel from './LeftPanel.vue';
import RightPanel from './RightPanel.vue';
import TheDashboardHeader from './TheDashboardHeader.vue';
import ClimateChartMonitor from './ClimateChartMonitor.vue';
import useCitiesApi from '@/services/useCitiesApi';
import TheError from '../ui/TheError.vue';
import { useSavedCitiesStore } from '@/stores/savedCitiesStore';
import { useDashboardStore } from '@/stores/dashboardStore';

// Init saved cities store
const savedCitiesStore = useSavedCitiesStore()
savedCitiesStore.initSaveHistoryData()

const dashboardStore = useDashboardStore()

const { data:cities, isLoading, isError} = useCitiesApi()
</script>


<style lang="scss" scoped>
.sidebar {
    background-color: var(--background-dark);
}

.climate-monitor-transition {
    &-enter{
        &-from {
            opacity: 0;
        }

        &-active {
            transition: all 1s ease;
        }
    }

    &-leave {
        &-to {
            opacity: 0;
        }

        &-active {
            transition: all 1s ease;
        }
    }
}

.right-panel-transition {
    &-enter{
        &-from {
            transform: scaleX(0);
        }

        &-active {
            transition: all 1s ease;
        }
    }

    &-leave {
        &-to {
            transform: scaleX(0);
        }

        &-active {
            transition: all 1s ease;
        }
    }
}
</style>
