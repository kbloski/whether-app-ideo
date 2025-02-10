<template>
    <div v-if="isLoading">Loading...</div>
    <Error v-if="isError">Oh no, error, please contact support...</Error>
    <div v-else>
        <div class="text-light">{{ data?.city.name }}</div>
        <div class="bg-light">
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {  watch } from "vue";
import { useHourlyWeatherApiByCityId } from "@/services/useWeatherApi";
import { createChart } from "@/utils/createChart";

const props = defineProps<{ cityId: number }>();
const { data, isLoading, isError } = useHourlyWeatherApiByCityId(props.cityId);

watch(data, () => {
    if (!data) return;

    const labels : string[]= [];
    const temperatures  : number[]= [];
    const humadity : number[]= [];

    data.value?.list.forEach((el, index) => {
        if (index > 8) return;

        labels.push(el.dt_txt);
        temperatures.push(el.main.temp);
        humadity.push(el.main.humidity);
    });
    const canvaElement = document.getElementById('myChart');
    
    if (!canvaElement) return;
    createChart(canvaElement, 
        {
            labels: labels,
            datasets: [
                {
                    label: 'Temperatures (*C)',
                    data: temperatures,
                    fill: false,
                    borderColor: '#2ca02c',
                    tension: 0.1
                },
                {
                    label: 'Humadity (%)',
                    data: humadity,
                    fill: false,
                    borderColor: '#1f77b4',
                    tension: 0.1
                },
            ]
        },

    )

});
</script>

<style scoped>
canvas {
    width: 100%;
}
</style>
