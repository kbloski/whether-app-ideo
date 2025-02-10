import { useQuery } from "vue-query";
type TypeCity = {
  id: number
  country: string
  coord: { long: number; lat: number }
  name: string
  state: string
}

export type { TypeCity }

async function fetchCities() : Promise<TypeCity[]> {
    const response = await fetch('/city.list.json.gz');

    if(!response.ok) throw new Error('Network response was not ok');
    return response.json()
}

export default function useCitiesApi(){
    return useQuery<TypeCity[], Error>('cities', fetchCities)
}