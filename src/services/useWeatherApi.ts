import { useQuery } from 'vue-query'
import type { WeatherConfigType, WeatherHourlyConfig} from '@/types/wheaterApiTypes'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

async function fetchWeatherData(
  cityId: number,
) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${API_KEY}`

  try {
    const response = await fetch(URL)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return response.json()
  } catch (error) {
    console.error(`Error fetching weather data:`, error)
    throw error
  }
}

export function useWeatherApiByCityId(cityId: number) {
  return useQuery<WeatherConfigType>(
    ['weather', cityId],
    () => fetchWeatherData(cityId),
    {
      staleTime: 1000 * 60,
      retry: 1, 
      cacheTime: 0,
    },
  )
}


async function fetchHourlyWeatherData(cityId: number ){
  const URL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${API_KEY}`

  try {
    const response = await fetch(URL)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return response.json()
  } catch (error) {
    console.error(`Error fetching forecast data:`, error)
    throw error
  }
}


export function useHourlyWeatherApiByCityId(cityId: number) {
  return useQuery<WeatherHourlyConfig>(
    ['weather-hourly', cityId],
    () => fetchHourlyWeatherData(cityId),
    {
      staleTime: 1000 * 60,
      retry: 1,
      cacheTime: 1000 * 69 * 15,
    },
  )
}