import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { TypeCity } from '@/services/useCitiesApi'
import { useAuthStore } from './auth'

type SaveCityConfig = {
  userId: string
  cities: TypeCity[]
}

function getAllSavedCities(): SaveCityConfig[] {
  const savedJsonString = localStorage.getItem('saved-cities')
  if (!savedJsonString) return []
  return JSON.parse(savedJsonString)
}

function saveCitiesToLocalStorage(allCities: SaveCityConfig[]) {
  localStorage.setItem('saved-cities', JSON.stringify(allCities))
}



export const useSavedCitiesStore = defineStore('saved-cities', () => {
  const authStore = useAuthStore()
  const userId = computed(() => authStore.user?.id ?? '')
  const savedCities = ref(getSavedCitiesByUserId(userId.value))

  watch(userId, () => {
    savedCities.value = getSavedCitiesByUserId(userId.value)
  })

  function getSavedCitiesByUserId(userId: string): TypeCity[] {
    const allCities = getAllSavedCities()
    const userSaves = allCities.find((data) => data.userId === userId)
    return userSaves ? userSaves.cities : []
  }

  function saveCityToLocalStorage(city: TypeCity) {
    const userCities = getSavedCitiesByUserId(userId.value)

    if (userCities.length >= 10) {
      throw new Error('Your city list is full. Please remove one of them.')
    }

    const cityExists = userCities.find((c) => c.id === city.id)
    if (cityExists) {
      throw new Error('This city already exists in your store.')
    }

    const allCities = getAllSavedCities().filter((config) => config.userId !== userId.value)
    const updatedCities = [...userCities, city]
    saveCitiesToLocalStorage([...allCities, { userId: userId.value, cities: updatedCities }])

    savedCities.value = updatedCities
  }

  function removeSavedCityById(cityId: number) {
    const userCities = getSavedCitiesByUserId(userId.value)
    const citiesToSave = userCities.filter((city) => city.id !== cityId)

    if (userCities.length === citiesToSave.length) {
      throw new Error('City not found in your saved cities.')
    }

    const allSavedCities = getAllSavedCities().filter((conf) => conf.userId !== userId.value)
    saveCitiesToLocalStorage([...allSavedCities, { userId: userId.value, cities: citiesToSave }])

    savedCities.value = citiesToSave
  }

  return {
    saveCityToLocalStorage,
    getSavedCitiesByUserId,
    removeSavedCityById,
    savedCities,
  }
})
