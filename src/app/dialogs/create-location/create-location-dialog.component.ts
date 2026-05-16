import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-create-location-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './create-location-dialog.component.html',
  styleUrl: './create-location-dialog.component.scss'
})
export class CreateLocationDialogComponent {
  // Variant toggle: 30 = Location (with coords), 35 = Address (structured)
  variantId = 30;

  name = '';
  // Location fields
  mapsLink = '';
  latitude = '';
  longitude = '';
  directions = '';
  keywords = '';
  // Address fields
  houseFlat = '';
  building = '';
  area = '';
  street = '';
  city = '';
  state = '';
  postalCode = '';
  country = 'India';

  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  get canSave() { return this.name.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;

    const lat = this.latitude ? parseFloat(this.latitude) : undefined;
    const lng = this.longitude ? parseFloat(this.longitude) : undefined;

    this.itemsService.createItem({
      userId: this.data.userId,
      itemTypeId: 9,
      variantId: this.variantId,
      description: this.name.trim(),
      // Location
      locationMapsLink: this.mapsLink.trim() || undefined,
      locationLatitude: lat,
      locationLongitude: lng,
      locationDirections: this.directions.trim() || undefined,
      locationKeywords: this.keywords.trim() || undefined,
      // Address
      addressHouseFlat: this.houseFlat.trim() || undefined,
      addressBuilding: this.building.trim() || undefined,
      addressArea: this.area.trim() || undefined,
      addressStreet: this.street.trim() || undefined,
      addressCity: this.city.trim() || undefined,
      addressState: this.state.trim() || undefined,
      addressPostalCode: this.postalCode.trim() || undefined,
      addressCountry: this.country.trim() || undefined,
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Location saved!', '', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(res.message || 'Failed', 'Close', { duration: 5000 });
        }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
