import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { 
    path: '', 
    renderMode: RenderMode.Prerender 
  },
  { 
    path: 'list', 
    renderMode: RenderMode.Prerender 
  },
  { 
    path: 'filter', 
    renderMode: RenderMode.Prerender 
  },
  { 
    path: 'list/results/:cityId', 
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Example of fetching data or returning static values
      const params = [
        { cityId: '1' },
        { cityId: '2' },
        { cityId: '3' },
            {"cityId": "4"},
            {"cityId": "5"},
            {"cityId": "6"},
            {"cityId": "7"},
            {"cityId": "8"},
            {"cityId": "9"},
            {"cityId": "10"},
            {"cityId": "11"},
            {"cityId": "12"},
            {"cityId": "13"},
            {"cityId": "14"},
            {"cityId": "15"},
            {"cityId": "16"},
            {"cityId": "17"},
            {"cityId": "18"},
            {"cityId": "19"},
            {"cityId": "20"},
            {"cityId": "21"},
            {"cityId": "22"},
            {"cityId": "23"},
            {"cityId": "24"},
            {"cityId": "25"},
            {"cityId": "26"},
            {"cityId": "27"},
            {"cityId": "28"},
            {"cityId": "29"},
            {"cityId": "30"},
            {"cityId": "31"},
            {"cityId": "32"},
            {"cityId": "33"},
            {"cityId": "34"},
            {"cityId": "35"},
            {"cityId": "36"},
            {"cityId": "37"},
            {"cityId": "38"},
            {"cityId": "39"},
            {"cityId": "40"},
            {"cityId": "41"},
            {"cityId": "42"},
            {"cityId": "43"},
            {"cityId": "44"},
            {"cityId": "45"},
            {"cityId": "46"},
            {"cityId": "47"},
            {"cityId": "48"},
            {"cityId": "49"},
            {"cityId": "50"},
            {"cityId": "51"},
            {"cityId": "52"},
            {"cityId": "53"},
            {"cityId": "54"},
            {"cityId": "55"},
            {"cityId": "56"},
            {"cityId": "57"},
            {"cityId": "58"},
            {"cityId": "59"},
            {"cityId": "60"},
            {"cityId": "61"},
            {"cityId": "62"},
            {"cityId": "63"}
          
      ];

      // The function must return a Promise that resolves to the array of objects
      return Promise.resolve(params); // Resolving the array
    }
  }
];
