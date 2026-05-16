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

interface CredVariant { id: number; name: string; icon: string; color: string; }

@Component({
  selector: 'app-create-credentials-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './create-credentials-dialog.component.html',
  styleUrl: './create-credentials-dialog.component.scss'
})
export class CreateCredentialsDialogComponent {
  variants: CredVariant[] = [
    { id: 23, name: 'Bank Credentials',   icon: 'account_balance', color: '#1565c0' },
    { id: 24, name: 'App / Web',          icon: 'web',             color: '#6a1b9a' },
  ];
  selected: CredVariant = this.variants[1];

  name = '';        // description / site name
  website = '';
  username = '';
  password = '';
  email = '';
  mobile = '';
  pin = '';
  showPwd = false;
  saving = false;

  // ItemTypeId=5
  constructor(
    public dialogRef: MatDialogRef<CreateCredentialsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  get canSave() { return this.name.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    this.itemsService.createItem({
      userId: this.data.userId,
      itemTypeId: 5,
      variantId: this.selected.id,
      description: this.name.trim(),
      credUsername: this.username.trim() || undefined,
      credPassword: this.password || undefined,
      credEmail: this.email.trim() || undefined,
      credPin: this.pin || undefined,
      credMobile: this.mobile.trim() || undefined,
      credWebsite: this.website.trim() || undefined,
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Credentials saved!', '', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(res.message || 'Failed to save', 'Close', { duration: 5000 });
        }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
