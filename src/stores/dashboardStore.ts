import { ref } from "vue";
import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", () => {
    const selectedCityId = ref<number | null>(null);

    function clearSelectedCityId() {
        selectedCityId.value = null;
    }

    function setSelectedCityId(cityId: number) {
        selectedCityId.value = cityId;
    }

    return { 
        clearSelectedCityId,
        setSelectedCityId,
        selectedCityId,
     };
});
