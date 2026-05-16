import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-create-contact-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatStepperModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './create-contact-dialog.component.html',
  styleUrl: './create-contact-dialog.component.scss'
})
export class CreateContactDialogComponent {
  stepIndex = 0;

  // Step 1 – Basic
  contactName = '';
  isPersonal = true;
  isEmergency = false;

  // Step 2 – Phone & Email (optional)
  phone = '';
  phoneIsWork = false;
  email = '';
  emailIsWork = false;

  saving = false;

  // Variant 13 = Contact, ItemTypeId = 3
  constructor(
    public dialogRef: MatDialogRef<CreateContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  get step1Complete() { return this.contactName.trim().length > 0; }

  save() {
    if (!this.step1Complete) return;
    this.saving = true;
    this.itemsService.createItem({
      userId: this.data.userId,
      itemTypeId: 3,
      variantId: 13,
      description: this.contactName.trim(),
      contactIsPersonal: this.isPersonal,
      contactIsEmergency: this.isEmergency,
      contactPhone: this.phone.trim() || undefined,
      contactPhoneIsWork: this.phoneIsWork,
      contactPhoneIsPrimary: true,
      contactEmail: this.email.trim() || undefined,
      contactEmailIsWork: this.emailIsWork
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Contact saved!', '', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(res.message || 'Failed to save', 'Close', { duration: 5000 });
        }
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Could not connect to API.', 'Close', { duration: 5000 });
      }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
