import { Component, OnInit } from '@angular/core';
import { CitiesService } from './cities-service/cities.service';
import { CitiesResponse, City } from '../models/cities';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import * as XLSX from 'xlsx'
import * as XLSX from '@e965/xlsx';
import {saveAs} from 'file-saver'

interface CityDataEntry {
  cityID: number;
  cityName: string;
  latitude: number;
  longitude: number;
  accuweatherKey: string;
  countryCode: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-cities-list',
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.css'],
})
export class CitiesListComponent implements OnInit {
  cities: City[] = [];
  isModalOpen = false;
  isDeleteModalOpen = false;
  cityIDToDelete: number | null = null;
  cityNameToDelete: string = '';
  isNewCity: boolean =  false;
  dropdownVisible = false;
  editedCity = { cityName: '', latitude: 0, longitude: 0, countryCode: '', accuweatherKey: '' }
  editcityID: number | null = null
  isEditModalOpen = false
  columnsVisibility = {
    cityID: true,
    cityName: true,
    latitude: true,
    longitude: true,
    countryCode: true,
    accuweatherKey: true,
  };
  cityData: CityDataEntry[] = [];
  selectedDates = new Set<string>();
  selectedValues: { [key: string]: any[] } = {}
  filteredCityData: City[] = []
  originalCityData: CityDataEntry[] = []
  


cityIDHeader: number | null = null
cityNameHeader: string | null = ''
latitudeHeader: number | null = null
longitudeHeader: number | null = null
accuWeatherKeyHeader: number | null = null

  activeColumnFilter: string | null = null; 


  newCity = {
    cityName: '',
    latitude: 0,
    longitude: 0,
    countryCode: '',
    accuWeatherKey: '',
  };

  constructor(private citiesService: CitiesService, private router: Router) {}

  ngOnInit(): void {
    this.originalCityData = [];
    this.filteredCityData = [];
  
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCities = localStorage.getItem('cities');
      if (storedCities) {
        this.cities = JSON.parse(storedCities);
        this.originalCityData = this.cities; 
        this.filteredCityData = [...this.originalCityData];
      } else {
        this.citiesService.getCities().subscribe({
          next: (response: CitiesResponse) => {
            this.cities = response;
            this.originalCityData = this.cities.map(city => ({
              cityID: city.cityID,
              cityName: city.cityName,
              latitude: city.latitude,
              longitude: Number(city.longitude),
              countryCode: city.countryCode,
              accuweatherKey: city.accuweatherKey.toString(),
              isNew: city.isNew ?? false
            }));
            this.filteredCityData = [...this.originalCityData];  
            localStorage.setItem('cities', JSON.stringify(this.cities));
          },
          error: (error) => {
            console.error('Error fetching cities:', error);
          },
        });
      }
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  goToCityResults(cityID: number): void {
    this.router.navigate(['/list/results', cityID]);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addCity() {
    if (
      !this.newCity.cityName ||
      !this.newCity.latitude ||
      !this.newCity.longitude ||
      !this.newCity.countryCode
    ) {
      alert('Please fill in all required fields before submitting.');
      return;
    }

    const maxID =
      this.cities.length > 0 ? Math.max(...this.cities.map((c) => c.cityID)) : 0;
    const newID = maxID + 1;

    const city: City = {
      cityID: newID,
      cityName: this.newCity.cityName,
      latitude: this.newCity.latitude,
      longitude: this.newCity.longitude,
      countryCode: this.newCity.countryCode,
      accuweatherKey: this.newCity.accuWeatherKey,
      isNew: true,
    };

    this.cities.push(city);
    this.closeModal();

    localStorage.setItem('cities', JSON.stringify(this.cities));
  }

  openDeleteModal(cityID: number, event: Event) {
    event.stopPropagation()
    this.isDeleteModalOpen = true
    this.cityIDToDelete = cityID
    const cityToDelete = this.cities.find(city => city.cityID === cityID)
    if (cityToDelete) {
      this.cityNameToDelete = cityToDelete.cityName
      this.isNewCity = cityToDelete.isNew ?? false
    }
  }
  
  deleteCity() {
    this.cities = this.cities.filter(city => city.cityID !== this.cityIDToDelete)
    localStorage.setItem('cities', JSON.stringify(this.cities))
    this.closeDeleteModal()
  }
  

  closeDeleteModal() {
    this.isDeleteModalOpen = false
    this.cityIDToDelete = 0
    this.cityNameToDelete = ''
  }

  reordercityIDs() {
    this.cities = this.cities.map((city, index) => ({
      ...city,
      cityID: index + 1,
    }));

    localStorage.setItem('cities', JSON.stringify(this.cities));
  }

  toggleColumnFilter(column: string) {
    this.activeColumnFilter = this.activeColumnFilter === column ? '' : column;
  }
  

  getNestedValue(entry: any, column: string): any {
    switch (column) {
      case 'cityID':
      case 'cityName':
      case 'latitude':
      case 'longitude':
      case 'accuWeatherKey':
        return entry[column];
      default:
        return '';
    }
  }

  applyColumnFilter(column: string) {

    this.filteredCityData = this.originalCityData.filter(entry => {
      let matches = true;
  
      if (this.cityIDHeader !== undefined && this.cityIDHeader !== null) {
        matches = matches && entry.cityID.toString().startsWith(this.cityIDHeader.toString());
      }
  
      if (this.cityNameHeader !== undefined && this.cityNameHeader !== null && this.cityNameHeader !== '') {
        matches = matches && entry.cityName.toLowerCase().startsWith(this.cityNameHeader.toLowerCase());
      }
  
      if (this.latitudeHeader !== undefined && this.latitudeHeader !== null) {
        matches = matches && entry.latitude.toString().startsWith(this.latitudeHeader.toString());
      }
  
      if (this.longitudeHeader !== undefined && this.longitudeHeader !== null) {
        matches = matches && entry.longitude.toString().startsWith(this.longitudeHeader.toString());
      }
  
      if (this.accuWeatherKeyHeader !== undefined && this.accuWeatherKeyHeader !== null) {
        matches = matches && entry.accuweatherKey.toString().startsWith(this.accuWeatherKeyHeader.toString());
      }

      return matches;
    });
  } 

  exportTableToExcel(): void {
    const table = document.getElementsByClassName('save-table-btn');
    if (!table || table.length === 0) return;
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table[0]);  // Assuming the table is the first element with the class
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cities');
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Cities.xlsx');
  }

  openEditModal(city: City, event: Event) {
    event.stopPropagation();
    this.editcityID = city.cityID;
    this.editedCity = { ...city, accuweatherKey: city.accuweatherKey }; 
    this.isEditModalOpen = true;
  }
  
  saveEditedCity() {
    if (this.editcityID === null) {
      console.error('editcityID is null, cannot save edited city');
      return;
    }
  
    const index = this.cities.findIndex(city => city.cityID === this.editcityID);
    if (index !== -1) {
     
      this.cities[index] = { ...this.editedCity, cityID: this.editcityID, isNew: true };
      localStorage.setItem('cities', JSON.stringify(this.cities));
    }
    
    this.closeEditModal(); 
  }
  
  closeEditModal() {
    this.isEditModalOpen = false
    this.editcityID = null
  }
}
