import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { CitiesResponse } from "../../models/cities";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private apiUrl = 'https://services.ggtc.ge/dbapi'

  constructor(private http: HttpClient) { }

  getCities():Observable<CitiesResponse>{
    return this.http.get<CitiesResponse>(`${this.apiUrl}/weatherapi/Cities`)
  }

  addCity(city: { cityName: string, latitude: number, longitude: number, countryCode: string, accuWeatherKey: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/weatherapi/Cities`, city)
  }

  deleteCity(cityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/weatherapi/Cities/${cityId}`);
  }
  getCityData(cityId: number, startDateTimeUTC: string, endDateTimeUTC: string) {
    const params = new HttpParams()
  .set('cityID', cityId.toString())  // Ensure this matches the API's expected parameter name
  .set('startDateTimeUTC', startDateTimeUTC)
  .set('endDateTimeUTC', endDateTimeUTC);

  
    return this.http.get<any>(`${this.apiUrl}/weatherapi/WeatherData/filter`, { params })
  }

  
}
