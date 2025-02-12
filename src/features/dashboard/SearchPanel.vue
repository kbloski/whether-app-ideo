<template>
  <form class="d-flex justify-content-center align-items-center" @submit.prevent="handleSubmit">
    <!-- Input search -->
    <div class="me-2">
      <input
        type="text"
        class="form-control"
        placeholder="Search place"
        v-model.trim="searchValue"
        @blur="handleSearchCities"
      />
    </div>

    <!-- Select cities options -->
    <select class="form-select" v-model="selectedCityId"  >
      <option selected disabled :value="null">Search you city</option>
      <option v-for="city in findedCities.slice(0, 10)" :key="city.id" :value="city.id">
        {{ city.name }}
      </option>
      <option disabled v-if="findedCities.length > 10">({{ findedCities.length }} more records...)</option>
    </select>

    <Transition name="btn-add">
      <button class="btn btn-success ms-2" v-if="selectedCityId">Add</button>
    </Transition>
  </form>

  <!-- Error message -->
  <TheError v-if="isError">{{ isError }} </TheError>
</template>

<script lang="ts" setup>
import type { TypeCity } from "@/services/useCitiesApi";
import { useSavedCitiesStore } from "@/stores/savedCitiesStore";
import { ref, defineProps } from "vue";
import TheError from "../ui/TheError.vue";


const citiesStore = useSavedCitiesStore();

const props = defineProps<{ cities: TypeCity[] }>();

const isError = ref("");
const searchValue = ref("");
const selectedCityId = ref<number | null>(null);
const findedCities = ref(props.cities ?? []);

function handleSearchCities(){
    const query = searchValue.value.trim().toLowerCase();
    if (!query) return props.cities;
    
    const filtered = props.cities.filter(city =>
        city.name.toLowerCase().startsWith(query)
    );

  selectedCityId.value = null;
  findedCities.value = filtered;
}

function handleSubmit() {
  try {
    const city = findedCities.value.find(city => city.id === selectedCityId.value);
    if (!city) return;

    citiesStore.saveCity({city, historyData: {
      timestamps: [],
      temperatures: [],
      humidities: []
    }});

    isError.value = ""; 
  } catch (err: unknown) {
    isError.value = err instanceof Error ? err.message : "Unexpected error";
  }
}
</script>

<style lang="scss" scoped>

.btn-add-enter-from,
.btn-add-leave-to {
  transform: scale(0);
}

.btn-add-enter-active,
.btn-add-leave-active {
  transition: transform 0.3s ease;
}

input, select {
    box-shadow: 0 0 3px black;
    border: 0;
    outline: 0;
}

</style>
