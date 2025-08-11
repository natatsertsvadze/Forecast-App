// app.routes.server.ts
import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender }, // Match root path '/'
  { path: 'list', renderMode: RenderMode.Prerender }, // Match 'list' path
  { path: 'filter', renderMode: RenderMode.Prerender }, // Match 'filter' path
  {
    path: 'list/results/:cityId',
    renderMode: RenderMode.Prerender // Match 'list/results/:cityId' with prerendering
  }
];
