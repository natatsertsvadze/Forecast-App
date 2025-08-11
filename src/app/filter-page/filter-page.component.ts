import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { DatePipe } from "@angular/common";
import { CitiesService } from "../cities-list/cities-service/cities.service";
// import * as XLSX from 'xlsx'
import * as XLSX from '@e965/xlsx';

import {saveAs} from 'file-saver'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon'

interface CityDataEntry {
  dataDateTimeUTC: string;
  dewPoint: number;
  feelsLike: number;
  gasDay: string;
  humidity: number;
  rain1h: number;
  snow1h: number;
  temp: number;
  visibility: number;
  windSpeed: number;
  provider: {
    providerName: string;
  };
  city: {
    cityName: string;
  };
  pressure: number;
  cloudsAll: number;
  isForecast: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-filter-page',
  imports: [FormsModule, CommonModule, DragDropModule, 
    // NgxMatTimepickerModule,
    MatFormFieldModule,
    MatInputModule, 
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatIconModule
    
  ],
  templateUrl: './filter-page.component.html',
  styleUrls: ['./filter-page.component.css'],
  providers: [DatePipe]
})
export class FilterPageComponent implements OnInit {  
  selectedProviderNames: string[] = []

  selectedDates = new Set<string>();

  filteredCityData: CityDataEntry[] = [];
  

  providerNameOptions: any[] = [];
  cityNameOptions: any[] = [];
  dataDateTimeUTCOptions: any[] = []
  tempOptions: any[] = []
  visibilityOptions: any[] = []
  dewPointOptions: any[] = []
  feelsLikeOptions: any[] = []
  pressureOptions: any[] = []
  humidityOptions: any[] = []
  windSpeedOptions: any[] = []
  rain1hOptions: any[] = []
  snow1hOptions: any[] = []
  cloudsAllOptions: any[] = []
  isForecastOptions: any[] = []
  gasDayOptions: any[] = []

  activeColumnFilter: string | null = null; 
providerFilter: string = '';
cityNameFilter: string = '';
dateFilter: string = '';
tempFilter: string = '';
visibilityFilter: string = '';
dewPointFilter: string = '';
feelsLikeFilter: string = '';
pressureFilter: string = '';
humidityFilter: string = '';
windSpeedFilter: string = '';
rain1hFilter: string = '';
snow1hFilter: string = '';
cloudsAllFilter: string = '';
isForecastFilter: string = '';
gasDayFilter: string = '';
dateInput: string = ''
timeInput: string = ''
selectedTimes: { date: string; time: string }[] = [];

timeOptions: string[] = [
  '00:00',  '01:00',  '02:00', 
  '03:00',  '04:00',  '05:00', 
  '06:00',  '07:00',  '08:00', 
  '09:00',  '10:00',  '11:00', 
  '12:00',  '13:00',  '14:00', 
  '15:00',  '16:00',  '17:00', 
  '18:00',  '19:00',  '20:00', 
  '21:00',  '22:00',  '23:00',
];
selectedDateTimes: { date: string; hour: number | null; displayDate: string }[] = []
  selectedValues: { [key: string]: any[] } = {}
  selectedOptions: { [key: string]: Set<string> } = {};
  inputFilters: { [column: string]: { [option: string]: string } } = {};
  checkboxStates: { [column: string]: { [value: string]: boolean } } = {};

  numericFilters: { [key: string]: number | null } = {
    temp: null,
    windSpeed: null,
    humidity: null,
    visibility: null,
    dewPoint: null,
    feelsLike: null, 
    pressure: null, 
    cloudsAll: null,
  }
  
  selectedTempOptions = new Set<number>()

  isGasDay = false
  cancelBtn = false  
  selectedGasDay: string | null = null
  isModalOpen = true;
  cityInput = "";
  startDateInput: string = '';
  endDateInput: string = '';
  cityData: any[] = []; 
  cityName: string = '';
  showDropdown = false;
  dropdownVisible = false;
  filteredCities: any[] = []
  columnsVisibility = {
    dataDateTimeUTC: true,
    dewPoint: true,
    feelsLike: true,
    gasDay: true,
    humidity: true,
    rain1h: true,
    snow1h: true,
    temp: true,
    visibility: true,
    windSpeed: true,
    providerName: true,
    cityName: true,
    pressure: true,
    isForecast: true,
    cloudsAll: true,
  };
  columnsToFilter = [
    'providerName',
    'dataDateTimeUTC',
    'rain1h',
    'snow1h',
    'isForecast',
    'gasDay'
  ]
  

  columnHeaders = [
    'dataDateTimeUTC', 'dewPoint', 'feelsLike', 'gasDay', 'humidity', 
    'rain1h', 'snow1h', 'temp', 'visibility', 'windSpeed', 'pressure',
    'cityName', 'providerName', 'cloudsAll', 'isForecast'
  ];

  constructor(private citiesService: CitiesService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }

  getUniqueProviderNames(): string[] {
    const providerNames = this.filteredCityData.map(entry => entry.provider.providerName)
    const uniqueProviderNames = Array.from(new Set(providerNames))
    return uniqueProviderNames
  }

  ngOnInit() {
    // Initialize the selected date inputs and other configurations
    this.startDateInput = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.endDateInput = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;

    // Fetching city data as usual
    this.citiesService.getCities().subscribe({
      next: cities => {
        this.cityData = cities;
        this.selectedProviderNames = this.getUniqueProviderNames();
        this.getColumnOptions();
        this.columnsToFilter.forEach(col => this.initializeCheckboxStates(col));
        this.applyAllFilters();
      },
      error: err => console.error('Error fetching cities:', err)
    });
  }

  getColumnOptions() {
    const columns = [
      'providerName', 'dataDateTimeUTC', 'temp', 'visibility', 'dewPoint', 
      'feelsLike', 'pressure', 'humidity', 'windSpeed', 'rain1h', 
      'snow1h', 'cloudsAll', 'isForecast', 'gasDay'
    ];
  
    columns.forEach(col => {
      const values = this.getUniqueValuesForColumn(col)
      this.checkboxStates[col] = {}
      values.forEach(value => {
        this.checkboxStates[col][value] = true
      });
    });
  }

  getUniqueValuesForColumn(column: string): string[] {
    const uniqueValues = new Set<string>()
    this.filteredCityData.forEach(item => {
      const value = item[column]
      if (value !== undefined && value !== null) {
        uniqueValues.add(String(value))
      }
    })
    return Array.from(uniqueValues)
  }

  toggleColumnFilter(column: string) {
    this.activeColumnFilter = this.activeColumnFilter === column ? null : column;
  }

  onDragStart(columnName: string) {
    this.selectedGasDay = columnName 
  }

  groupByGasDay(event: CdkDragDrop<any>) {
    this.isGasDay = true
    this.cancelBtn = true
  }

  cancelGasDay() {
    this.isGasDay = false
    this.cancelBtn = false
  }

  getNestedValue(entry: any, column: string): any {
    switch (column) {
      case 'providerName':
        return entry.provider?.providerName;
      case 'cityName':
        return entry.city?.cityName;
      case 'dataDateTimeUTC':
      case 'temp':
      case 'visibility':
      case 'dewPoint':
      case 'feelsLike':
      case 'pressure':
      case 'humidity':
      case 'windSpeed':
      case 'rain1h':
      case 'snow1h':
      case 'cloudsAll':
      case 'isForecast':
      case 'gasDay':
        return entry[column];
      default:
        return ''
    }
  }
  toggleSelection(providerName: string): void {
    const index = this.selectedProviderNames.indexOf(providerName);
    if (index === -1) {
      this.selectedProviderNames.push(providerName)
    } else {
      this.selectedProviderNames.splice(index, 1)
    }
  }

  onDateChange() {
    this.applyDateHeaderFilter()
  }
  
  applyDateHeaderFilter() {
    if (this.selectedTimes.length === 0) {
      this.filteredCityData = [...this.cityData];
      return;
    }

    this.filteredCityData = this.cityData.filter((entry: CityDataEntry) => {
      const dateTime = new Date(entry.dataDateTimeUTC);
      const entryDate = `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1).toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')}`;
      const entryTime = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;

      return this.selectedTimes.some(dt => {
        return dt.date === entryDate && dt.time === entryTime;
      });
    });
  }

  
  addDateTime() {
    if (this.dateInput && this.timeInput) {
      const alreadyExists = this.selectedTimes.some(dt =>
        dt.date === this.dateInput && dt.time === this.timeInput
      );

      if (!alreadyExists) {
        this.selectedTimes.push({ date: this.dateInput, time: this.timeInput });
        this.applyDateHeaderFilter();
      }
    }
  }

  addDateAllHours() {
    if (this.dateInput) {
      const localDate = new Date(this.dateInput);
  
      const year = localDate.getFullYear();
      const month = (localDate.getMonth() + 1).toString().padStart(2, '0')
      const day = localDate.getDate().toString().padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
  
      const displayDate = localDate.toLocaleDateString('en-CA')
  
      for (let hour = 0; hour < 24; hour++) {
        const exists = this.selectedDateTimes.some(dt => dt.date === formattedDate && dt.hour === hour)
        if (!exists) {
          this.selectedDateTimes.push({ date: formattedDate, displayDate, hour })
        }
      }
  
      this.applyDateHeaderFilter()
      this.dateInput = ''
      this.timeInput = ''
    }
  }
  
  removeDateTime(index: number) {
    this.selectedTimes.splice(index, 1);
    this.applyDateHeaderFilter();
  }
  
  clearAllDateTimes() {
    this.selectedTimes = [];
    this.applyDateHeaderFilter();
  }

  getEntryValue(entry: any, column: string): string {
    if (column === 'providerName') return entry.provider?.providerName ?? ''
    if (column === 'cityName') return entry.city?.cityName ?? ''
    return entry[column]?.toString() ?? ''
  }

  applyAllFilters() {
    this.filteredCityData = this.cityData.filter(entry => {
      const dateMatch = this.selectedDates.size === 0 || this.selectedDates.has(entry.gasDay);

      const timeMatch = this.selectedTimes.length === 0 || this.selectedTimes.some(
        dt => dt.date === entry.dataDateTimeUTC.split('T')[0] && dt.time === entry.dataDateTimeUTC.split('T')[1].split('.')[0]
      );

      const checkboxMatch = this.columnsToFilter.every(column => {
        const value = this.getEntryValue(entry, column);
        const checkedMap = this.checkboxStates[column];
        return !checkedMap || checkedMap[value] !== false;
      });

      const numericMatch = Object.keys(this.numericFilters).every(key => {
        const filterValue = this.numericFilters[key];
        if (filterValue !== null && !isNaN(filterValue)) {
          const typed = String(filterValue);
          const actual = String(entry[key]);
          return actual.startsWith(typed);
        }
        return true;
      });

      return checkboxMatch && dateMatch && timeMatch && numericMatch;
    });
  }

  onDateCheckboxChange(date: string, checked: boolean) {
    if (checked) {
      this.selectedDates.add(date);
    } else {
      this.selectedDates.delete(date);
    }
    this.applyAllFilters();
  }

  applyDateFilter() {
    this.filteredCityData = this.cityData.filter(entry => {
      const entryDate = entry.gasDay
      const isDateSelected = this.selectedDates.has(entryDate)
      
      const columnFiltersMatch = Object.keys(this.selectedValues).every(key => {
        const value = this.getNestedValue(entry, key)
        return this.selectedValues[key].includes(value)
      });
  
      return isDateSelected && columnFiltersMatch;
    });
  }
  
  isSelected(providerName: string): boolean {
    return this.selectedProviderNames.includes(providerName);
  }

  getUniqueOptions(column: string): string[] {
    const options = new Set<string>()
  
    for (const entry of this.cityData) {
      const value = this.getEntryValue(entry, column)
      if (value !== undefined && value.trim() !== '') {
        options.add(value)
      }
    }
  
    return Array.from(options)
  }

  onCheckboxChange(column: string, value: string, checked: boolean) {
    if (!this.checkboxStates[column]) {
      this.checkboxStates[column] = {}
    }
  
    this.checkboxStates[column][value] = checked
    this.applyAllFilters()
  }

onNumberFilterChange(column: string) {
  const value = this.numericFilters[column]
  this.applyAllFilters()
}

  initializeCheckboxStates(column: string) {
    const options = this.getUniqueOptions(column)
    if (!this.checkboxStates[column]) {
      this.checkboxStates[column] = {}
    }
  
    options.forEach(option => {
      if (this.checkboxStates[column][option] === undefined) {
        this.checkboxStates[column][option] = true
      }
    })
  }

  toggleOption(column: string, option: string) {
    this.checkboxStates[column][option] = !this.checkboxStates[column][option]
    this.applyAllFilters()
  }

  isOptionSelected(column: string, value: any): boolean {
    return this.selectedValues[column]?.includes(value)
  }
  
  groupDataByHour(data: any[]): any[] {
    const grouped = new Map<string, any>()

    data.forEach(entry => {
      const date = new Date(entry.dataDateTimeUTC)
      
      if (!isNaN(date.getTime())) {
        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss') || '';
        
        if (formattedDate && !grouped.has(formattedDate)) {
          grouped.set(formattedDate, entry);
        }
      }
    });
  
    return Array.from(grouped.values())
  }
  
  arrowDropdown(show: boolean) {
    this.showDropdown = show;
  }

  onBlur() {
    setTimeout(() => this.arrowDropdown(false), 200);
  }

  filterCities() {
    const input = this.cityInput.toLowerCase()
    this.filteredCityData = this.cityData.filter(city =>
      city.cityName.toLowerCase().includes(input)
    )
  }

  checkCity() {
    this.cityName = this.cityInput?.trim()
    this.closeModal()
  
    const formattedStartDate = this.formatDateWithTime(this.startDateInput, '00:00:00')
  
    const actualEnd = new Date(this.endDateInput)
    actualEnd.setDate(actualEnd.getDate() - 1)
  
    const actualEndDateString = actualEnd.toISOString().split('T')[0]
  
    const formattedEndDate = this.formatDateWithTime(actualEndDateString, '23:59:59')
  
    this.citiesService.getCityData(1, formattedStartDate, formattedEndDate).subscribe({
      next: (data: CityDataEntry[]) => {
        const start = new Date(formattedStartDate).getTime()
        const end = new Date(formattedEndDate).getTime()
  
        this.filteredCityData = data.filter((item: CityDataEntry) => {
          const itemDate = new Date(item.dataDateTimeUTC).getTime()
          return itemDate >= start && itemDate <= end
        })
  
        this.cityData = this.filteredCityData
  
        this.getColumnOptions()
        this.columnsToFilter.forEach(col => this.initializeCheckboxStates(col))
        this.applyAllFilters()
        this.cdRef.detectChanges()
      },
      error: err => console.error('Error:', err)
    })
  }

  formatDateWithTime(date: string, time: string): string {
    const formattedDate = new Date(date)
    const year = formattedDate.getFullYear()
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0')
    const day = String(formattedDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day} ${time}`
  }
  
  closeModal() {
    this.isModalOpen = false
    this.showDropdown = false
    this.cityInput = ''
  }

  preventEventPropagation(event: MouseEvent) {
    event.stopPropagation()
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible
  }

  openModal() {
    this.isModalOpen = true
  
    this.cityInput = ''
    this.showDropdown = false
    this.citiesService.getCities().subscribe({
      next: cities => {
        this.cityData = cities
        // this.showDropdown = true
      },
      error: err => {
        console.error('Error fetching cities:', err)
      }
    });
  }

  selectCity(cityName: string) {
    this.cityInput = cityName
    this.showDropdown = false
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
  
}