import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { format } from 'date-fns';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LocationPickerComponent } from '../../../shared/pickers/location-picker/location-picker.component';
import { ImagePickerComponent } from '../../../shared/pickers/image-picker/image-picker.component';
import { PlaceLocation } from '../../location.model';
import { base64toBlob } from '../../../../assets/utils/base64ToBlob';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LocationPickerComponent,
    ImagePickerComponent,
  ],
})
export class NewOfferPage implements OnInit {
  form!: FormGroup;
  year = format(new Date(), 'yyyy');
  month = format(new Date(), 'MM');
  day = format(new Date(), 'dd');
  time = format(new Date(), 'HH:mm');
  currentDate = `${this.year}-${this.month}-${this.day}T${this.time}`;
  maxDate = `${this.year}-12-31T23:59`;
  placeLocation: any;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null),
    });
  }

  onLocationPicked(location: PlaceLocation) {
    // this.placeLocation = location;
    this.form.patchValue({ location: location });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData, 'image/jpeg');
        console.log(imageFile);
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image')!.value) return;
    this.loadingCtrl
      .create({
        message: 'Creating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.placesService
          .uploadImage(this.form.get('image')?.value)
          .pipe(
            switchMap((uploadRes) => {
              return this.placesService.addPlace(
                this.form.value.title,
                this.form.value.description,
                this.form.value.price,
                new Date(this.form.value.dateFrom),
                new Date(this.form.value.dateTo),
                this.form.value.location,
                uploadRes.imageUrl
              );
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
