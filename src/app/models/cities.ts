export interface City {
    cityID: number;
    cityName: string;
    latitude: number;
    longitude: number;
    countryCode: string;
    accuweatherKey: string;
    isNew?: boolean
}

export type CitiesResponse = City[]
