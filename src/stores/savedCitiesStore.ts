import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import type { TypeCityConfiguration, TypeSaveCity } from '@/types/savedCitiesTypes'

type TypeFullSaveCityObject = TypeCityConfiguration[]

function getFullSavedCityObject(): TypeFullSaveCityObject {
  const savedJsonString = localStorage.getItem('saved-cities')
  if (!savedJsonString) return [] as TypeCityConfiguration[]
  return JSON.parse(savedJsonString)
}

function saveFullCityObjectToLocalStorage(data: TypeFullSaveCityObject) {
  localStorage.setItem('saved-cities', JSON.stringify(data))
}

export const useSavedCitiesStore = defineStore('saved-cities', () => {
  let isInitSaveHistoryDataRuning = false
  const refreshSavingHistoryData = 1000 * 60

  const authStore = useAuthStore()
  const loggedInUserId = computed(() => authStore.user?.id ?? '')
  const userSavedCities = ref(getSavedCitiesByUserId(loggedInUserId.value))

  // Synchronization userSavedCities with
  watch(loggedInUserId, () => {
    userSavedCities.value = getSavedCitiesByUserId(loggedInUserId.value)
  })

  // Get saved cities from local storage
  function getSavedCitiesByUserId(userId: string): TypeSaveCity[] {
    const fullSavedCityObject = getFullSavedCityObject()
    const currentUserSavedConfig = fullSavedCityObject.find((data) => data.userId === userId)

    if (!currentUserSavedConfig) return []
    return currentUserSavedConfig.cities
  }

  // Save city to localstorage for logged user
  function saveCity({ city, historyData: { timestamps, temperatures, humidities } }: TypeSaveCity) {
    const userCities = getSavedCitiesByUserId(loggedInUserId.value)
    if (userCities.length >= 10) {
      throw new Error('Your city list is full. Please remove one of them.')
    }

    if (userCities.find(data => data.city.id === city.id)) throw new Error(`The city "${city.name}" is already saved. Please choose a different one.`)

    // Create new fully object to save
    const fullCityObject = getFullSavedCityObject().filter(
      (data) => data.userId !== loggedInUserId.value,
    )
    fullCityObject.push({
      userId: loggedInUserId.value,
      cities: [
        ...userCities.filter((data) => data.city.id !== city.id),
        { city, historyData: { timestamps, temperatures, humidities } },
      ],
    })

    // Save object ang synch userSaveCities
    saveFullCityObjectToLocalStorage(fullCityObject)
    userSavedCities.value = getSavedCitiesByUserId(loggedInUserId.value)
  }

  function getSavedCityById(cityId: number) {
    const findedCity = computed(() => userSavedCities.value.find((data) => data.city.id === cityId))

    if (!findedCity.value) throw new Error(`Saved cities not include city with id ${cityId}`)
    return findedCity
  }

  function removeSavedCityById(cityId: number) {
    const newFullSavedCityObject = getFullSavedCityObject().map((data) => {
      if (data.userId !== loggedInUserId.value) return data

      // user's data
      data.cities = data.cities.filter((cities) => cities.city.id !== cityId)
      return data
    })

    saveFullCityObjectToLocalStorage(newFullSavedCityObject)
    userSavedCities.value = getSavedCitiesByUserId(loggedInUserId.value)
  }

  function addHistoryToCityById(
    cityId: number,
    historyData: {
      timestamp: string
      temperature: number
      humidity: number
    },
  ) {
    const fullCityObject = getFullSavedCityObject()
    const updatedFullCityObject = fullCityObject.map((data) => {
      if (data.userId !== loggedInUserId.value) return data

      // user data
      data.cities = data.cities.map((cities) => {
        if (cities.city.id !== cityId) return cities

        // current city
        cities.historyData.timestamps.push(historyData.timestamp)
        cities.historyData.temperatures.push(historyData.temperature)
        cities.historyData.humidities.push(historyData.humidity)
        return cities
      })
      return data
    })

    saveFullCityObjectToLocalStorage(updatedFullCityObject)
    userSavedCities.value = getSavedCitiesByUserId(loggedInUserId.value)
  }

  function initSaveHistoryData() {
    if (isInitSaveHistoryDataRuning) return
    isInitSaveHistoryDataRuning = true

    let requestIntervals: {
      cityId: number
      intervalId: any
    }[] = []

    // Init intervals for all saved cities
    const savedCitiesIds = computed(() => userSavedCities.value.map((data) => data.city.id))
    watch(
      savedCitiesIds,
      () => {
        const requestIntervalsCityIds = requestIntervals.map((data) => data.cityId)

        // Delete useless intervals
        requestIntervals = requestIntervals.filter((data) => {
          if (savedCitiesIds.value.includes(data.cityId)) return data
          clearInterval(data.intervalId)
        })

        // Add new intervals
        const newCityIds = savedCitiesIds.value.filter(
          (cityId) => !requestIntervalsCityIds.includes(cityId),
        )
        newCityIds.forEach((cityId) => createIntervalForCity(cityId))
      },
      { immediate: true },
    )

    function getHistoryData(cityId: number) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`,
      )
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText)
          return res.json()
        })
        .then((data) => {
          const currentTimestamp = new Date().toISOString()
          let currentTemp: number
          let currentHumidity: number

          currentTemp = data?.main?.temp as number
          currentHumidity = data?.main?.humidity as number

          addHistoryToCityById(cityId, {
            timestamp: currentTimestamp,
            temperature: currentTemp,
            humidity: currentHumidity,
          })
        })
        .catch((err) => console.error('Error get history data', err))
    }

    function createIntervalForCity(cityId: number) {
      getHistoryData(cityId)

      const intervalId = setInterval(() => {
        getHistoryData(cityId)
      }, refreshSavingHistoryData)

      requestIntervals.push({
        cityId: cityId,
        intervalId,
      })
    }
  }

  return {
    initSaveHistoryData,
    saveCity,
    getSavedCitiesByUserId,
    getSavedCityById,
    removeSavedCityById,
    userSavedCities,
  }
})
