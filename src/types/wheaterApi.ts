export interface WeatherConfigType {
  coord: { lon: number; lat: number }
  weather: Array<{ id: number; main: string; description: string; icon: string }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: { speed: number; deg: number; gust?: number }
  clouds: { all: number }
  dt: number
  sys: { country: string; sunrise: number; sunset: number }
  timezone: number
  id: number
  name: string
  cod: number
}

export type WeatherHourlyConfig = {
  cod: string
  message: number
  cnt: number
  list: WeatherEntry[]
  city: CityInfo
}

type WeatherEntry = {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  sys: {
    pod: string
  }
  dt_txt: string
}

type CityInfo = {
  id: number
  name: string
  coord: {
    lat: number
    lon: number
  }
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}