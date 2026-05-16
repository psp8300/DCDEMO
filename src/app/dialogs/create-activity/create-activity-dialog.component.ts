import { Component, Inject, OnInit } from '@angular/core';
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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemsService, ContactModel, PhoneModel, CreateItemRequest } from '../../services/items.service';

export interface ActivityVariant {
  id: number;
  name: string;
  icon: string;
  color: string;
  needsContact: boolean;
  needsMeeting: boolean;
}

type ContactState = 'search' | 'phones' | 'selected';

@Component({
  selector: 'app-create-activity-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatStepperModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent implements OnInit {

  variants: ActivityVariant[] = [
    { id: 1, name: 'Phone Call',      icon: 'phone',           color: '#2e7d32', needsContact: true,  needsMeeting: false },
    { id: 2, name: 'Visit',           icon: 'directions_walk', color: '#1565c0', needsContact: true,  needsMeeting: false },
    { id: 5, name: 'Online Meeting',  icon: 'video_call',      color: '#6a1b9a', needsContact: false, needsMeeting: true  },
    { id: 6, name: 'Appointment',     icon: 'event',           color: '#e65100', needsContact: false, needsMeeting: false },
    { id: 7, name: 'Offline Meeting', icon: 'groups',          color: '#37474f', needsContact: true,  needsMeeting: false },
  ];

  selectedVariant: ActivityVariant | null = null;
  stepIndex = 0;

  // Step 2 — Description
  description = '';

  // Step 2 — Contact flow
  contactState: ContactState = 'search';
  contacts: ContactModel[] = [];
  contactSearch = '';
  contactsLoading = false;
  selectedContact: ContactModel | null = null;

  // Step 2 — Phone selection
  phones: PhoneModel[] = [];
  phonesLoading = false;
  selectedPhone: PhoneModel | null = null;

  // Step 2 — Online Meeting
  meetingPlatform = '';
  meetingLink = '';
  meetingIdNumber = '';
  meetingPassword = '';

  // Step 3 — Schedule
  scheduleFromDate = '';
  scheduleFromTime = '';
  scheduleToDate = '';
  scheduleToTime = '';
  isFullDay = false;
  hasSchedule = false;

  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  // ── Step 1 ──
  selectVariant(v: ActivityVariant) {
    this.selectedVariant = v;
    this.stepIndex = 1;
    if (v.needsContact) this.loadContacts('');
  }

  // ── Contact search ──
  loadContacts(search: string) {
    this.contactsLoading = true;
    this.itemsService.getContacts(this.data.userId, search || undefined).subscribe({
      next: res => {
        this.contacts = res.success ? res.contacts : [];
        this.contactsLoading = false;
      },
      error: () => { this.contactsLoading = false; }
    });
  }

  onContactSearch(val: string) {
    this.contactSearch = val;
    this.loadContacts(val);
  }

  pickContact(c: ContactModel) {
    this.selectedContact = c;
    this.contactState = 'phones';
    this.loadPhones(c.itemId);
  }

  // ── Phone selection ──
  loadPhones(contactItemId: number) {
    this.phonesLoading = true;
    this.itemsService.getContactPhones(this.data.userId, contactItemId).subscribe({
      next: res => {
        this.phones = res.success ? res.phones : [];
        this.phonesLoading = false;
      },
      error: () => { this.phonesLoading = false; }
    });
  }

  pickPhone(p: PhoneModel) {
    this.selectedPhone = p;
    this.contactState = 'selected';
  }

  skipPhone() {
    this.selectedPhone = null;
    this.contactState = 'selected';
  }

  clearContact() {
    this.selectedContact = null;
    this.selectedPhone = null;
    this.contactState = 'search';
    this.contactSearch = '';
    this.contacts = [];
    this.loadContacts('');
  }

  skipContact() {
    this.selectedContact = null;
    this.selectedPhone = null;
    this.contactState = 'selected';
  }

  backToContacts() {
    this.selectedContact = null;
    this.selectedPhone = null;
    this.contactState = 'search';
  }

  // ── Computed helpers ──
  get detailsComplete(): boolean {
    return !!this.description.trim();
  }

  get scheduleFromDateTime(): string | undefined {
    if (!this.hasSchedule || !this.scheduleFromDate) return undefined;
    return this.isFullDay
      ? `${this.scheduleFromDate}T00:00:00`
      : `${this.scheduleFromDate}T${this.scheduleFromTime || '00:00'}:00`;
  }

  get scheduleToDateTime(): string | undefined {
    if (!this.hasSchedule || !this.scheduleToDate) return undefined;
    return this.isFullDay
      ? `${this.scheduleToDate}T23:59:59`
      : `${this.scheduleToDate}T${this.scheduleToTime || '00:00'}:00`;
  }

  // ── Save ──
  save() {
    if (!this.selectedVariant || !this.description.trim()) return;
    this.saving = true;

    const req: CreateItemRequest = {
      userId: this.data.userId,
      itemTypeId: 1,
      variantId: this.selectedVariant.id,
      description: this.description.trim(),
      phoneNumberId: this.selectedPhone?.phoneNumberId ?? undefined,
      contactItemId: this.selectedContact?.itemId ?? undefined,
      meetingPlatform: this.meetingPlatform || undefined,
      meetingLink: this.meetingLink || undefined,
      meetingIdNumber: this.meetingIdNumber || undefined,
      meetingPassword: this.meetingPassword || undefined,
      scheduleFrom: this.scheduleFromDateTime,
      scheduleTo: this.scheduleToDateTime,
      isFullDay: this.isFullDay,
    };

    this.itemsService.createItem(req).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Activity created!', '', { duration: 3000 });
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
