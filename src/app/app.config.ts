import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http"
import { APP_BASE_HREF } from '@angular/common'  
import { routes } from './app.routes'
import { provideClientHydration } from '@angular/platform-browser'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: APP_BASE_HREF, useValue: '/Forecast-App/' }
  ]
}
