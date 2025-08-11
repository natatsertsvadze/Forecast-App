import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CitiesService } from '../cities-list/cities-service/cities.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
// import * as XLSX from 'xlsx'
import * as XLSX from '@e965/xlsx';
import {saveAs} from 'file-saver'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'


// import {provideMomentDateAdapter} from '@angular/material-moment-adapter';


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
  selector: 'app-city-results',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, DragDropModule,
    // NgxMatTimepickerModule,
    ReactiveFormsModule,
    // MatDatepicker,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule, 
    MatNativeDateModule,MatSelectModule,
    MatOptionModule, 
    MatIconModule
],
  templateUrl: './city-results.component.html',
  styleUrls: ['./city-results.component.css'],
})
export class CityResultsComponent implements OnInit {
  date = new FormControl(new Date());
  calendarDate: Date | null = null
  startDate = new Date() 
  



  tempHeader: number | null = null;
  visibilityHeader: number | null = null;
  feelsLikeHeader: number | null = null;
  pressureHeader: number | null = null;
  humidityHeader: number | null = null;
  windSpeedHeader: number | null = null;
  rain1hHeader : number | null = null;
  cloudsAllHeader: number | null = null;
  dewPointHeader: number | null = null;
  dateHeader: number | null = null;
  
  selectedValues: { [key: string]: any[] } = {}
  
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

  isGasDay = false
  cancelBtn = false

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

  groupedCityData: { gasDay: string; entries: CityDataEntry[] }[] = []
groupedByGasDay = false

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

selectedDateTimes: { date: string; hour: number | null; displayDate: string }[] = []

  cityId: number = 0;
  cityName: string = '';
  cityData: CityDataEntry[] = [];
  filteredCityData: CityDataEntry[] = [];
  dropdownVisible = false;
  dateFilterDropdownVisible = false
  uniqueDates: string[] = []
  excludedDates: Set<string> = new Set()
  selectedDates = new Set<string>();
  filteredData: any[] = [] 
originalData: any[] = []
selectedProviderNames: string[] = []
selectedGasDay: string | null = null
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

  constructor(
    private route: ActivatedRoute,
    private citiesService: CitiesService
  ) {}

  getUniqueProviderNames(): string[] {
    const providerNames = this.filteredCityData.map(entry => entry.provider.providerName);
    const uniqueProviderNames = Array.from(new Set(providerNames));
    return uniqueProviderNames;
  }
  
  ngOnInit(): void {
    this.cityId = Number(this.route.snapshot.paramMap.get('cityId'))
    this.fetchCityName()
    this.fetchCityData()
  }
  
  setMonthAndYear(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.date.value || new Date();
    ctrlValue.setMonth(normalizedMonth.getMonth());
    ctrlValue.setFullYear(normalizedMonth.getFullYear());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  

getColumnOptions() {
  const columns = [
    'providerName', 'dataDateTimeUTC', 'temp', 'visibility', 'dewPoint', 
    'feelsLike', 'pressure', 'humidity', 'windSpeed', 'rain1h', 
    'snow1h', 'cloudsAll', 'isForecast', 'gasDay'
  ];

  columns.forEach(col => {
    const values = this.cityData.map(entry => this.getNestedValue(entry, col));
    const unique = Array.from(new Set(values));
    this.selectedValues[col] = [...unique];
  });
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
      return entry[column]
    default:
      return ''
  }
}

applyAllFilters() {
  this.filteredCityData = this.cityData.filter(entry => {
    const isDateSelected = this.selectedDates.size === 0 || this.selectedDates.has(entry.gasDay)

    const matchesColumnFilters = Object.keys(this.selectedValues).every(key => {
      const value = this.getNestedValue(entry, key)
      return this.selectedValues[key]?.includes(value)
    })

    return isDateSelected && matchesColumnFilters
  })
}


applyColumnFilter(column: string) {
  this.filteredCityData = this.cityData.filter(entry => {
    const isDateSelected = this.selectedDates.size === 0 || this.selectedDates.has(entry.gasDay)

    const matchesColumnFilters = Object.keys(this.selectedValues).every(key => {
      const value = this.getNestedValue(entry, key)

      if (key === column) {
        let filterValue: number | null = null
        switch (key) {
          case 'temp':
            filterValue = this.tempHeader
            break;
          case 'visibility':
            filterValue = this.visibilityHeader
            break;
          case 'feelsLike':
            filterValue = this.feelsLikeHeader
            break;
          case 'pressure':
            filterValue = this.pressureHeader
            break;
          case 'humidity':
            filterValue = this.humidityHeader
            break;
          case 'windSpeed':
            filterValue = this.windSpeedHeader
            break;
          case 'rain1h':
            filterValue = this.rain1hHeader
            break;
          case 'cloudsAll':
            filterValue = this.cloudsAllHeader
            break;
          case 'dewPoint':
            filterValue = this.dewPointHeader
            break;
        }

        if (filterValue !== null && entry[key] !== null && entry[key] !== undefined) {
          return entry[key].toString().startsWith(filterValue.toString())
        }
        return true;
      }

      return this.selectedValues[key]?.includes(value)
    })

    return isDateSelected && matchesColumnFilters
  })
}


onDateChange() {
  this.applyDateHeaderFilter()
}

applyDateHeaderFilter() {
  if (this.selectedDateTimes.length === 0) {
    this.filteredCityData = [...this.cityData]
    return;
  }

  this.filteredCityData = this.cityData.filter((entry: CityDataEntry) => {
    const dateTime = new Date(entry.dataDateTimeUTC)

    const entryDateStr = `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1).toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')}`;
    const entryHour = dateTime.getHours()

    return this.selectedDateTimes.some(dt => {
      const dateMatch = dt.date === entryDateStr
      const hourMatch = dt.hour === null || dt.hour === entryHour
      return dateMatch && hourMatch
    })
  })
}

addDateTime() {
  if (this.dateInput && this.timeInput) {
    const [hourStr, minuteStr] = this.timeInput.split(':')
    let hour = parseInt(hourStr, 10)
    const minutes = parseInt(minuteStr, 10)

    const isPM = this.timeInput.includes('PM')
    if (hour < 12 && isPM) {
      hour += 12;
    } else if (hour === 12 && !isPM) {
      hour = 0;
    }

    const dateObj = new Date(this.dateInput)
    const year = dateObj.getFullYear()
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const day = dateObj.getDate().toString().padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`;
    const displayDate = dateObj.toLocaleDateString('en-GB')

    this.selectedDateTimes.push({
      date: formattedDate,
      hour,
      displayDate
    });

    this.applyDateHeaderFilter()
  }

  this.dateInput = ''
  this.timeInput = ''
}


addDateAllHours() {
  if (this.dateInput) {
    const localDate = new Date(this.dateInput)

    const year = localDate.getFullYear()
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0')
    const day = localDate.getDate().toString().padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`; 

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


forceZeroMinutes() {
  if (this.timeInput) {
    const [hour] = this.timeInput.split(':')
    this.timeInput = `${hour.padStart(2, '0')}:00`
  }
}

removeDateTime(index: number) {
  this.selectedDateTimes.splice(index, 1)
  this.applyDateHeaderFilter()
}

clearAllDateTimes() {
  this.selectedDateTimes = []
  this.applyDateHeaderFilter()
}

getUniqueOptions(column: string): any[] {
  return Array.from(
    new Set(
      this.cityData
        .map(entry => this.getNestedValue(entry, column))
        .filter(value => value !== '' && value != null)
    )
  )
}

isOptionSelected(column: string, value: any): boolean {
  return this.selectedValues[column]?.includes(value)
}

toggleOption(column: string, value: any): void {
  const selected = this.selectedValues[column]
  const index = selected.indexOf(value)

  if (index === -1) {
    selected.push(value)
  } else {
    selected.splice(index, 1)
  }

  this.applyAllFilters()
}


  getUniqueValuesFromData(data: any[], field: string) {
    const values = data.map(entry => entry[field.split('.')[0]][field.split('.')[1]])
    const uniqueValues = Array.from(new Set(values));
    return uniqueValues.map(name => ({ name, selected: true }));
  }

  isSelected(providerName: string): boolean {
    return this.selectedProviderNames.includes(providerName)
  }

toggleColumnFilter(column: string) {
  this.activeColumnFilter = this.activeColumnFilter === column ? null : column
}

toggleSelection(providerName: string): void {
  const index = this.selectedProviderNames.indexOf(providerName)
  if (index === -1) {
    this.selectedProviderNames.push(providerName)
  } else {
    this.selectedProviderNames.splice(index, 1)
  }
}

  fetchCityName(): void {
    this.citiesService.getCities().subscribe({
      next: (response) => {
        const city = response.find((city) => city.cityID === this.cityId)
        if (city) {
          this.cityName = city.cityName
        }
      },
      error: (error) => {
        console.error('Error fetching city name:', error);
      },
    });
  }

  fetchCityData(): void {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7)
    const endDate = new Date(now)
    endDate.setDate(now.getDate() + 7)
  
    const startDateTimeUTC = `${startDate.toISOString().split('T')[0]}T00:00:00Z`
    const endDateTimeUTC = `${endDate.toISOString().split('T')[0]}T23:59:59Z`
  
    this.citiesService.getCityData(this.cityId, startDateTimeUTC, endDateTimeUTC).subscribe({
      next: (response) => {
        this.cityData = response
        this.filteredCityData = [...response]
        this.updateUniqueDates()
        this.initializeDateFilter()
        this.selectedProviderNames = this.getUniqueProviderNames()

        this.getColumnOptions()
      },
      error: (error) => {
        console.error('Error fetching city data:', error)
      },
    })
  }

  updateUniqueDates() {
    this.uniqueDates = [...new Set(this.cityData.map(entry => entry.gasDay))]
  }

  initializeDateFilter() {
    this.selectedDates.clear()
    this.uniqueDates.forEach(date => this.selectedDates.add(date))
    this.applyDateFilter()
  }

  toggleDateFilter(date: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked
  
    if (checked) {
      this.selectedDates.add(date)
    } else {
      this.selectedDates.delete(date)
    }
    this.applyDateFilter()
  }
  
  applyDateFilter() {
    this.filteredCityData = this.cityData.filter(entry => {
      const entryDate = entry.gasDay
      const isDateSelected = this.selectedDates.has(entryDate)
  
      const columnFiltersMatch = Object.keys(this.selectedValues).every(key => {
        const value = this.getNestedValue(entry, key)
        return this.selectedValues[key].includes(value)
      });
  
      return isDateSelected && columnFiltersMatch
    });
  }
  

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible
  }

  toggleDateFilterDropdown() {
    this.dateFilterDropdownVisible = !this.dateFilterDropdownVisible
  }



  toggleDateExclusion(date: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked
    if (checked) {
      this.excludedDates.delete(date)
    } else {
      this.excludedDates.add(date)
    }
    this.applyDateFilter()
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

    
    filterData() {
      this.filteredData = this.originalData.filter(item => 
        this.selectedDates.has(item.date)
      )
    }
}
