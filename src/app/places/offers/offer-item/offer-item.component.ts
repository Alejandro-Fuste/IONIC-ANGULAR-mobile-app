import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Place } from '../../places.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class OfferItemComponent implements OnInit {
  @Input() offer!: Place;

  constructor() {}

  ngOnInit() {}
}
