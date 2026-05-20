import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {
  ItemsService, ItemModel, ItemDetailModel, UpdateItemRequest
} from '../../services/items.service';

@Component({
  selector: 'app-item-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule, MatDividerModule,
  ],
  templateUrl: './item-detail-dialog.component.html',
  styleUrl:    './item-detail-dialog.component.scss',
})
export class ItemDetailDialogComponent implements OnInit {

  loading  = true;
  saving   = false;
  deleting = false;
  mode: 'view' | 'edit' | 'delete' = 'view';

  detail: ItemDetailModel | null = null;

  // ── common ─────────────────────────────────────────────────────────────────
  description = '';
  isActive    = true;

  // ── Note / Knowledge ───────────────────────────────────────────────────────
  noteTitle   = '';
  noteContent = '';

  // ── HyperLink ──────────────────────────────────────────────────────────────
  hyperlinkUrl         = '';
  hyperlinkDescription = '';

  // ── Contact ────────────────────────────────────────────────────────────────
  contactIsPersonal  = false;
  contactIsEmergency = false;
  contactPhone       = '';
  contactEmail       = '';

  // ── Credentials ────────────────────────────────────────────────────────────
  credUsername = '';
  credPassword = '';
  credEmail    = '';
  credPin      = '';
  credMobile   = '';
  credWebsite  = '';
  showPassword = false;
  showPin      = false;

  // ── Entity ─────────────────────────────────────────────────────────────────
  entityWebsiteUrl        = '';
  entityAvailabilityHours = '';

  // ── Location (variant 30) ──────────────────────────────────────────────────
  locationMapsLink  = '';
  locationLatitude: number | null  = null;
  locationLongitude: number | null = null;
  locationDirections = '';
  locationKeywords   = '';

  // ── Address (variant 35) ───────────────────────────────────────────────────
  addressHouseFlat  = '';
  addressBuilding   = '';
  addressArea       = '';
  addressStreet     = '';
  addressCity       = '';
  addressState      = '';
  addressPostalCode = '';
  addressCountry    = '';

  // ── Activity meeting fields (editable) ─────────────────────────────────────
  meetingPlatform  = '';
  meetingLink      = '';
  meetingIdNumber  = '';
  meetingPassword  = '';

  constructor(
    public  dialogRef: MatDialogRef<ItemDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; item: ItemModel },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.itemsService.getItem(this.data.userId, this.data.item.itemId).subscribe({
      next: res => {
        const d = (res.success && res.item) ? res.item : ({ ...this.data.item } as ItemDetailModel);
        this.detail = d;
        this.populateFields(d);
        this.loading = false;
      },
      error: () => {
        // Graceful fallback — show what we have from the list
        this.detail = { ...this.data.item } as ItemDetailModel;
        this.populateFields(this.detail);
        this.loading = false;
      },
    });
  }

  // ── Field population ────────────────────────────────────────────────────────
  populateFields(d: ItemDetailModel) {
    this.description = d.description || '';
    this.isActive    = d.isActive ?? true;

    this.noteTitle   = d.noteTitle   || '';
    this.noteContent = d.noteContent || '';

    this.hyperlinkUrl         = d.hyperlinkUrl         || '';
    this.hyperlinkDescription = d.hyperlinkDescription || '';

    this.contactIsPersonal  = d.contactIsPersonal  ?? false;
    this.contactIsEmergency = d.contactIsEmergency ?? false;
    this.contactPhone = d.contactPhone || '';
    this.contactEmail = d.contactEmail || '';

    this.credUsername = d.credUsername || '';
    this.credPassword = d.credPassword || '';
    this.credEmail    = d.credEmail    || '';
    this.credPin      = d.credPin      || '';
    this.credMobile   = d.credMobile   || '';
    this.credWebsite  = d.credWebsite  || '';

    this.entityWebsiteUrl        = d.entityWebsiteUrl        || '';
    this.entityAvailabilityHours = d.entityAvailabilityHours || '';

    this.locationMapsLink   = d.locationMapsLink   || '';
    this.locationLatitude   = d.locationLatitude   ?? null;
    this.locationLongitude  = d.locationLongitude  ?? null;
    this.locationDirections = d.locationDirections || '';
    this.locationKeywords   = d.locationKeywords   || '';

    this.addressHouseFlat  = d.addressHouseFlat  || '';
    this.addressBuilding   = d.addressBuilding   || '';
    this.addressArea       = d.addressArea       || '';
    this.addressStreet     = d.addressStreet     || '';
    this.addressCity       = d.addressCity       || '';
    this.addressState      = d.addressState      || '';
    this.addressPostalCode = d.addressPostalCode || '';
    this.addressCountry    = d.addressCountry    || '';

    this.meetingPlatform = d.meetingPlatform || '';
    this.meetingLink     = d.meetingLink     || '';
    this.meetingIdNumber = d.meetingIdNumber || '';
    this.meetingPassword = d.meetingPassword || '';
  }

  // ── Mode helpers ────────────────────────────────────────────────────────────
  enterEditMode() { this.mode = 'edit'; }

  cancelEdit() {
    if (this.detail) this.populateFields(this.detail);
    this.mode = 'view';
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  save() {
    if (!this.detail) return;
    this.saving = true;

    const req: UpdateItemRequest = {
      itemId:     this.detail.itemId,
      userId:     this.data.userId,
      itemTypeId: this.detail.itemTypeId!,
      variantId:  this.detail.variantId!,
      description: this.description.trim(),
      isActive:   this.isActive,
      // Note / Knowledge
      noteTitle:   this.noteTitle   || undefined,
      noteContent: this.noteContent || undefined,
      // HyperLink
      hyperlinkUrl:         this.hyperlinkUrl         || undefined,
      hyperlinkDescription: this.hyperlinkDescription || undefined,
      // Contact
      contactIsPersonal:  this.contactIsPersonal,
      contactIsEmergency: this.contactIsEmergency,
      contactPhone: this.contactPhone || undefined,
      contactEmail: this.contactEmail || undefined,
      // Credentials
      credUsername: this.credUsername || undefined,
      credPassword: this.credPassword || undefined,
      credEmail:    this.credEmail    || undefined,
      credPin:      this.credPin      || undefined,
      credMobile:   this.credMobile   || undefined,
      credWebsite:  this.credWebsite  || undefined,
      // Entity
      entityWebsiteUrl:        this.entityWebsiteUrl        || undefined,
      entityAvailabilityHours: this.entityAvailabilityHours || undefined,
      // Location
      locationMapsLink:   this.locationMapsLink   || undefined,
      locationLatitude:   this.locationLatitude   ?? undefined,
      locationLongitude:  this.locationLongitude  ?? undefined,
      locationDirections: this.locationDirections || undefined,
      locationKeywords:   this.locationKeywords   || undefined,
      // Address
      addressHouseFlat:  this.addressHouseFlat  || undefined,
      addressBuilding:   this.addressBuilding   || undefined,
      addressArea:       this.addressArea       || undefined,
      addressStreet:     this.addressStreet     || undefined,
      addressCity:       this.addressCity       || undefined,
      addressState:      this.addressState      || undefined,
      addressPostalCode: this.addressPostalCode || undefined,
      addressCountry:    this.addressCountry    || undefined,
      // Activity meeting
      meetingPlatform: this.meetingPlatform || undefined,
      meetingLink:     this.meetingLink     || undefined,
      meetingIdNumber: this.meetingIdNumber || undefined,
      meetingPassword: this.meetingPassword || undefined,
    };

    this.itemsService.updateItem(req).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          // Refresh local detail so view mode shows updated values
          this.detail = { ...this.detail!, ...req, description: req.description };
          this.mode = 'view';
          this.snackBar.open('Changes saved!', '', { duration: 2500 });
          window.dispatchEvent(new Event('dclutter:item-updated'));
        } else {
          this.snackBar.open(res.message || 'Failed to save', 'Close', { duration: 5000 });
        }
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Could not connect to API.', 'Close', { duration: 5000 });
      },
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  confirmDelete() { this.mode = 'delete'; }
  cancelDelete()  { this.mode = 'view';   }

  doDelete() {
    if (!this.detail) return;
    this.deleting = true;
    this.itemsService.deleteItem(this.data.userId, this.detail.itemId).subscribe({
      next: res => {
        this.deleting = false;
        if (res.success) {
          this.snackBar.open('Item deleted.', '', { duration: 2500 });
          window.dispatchEvent(new Event('dclutter:item-deleted'));
          this.dialogRef.close({ deleted: true });
        } else {
          this.snackBar.open(res.message || 'Failed to delete', 'Close', { duration: 5000 });
          this.mode = 'view';
        }
      },
      error: () => {
        this.deleting = false;
        this.snackBar.open('Could not connect to API.', 'Close', { duration: 5000 });
        this.mode = 'view';
      },
    });
  }

  // ── Computed helpers ────────────────────────────────────────────────────────
  get dialogTitle(): string {
    return this.detail?.shortDescription || this.detail?.description || `Item #${this.data.item.itemId}`;
  }

  get typeName(): string       { return this.data.item.itemTypeName || ''; }
  get typeId():   number | null { return this.data.item.itemTypeId; }
  get variantId(): number | undefined { return this.detail?.variantId; }

  // variant 35 = Address, 30 = Location
  get isAddress(): boolean { return this.variantId === 35; }

  typeIcon(name: string): string {
    const m: Record<string, string> = {
      Activity:        'bolt',
      WorkUnit:        'task_alt',
      Contact:         'person',
      Document:        'description',
      Location:        'place',
      Credentials:     'lock',
      Notes:           'sticky_note_2',
      HyperLink:       'link',
      Entity:          'business',
      Money:           'payments',
      Records:         'folder_special',
      'Knowledge Repo': 'psychology',
    };
    return m[name] ?? 'inventory_2';
  }

  formatDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDateTime(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  close() { this.dialogRef.close(); }
}
