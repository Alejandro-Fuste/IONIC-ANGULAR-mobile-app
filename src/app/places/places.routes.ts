import { Routes } from '@angular/router';
import { PlacesPage } from './places.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      {
        path: 'discover',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./discover/discover.page').then((m) => m.DiscoverPage),
          },
          {
            path: ':placeId',
            loadComponent: () =>
              import('./discover/place-detail/place-detail.page').then(
                (m) => m.PlaceDetailPage
              ),
          },
        ],
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./offers/offers.page').then((m) => m.OffersPage),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./offers/new-offer/new-offer.page').then(
                (m) => m.NewOfferPage
              ),
          },
          {
            path: 'edit/:placeId',
            loadComponent: () =>
              import('./offers/edit-offer/edit-offer.page').then(
                (m) => m.EditOfferPage
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'places/tabs/discover',
    pathMatch: 'full',
  },
];
