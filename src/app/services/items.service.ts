import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ItemModel {
  itemId: number;
  description: string;
  shortDescription: string;
  itemTypeId: number | null;
  itemTypeName: string;
  isActive: boolean;
  createdDate?: string;
  lastUpdatedDate?: string;
}

export interface ItemsResponse {
  success: boolean;
  items: ItemModel[];
  totalCount: number;
  message?: string;
}

export interface ItemType {
  itemTypeId: number;
  itemType: string;
  count: number;
}

export interface ItemTypesResponse {
  success: boolean;
  types: ItemType[];
}

export interface ItemVariant {
  variantId: number;
  variantName: string;
  itemTypeId: number;
  itemType: string;
}

export interface ContactModel {
  itemId: number;
  name: string;
  phoneNumberId: number | null;
  phoneNumber: string;
}

export interface ContactsResponse {
  success: boolean;
  contacts: ContactModel[];
}

export interface PhoneModel {
  phoneNumberId: number;
  phoneNumber: string;
  isWork: boolean;
  isPrimary: boolean;
}

export interface CreateItemRequest {
  userId: number;
  itemTypeId: number;
  variantId: number;
  description: string;
  contactItemId?: number;
  phoneNumberId?: number;
  meetingPlatform?: string;
  meetingLink?: string;
  meetingIdNumber?: string;
  meetingPassword?: string;
  scheduleFrom?: string;
  scheduleTo?: string;
  isFullDay?: boolean;
  noteTitle?: string;
  noteContent?: string;
  hyperlinkUrl?: string;
  hyperlinkDescription?: string;
  contactIsPersonal?: boolean;
  contactIsEmergency?: boolean;
  contactPhone?: string;
  contactPhoneIsWork?: boolean;
  contactPhoneIsPrimary?: boolean;
  contactEmail?: string;
  contactEmailIsWork?: boolean;
  credUsername?: string;
  credPassword?: string;
  credEmail?: string;
  credPin?: string;
  credMobile?: string;
  credWebsite?: string;
  entityWebsiteUrl?: string;
  entityAvailabilityHours?: string;
  locationMapsLink?: string;
  locationLatitude?: number;
  locationLongitude?: number;
  locationDirections?: string;
  locationKeywords?: string;
  addressHouseFlat?: string;
  addressBuilding?: string;
  addressArea?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressPostalCode?: string;
  addressCountry?: string;
}

export interface CreateItemResponse {
  success: boolean;
  itemId?: number;
  message?: string;
}

const TYPE_NAMES: Record<number, string> = {
  1: 'Activity',
  2: 'WorkUnit',
  3: 'Contact',
  4: 'Document',
  5: 'Credentials',
  6: 'Notes',
  7: 'HyperLink',
  8: 'Entity',
  9: 'Location',
  10: 'Knowledge Repo',
  12: 'Money',
};

let nextId = 100;

const MOCK_ITEMS: ItemModel[] = [
  { itemId: 1,  description: 'Called John regarding project update', shortDescription: 'Phone Call – John',        itemTypeId: 1,  itemTypeName: 'Activity',       isActive: true, createdDate: '2026-05-10', lastUpdatedDate: '2026-05-10' },
  { itemId: 2,  description: 'Buy groceries and household supplies',  shortDescription: 'Groceries Task',          itemTypeId: 2,  itemTypeName: 'WorkUnit',       isActive: true, createdDate: '2026-05-11', lastUpdatedDate: '2026-05-12' },
  { itemId: 3,  description: 'John Smith – personal contact',         shortDescription: 'John Smith',               itemTypeId: 3,  itemTypeName: 'Contact',        isActive: true, createdDate: '2026-05-01', lastUpdatedDate: '2026-05-01' },
  { itemId: 4,  description: 'Passport – Indian Government',          shortDescription: 'Passport',                 itemTypeId: 4,  itemTypeName: 'Document',       isActive: true, createdDate: '2026-04-20', lastUpdatedDate: '2026-04-20' },
  { itemId: 5,  description: 'Netflix account credentials',           shortDescription: 'Netflix',                  itemTypeId: 5,  itemTypeName: 'Credentials',    isActive: true, createdDate: '2026-03-15', lastUpdatedDate: '2026-05-01' },
  { itemId: 6,  description: 'Meeting notes from Q1 review',          shortDescription: 'Q1 Review Notes',          itemTypeId: 6,  itemTypeName: 'Notes',          isActive: true, createdDate: '2026-04-05', lastUpdatedDate: '2026-04-05' },
  { itemId: 7,  description: 'Angular documentation site',            shortDescription: 'Angular Docs',             itemTypeId: 7,  itemTypeName: 'HyperLink',      isActive: true, createdDate: '2026-05-08', lastUpdatedDate: '2026-05-08' },
  { itemId: 8,  description: 'Tech Solutions Pvt Ltd – service',      shortDescription: 'Tech Solutions',           itemTypeId: 8,  itemTypeName: 'Entity',         isActive: true, createdDate: '2026-04-10', lastUpdatedDate: '2026-04-10' },
  { itemId: 9,  description: 'Office – 42 Park Street, Mumbai',       shortDescription: 'Office Location',          itemTypeId: 9,  itemTypeName: 'Location',       isActive: true, createdDate: '2026-03-01', lastUpdatedDate: '2026-03-01' },
  { itemId: 10, description: 'How to use RxJS operators effectively', shortDescription: 'RxJS Tips',                itemTypeId: 10, itemTypeName: 'Knowledge Repo', isActive: true, createdDate: '2026-05-13', lastUpdatedDate: '2026-05-13' },
  { itemId: 11, description: 'Monthly rent payment – May 2026',       shortDescription: 'Rent – May',               itemTypeId: 12, itemTypeName: 'Money',          isActive: true, createdDate: '2026-05-01', lastUpdatedDate: '2026-05-01' },
  { itemId: 12, description: 'Sarah Johnson – emergency contact',     shortDescription: 'Sarah Johnson',            itemTypeId: 3,  itemTypeName: 'Contact',        isActive: true, createdDate: '2026-02-14', lastUpdatedDate: '2026-02-14' },
  { itemId: 13, description: 'Team standup – online meeting',         shortDescription: 'Daily Standup',            itemTypeId: 1,  itemTypeName: 'Activity',       isActive: true, createdDate: '2026-05-15', lastUpdatedDate: '2026-05-15' },
  { itemId: 14, description: 'Deploy dashboard feature by Friday',    shortDescription: 'Deploy Dashboard',         itemTypeId: 2,  itemTypeName: 'WorkUnit',       isActive: true, createdDate: '2026-05-14', lastUpdatedDate: '2026-05-14' },
  { itemId: 15, description: 'AWS console login credentials',         shortDescription: 'AWS Console',              itemTypeId: 5,  itemTypeName: 'Credentials',    isActive: true, createdDate: '2026-01-10', lastUpdatedDate: '2026-05-10' },
  { itemId: 16, description: 'Home address – 10 Lake View, Pune',     shortDescription: 'Home Address',             itemTypeId: 9,  itemTypeName: 'Location',       isActive: true, createdDate: '2026-01-01', lastUpdatedDate: '2026-01-01' },
  { itemId: 17, description: 'Electricity bill – ₹1,840 May 2026',    shortDescription: 'Electricity Bill',         itemTypeId: 12, itemTypeName: 'Money',          isActive: true, createdDate: '2026-05-05', lastUpdatedDate: '2026-05-05' },
  { itemId: 18, description: 'GitHub repository link – main project', shortDescription: 'GitHub Repo',              itemTypeId: 7,  itemTypeName: 'HyperLink',      isActive: true, createdDate: '2026-05-09', lastUpdatedDate: '2026-05-09' },
  { itemId: 19, description: 'Best practices for Angular state mgmt', shortDescription: 'Angular State Patterns',   itemTypeId: 10, itemTypeName: 'Knowledge Repo', isActive: true, createdDate: '2026-05-12', lastUpdatedDate: '2026-05-12' },
  { itemId: 20, description: 'City Telecom – service provider',       shortDescription: 'City Telecom',             itemTypeId: 8,  itemTypeName: 'Entity',         isActive: true, createdDate: '2026-03-20', lastUpdatedDate: '2026-03-20' },
];

const MOCK_CONTACTS: ContactModel[] = [
  { itemId: 3,  name: 'John Smith',   phoneNumberId: 1, phoneNumber: '+91 98765 43210' },
  { itemId: 12, name: 'Sarah Johnson', phoneNumberId: 2, phoneNumber: '+91 87654 32109' },
];

const MOCK_PHONES: Record<number, PhoneModel[]> = {
  3:  [{ phoneNumberId: 1, phoneNumber: '+91 98765 43210', isWork: false, isPrimary: true }],
  12: [{ phoneNumberId: 2, phoneNumber: '+91 87654 32109', isWork: false, isPrimary: true }],
};

@Injectable({ providedIn: 'root' })
export class ItemsService {

  getItems(_userId: number, search?: string, itemTypeId?: number, page = 1, pageSize = 50): Observable<ItemsResponse> {
    let filtered = [...MOCK_ITEMS];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.description.toLowerCase().includes(q) || i.shortDescription.toLowerCase().includes(q)
      );
    }
    if (itemTypeId != null) {
      filtered = filtered.filter(i => i.itemTypeId === itemTypeId);
    }
    const totalCount = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return of({ success: true, items, totalCount });
  }

  getItemTypes(_userId: number): Observable<ItemTypesResponse> {
    const counts: Record<number, number> = {};
    for (const item of MOCK_ITEMS) {
      if (item.itemTypeId != null) {
        counts[item.itemTypeId] = (counts[item.itemTypeId] ?? 0) + 1;
      }
    }
    const types: ItemType[] = Object.entries(counts).map(([id, count]) => ({
      itemTypeId: Number(id),
      itemType: TYPE_NAMES[Number(id)] ?? 'Other',
      count,
    }));
    return of({ success: true, types });
  }

  getVariants(_userId: number): Observable<{ success: boolean; variants: ItemVariant[] }> {
    return of({ success: true, variants: [
      { variantId: 2,  variantName: 'Phone Call',          itemTypeId: 1,  itemType: 'Activity' },
      { variantId: 3,  variantName: 'Visit',               itemTypeId: 1,  itemType: 'Activity' },
      { variantId: 4,  variantName: 'Meeting',             itemTypeId: 1,  itemType: 'Activity' },
      { variantId: 5,  variantName: 'Online Meeting',      itemTypeId: 1,  itemType: 'Activity' },
      { variantId: 6,  variantName: 'Schedule',            itemTypeId: 1,  itemType: 'Activity' },
      { variantId: 7,  variantName: 'Personal',            itemTypeId: 3,  itemType: 'Contact' },
      { variantId: 8,  variantName: 'Emergency',           itemTypeId: 3,  itemType: 'Contact' },
      { variantId: 16, variantName: 'ID Document',         itemTypeId: 4,  itemType: 'Document' },
      { variantId: 17, variantName: 'General Document',    itemTypeId: 4,  itemType: 'Document' },
      { variantId: 23, variantName: 'Bank Credentials',    itemTypeId: 5,  itemType: 'Credentials' },
      { variantId: 24, variantName: 'App / Web',           itemTypeId: 5,  itemType: 'Credentials' },
      { variantId: 27, variantName: 'Service Entity',      itemTypeId: 8,  itemType: 'Entity' },
      { variantId: 28, variantName: 'Business',            itemTypeId: 8,  itemType: 'Entity' },
      { variantId: 29, variantName: 'Govt Organisation',   itemTypeId: 8,  itemType: 'Entity' },
      { variantId: 30, variantName: 'Location / Place',    itemTypeId: 9,  itemType: 'Location' },
      { variantId: 31, variantName: 'Prompt',              itemTypeId: 10, itemType: 'Knowledge' },
      { variantId: 32, variantName: 'Idea',                itemTypeId: 10, itemType: 'Knowledge' },
      { variantId: 33, variantName: 'Memory',              itemTypeId: 10, itemType: 'Knowledge' },
      { variantId: 35, variantName: 'Address',             itemTypeId: 9,  itemType: 'Location' },
      { variantId: 36, variantName: 'Task',                itemTypeId: 2,  itemType: 'Task' },
      { variantId: 37, variantName: 'Expenses / Receipts', itemTypeId: 12, itemType: 'Money' },
    ]});
  }

  getContactPhones(_userId: number, contactItemId: number): Observable<{ success: boolean; phones: PhoneModel[] }> {
    return of({ success: true, phones: MOCK_PHONES[contactItemId] ?? [] });
  }

  getContacts(_userId: number, search?: string): Observable<ContactsResponse> {
    let contacts = [...MOCK_CONTACTS];
    if (search) {
      const q = search.toLowerCase();
      contacts = contacts.filter(c => c.name.toLowerCase().includes(q));
    }
    return of({ success: true, contacts });
  }

  createItem(req: CreateItemRequest): Observable<CreateItemResponse> {
    const newItem: ItemModel = {
      itemId: ++nextId,
      description: req.description,
      shortDescription: req.description.length > 60 ? req.description.slice(0, 60) + '…' : req.description,
      itemTypeId: req.itemTypeId,
      itemTypeName: TYPE_NAMES[req.itemTypeId] ?? 'Other',
      isActive: true,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    };
    MOCK_ITEMS.unshift(newItem);
    window.dispatchEvent(new Event('dclutter:item-created'));
    return of({ success: true, itemId: newItem.itemId, message: 'Item created.' });
  }
}
