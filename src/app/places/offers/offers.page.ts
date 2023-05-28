import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonItemSliding, IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { OfferItemComponent } from '../offers/offer-item/offer-item.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    OfferItemComponent,
  ],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  isLoading: boolean = false;
  private placesSub!: Subscription;

  constructor(private placeService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places) => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placeService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string | undefined, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    console.log(`Editing item: ${offerId}`);
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
