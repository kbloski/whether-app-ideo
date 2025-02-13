import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import type { TypeCityConfiguration, TypeSaveCity } from '@/types/savedCitiesTypes'

type TypeFullSaveCityObject = TypeCityConfiguration[]

function getFullSavedCityObject(): TypeFullSaveCityObject {
  const savedJsonString = localStorage.getItem('saved-local-cities')
  if (!savedJsonString) return [] as TypeCityConfiguration[]
  return JSON.parse(savedJsonString)
}

function saveFullCityObjectToLocalStorage(data: TypeFullSaveCityObject) {
  localStorage.setItem('saved-local-cities', JSON.stringify(data))
}

export const useSavedCitiesStore = defineStore('saved-local-cities', () => {
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
    const userCities = userSavedCities.value
    if (userCities.length >= 10) {
      throw new Error('Your city list is full. Please remove one of them.')
    }

    if (userCities.find((data) => data.city.id === city.id))
      throw new Error(`The city "${city.name}" is already saved. Please choose a different one.`)

    const newUserCities = [
      ...userCities.filter((data) => data.city.id !== city.id),
      { city, historyData: { timestamps, temperatures, humidities } },
    ]

    // Create new fully object to save
    const fullCityObject = getFullSavedCityObject().filter(
      (data) => data.userId !== loggedInUserId.value,
    )
    fullCityObject.push({
      userId: loggedInUserId.value,
      cities: newUserCities
    })

    // Save object ang synch userSaveCities
    saveFullCityObjectToLocalStorage(fullCityObject)
    userSavedCities.value = newUserCities
  }

  
  function getSavedCityById(cityId: number) {
    
    const findedCity = computed(() => {
      const findElements = userSavedCities.value.filter((data) => data.city.id === cityId)
      return findElements[0]
    })


    if (!findedCity.value) throw new Error(`Saved cities not include city with id ${cityId}`)
    return findedCity.value
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
    const userCities = userSavedCities.value
    const currentCityData = userCities.find((data) => data.city.id === cityId)

    if (!currentCityData) throw new Error('Not found city in saved cities list')

    currentCityData.historyData.timestamps.push(historyData.timestamp)
    currentCityData.historyData.temperatures.push(historyData.temperature)
    currentCityData.historyData.humidities.push(historyData.humidity)

    const updatetUserCities = [
      ...userCities.filter( data => data.city.id !== cityId),
      currentCityData
    ]

    const updatedFullCityObject = fullCityObject.map((data) => {
      if (data.userId !== loggedInUserId.value) return data
      data.cities = updatetUserCities
      return data
    })
    
    saveFullCityObjectToLocalStorage(updatedFullCityObject)
    
    userSavedCities.value = updatetUserCities
  }

  function initSaveHistoryData() {
    if (isInitSaveHistoryDataRuning) return
    isInitSaveHistoryDataRuning = true

    let requestIntervals: {
      cityId: number
      intervalId: number
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

          const currentTemp = data?.main?.temp 
          const currentHumidity = data?.main?.humidity 

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
