import type { TypeCity } from '@/services/useCitiesApi'

export type TypeHistoryData = {
  timestamps: string[]
  temperatures: number[]
  humidities: number[]
}

export type TypeSaveCity = {
  city: TypeCity
  historyData: TypeHistoryData
}

export type TypeCityConfiguration = {
  userId: string
  cities: TypeSaveCity[]
}
