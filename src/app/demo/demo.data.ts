import { ItemModel, ItemDetailModel, ItemType, ItemVariant, ContactModel, PhoneModel } from '../services/items.service';
import { ActivityItem } from '../services/activity.service';
import { ListItem } from '../services/lists.service';

// ─── Seed dates ──────────────────────────────────────────────────────────────
function d(offset: number): string {
  const date = new Date('2026-05-20');
  date.setDate(date.getDate() - offset);
  return date.toISOString();
}

// ─── Item types ───────────────────────────────────────────────────────────────
export const DEMO_ITEM_TYPES: ItemType[] = [
  { itemTypeId: 1,  itemType: 'Activity',       count: 8  },
  { itemTypeId: 2,  itemType: 'WorkUnit',        count: 4  },
  { itemTypeId: 3,  itemType: 'Contact',         count: 6  },
  { itemTypeId: 4,  itemType: 'Document',        count: 4  },
  { itemTypeId: 5,  itemType: 'Credentials',     count: 4  },
  { itemTypeId: 6,  itemType: 'Notes',           count: 4  },
  { itemTypeId: 7,  itemType: 'HyperLink',       count: 4  },
  { itemTypeId: 8,  itemType: 'Entity',          count: 4  },
  { itemTypeId: 9,  itemType: 'Location',        count: 4  },
  { itemTypeId: 10, itemType: 'Knowledge Repo',  count: 4  },
  { itemTypeId: 12, itemType: 'Money',           count: 4  },
];

export const DEMO_VARIANTS: ItemVariant[] = [
  { variantId: 1,  variantName: 'Phone Call',       itemTypeId: 1,  itemType: 'Activity'      },
  { variantId: 2,  variantName: 'Visit',             itemTypeId: 1,  itemType: 'Activity'      },
  { variantId: 5,  variantName: 'Online Meeting',    itemTypeId: 1,  itemType: 'Activity'      },
  { variantId: 6,  variantName: 'Appointment',       itemTypeId: 1,  itemType: 'Activity'      },
  { variantId: 7,  variantName: 'Offline Meeting',   itemTypeId: 1,  itemType: 'Activity'      },
  { variantId: 13, variantName: 'Contact',           itemTypeId: 3,  itemType: 'Contact'       },
  { variantId: 16, variantName: 'ID Document',       itemTypeId: 4,  itemType: 'Document'      },
  { variantId: 17, variantName: 'General Document',  itemTypeId: 4,  itemType: 'Document'      },
  { variantId: 23, variantName: 'Bank Credentials',  itemTypeId: 5,  itemType: 'Credentials'   },
  { variantId: 24, variantName: 'App / Web',         itemTypeId: 5,  itemType: 'Credentials'   },
  { variantId: 25, variantName: 'Notes',             itemTypeId: 6,  itemType: 'Notes'         },
  { variantId: 26, variantName: 'HyperLink',         itemTypeId: 7,  itemType: 'HyperLink'     },
  { variantId: 27, variantName: 'Service Entity',    itemTypeId: 8,  itemType: 'Entity'        },
  { variantId: 28, variantName: 'Business Entity',   itemTypeId: 8,  itemType: 'Entity'        },
  { variantId: 29, variantName: 'Govt Organisation', itemTypeId: 8,  itemType: 'Entity'        },
  { variantId: 30, variantName: 'Location',          itemTypeId: 9,  itemType: 'Location'      },
  { variantId: 31, variantName: 'Prompt',            itemTypeId: 10, itemType: 'Knowledge Repo'},
  { variantId: 32, variantName: 'Idea',              itemTypeId: 10, itemType: 'Knowledge Repo'},
  { variantId: 33, variantName: 'Memory',            itemTypeId: 10, itemType: 'Knowledge Repo'},
  { variantId: 35, variantName: 'Address',           itemTypeId: 9,  itemType: 'Location'      },
  { variantId: 36, variantName: 'Task',              itemTypeId: 2,  itemType: 'WorkUnit'      },
  { variantId: 37, variantName: 'Expenses/Receipts', itemTypeId: 12, itemType: 'Money'         },
];

// ─── Items list (summary view) ────────────────────────────────────────────────
export const DEMO_ITEMS: ItemModel[] = [
  // Activities (1-8)
  { itemId: 1,  description: 'Call with Rajesh about Q2 plan',        shortDescription: 'Call — Rajesh Q2',       itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(2),  lastUpdatedDate: d(1)  },
  { itemId: 2,  description: 'Doctor visit — Fortis Hospital',        shortDescription: 'Doctor — Fortis',        itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(5),  lastUpdatedDate: d(5)  },
  { itemId: 3,  description: 'Online meeting — Project Kickoff',      shortDescription: 'Online Kickoff Mtg',     itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(7),  lastUpdatedDate: d(6)  },
  { itemId: 4,  description: 'CA appointment for ITR filing',         shortDescription: 'CA — ITR Filing',        itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(10), lastUpdatedDate: d(9)  },
  { itemId: 5,  description: 'Team lunch — Barbeque Nation, Koramangala', shortDescription: 'Team Lunch BBQ',    itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(12), lastUpdatedDate: d(11) },
  { itemId: 6,  description: 'Bank visit — HDFC Indiranagar',         shortDescription: 'HDFC Bank Visit',        itemTypeId: 1,  itemTypeName: 'Activity',      isActive: false, createdDate: d(20), lastUpdatedDate: d(20) },
  { itemId: 7,  description: 'Offline meeting — vendor review',       shortDescription: 'Vendor Review Mtg',      itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(15), lastUpdatedDate: d(14) },
  { itemId: 8,  description: 'Phone call — insurance renewal',        shortDescription: 'Insurance Renewal Call', itemTypeId: 1,  itemTypeName: 'Activity',      isActive: true,  createdDate: d(3),  lastUpdatedDate: d(3)  },
  // Contacts (9-14)
  { itemId: 9,  description: 'Rajesh Kumar — Product Manager, TechMind Solutions', shortDescription: 'Rajesh Kumar',     itemTypeId: 3,  itemTypeName: 'Contact', isActive: true,  createdDate: d(30), lastUpdatedDate: d(8)  },
  { itemId: 10, description: 'Priya Sharma — CA, Sharma & Associates',             shortDescription: 'Priya Sharma (CA)',itemTypeId: 3,  itemTypeName: 'Contact', isActive: true,  createdDate: d(45), lastUpdatedDate: d(9)  },
  { itemId: 11, description: 'Dr. Suresh Nair — General Physician, Fortis',        shortDescription: 'Dr. Suresh Nair',  itemTypeId: 3,  itemTypeName: 'Contact', isActive: true,  createdDate: d(60), lastUpdatedDate: d(5)  },
  { itemId: 12, description: 'Anita Desai — Property Agent, Confident Group',      shortDescription: 'Anita Desai',      itemTypeId: 3,  itemTypeName: 'Contact', isActive: true,  createdDate: d(90), lastUpdatedDate: d(25) },
  { itemId: 13, description: 'Vikram Singh — HDFC Bank Relationship Manager',      shortDescription: 'Vikram — HDFC RM', itemTypeId: 3,  itemTypeName: 'Contact', isActive: true,  createdDate: d(120),lastUpdatedDate: d(20) },
  { itemId: 14, description: 'Meena Pillai — HR Manager, InfyTech',                shortDescription: 'Meena Pillai HR',  itemTypeId: 3,  itemTypeName: 'Contact', isActive: false, createdDate: d(180),lastUpdatedDate: d(60) },
  // Notes (15-18)
  { itemId: 15, description: 'Meeting notes — Q2 roadmap discussion',     shortDescription: 'Q2 Roadmap Notes',    itemTypeId: 6,  itemTypeName: 'Notes', isActive: true, createdDate: d(1),  lastUpdatedDate: d(1)  },
  { itemId: 16, description: 'Car insurance renewal checklist',            shortDescription: 'Car Insurance Notes', itemTypeId: 6,  itemTypeName: 'Notes', isActive: true, createdDate: d(4),  lastUpdatedDate: d(4)  },
  { itemId: 17, description: 'Home renovation ideas — Bengaluru flat',     shortDescription: 'Home Reno Ideas',     itemTypeId: 6,  itemTypeName: 'Notes', isActive: true, createdDate: d(8),  lastUpdatedDate: d(8)  },
  { itemId: 18, description: 'Diet plan and gym schedule for May 2026',    shortDescription: 'Diet & Gym Plan',     itemTypeId: 6,  itemTypeName: 'Notes', isActive: true, createdDate: d(12), lastUpdatedDate: d(10) },
  // HyperLinks (19-22)
  { itemId: 19, description: 'UIDAI Aadhaar portal — uidai.gov.in',              shortDescription: 'UIDAI Aadhaar',     itemTypeId: 7,  itemTypeName: 'HyperLink', isActive: true, createdDate: d(20), lastUpdatedDate: d(20) },
  { itemId: 20, description: 'HDFC NetBanking — netbanking.hdfcbank.com',        shortDescription: 'HDFC NetBanking',   itemTypeId: 7,  itemTypeName: 'HyperLink', isActive: true, createdDate: d(25), lastUpdatedDate: d(22) },
  { itemId: 21, description: 'IRCTC train booking — irctc.co.in',               shortDescription: 'IRCTC Booking',     itemTypeId: 7,  itemTypeName: 'HyperLink', isActive: true, createdDate: d(30), lastUpdatedDate: d(30) },
  { itemId: 22, description: 'MakeMyTrip flight search — makemytrip.com',       shortDescription: 'MakeMyTrip',        itemTypeId: 7,  itemTypeName: 'HyperLink', isActive: true, createdDate: d(35), lastUpdatedDate: d(35) },
  // Documents (23-26)
  { itemId: 23, description: 'Aadhaar Card — 4521 XXXX XXXX 8834',       shortDescription: 'Aadhaar Card',      itemTypeId: 4,  itemTypeName: 'Document', isActive: true, createdDate: d(180), lastUpdatedDate: d(180) },
  { itemId: 24, description: 'PAN Card — ABCPK1234X',                    shortDescription: 'PAN Card',          itemTypeId: 4,  itemTypeName: 'Document', isActive: true, createdDate: d(180), lastUpdatedDate: d(180) },
  { itemId: 25, description: 'Driving Licence — KA01-20200123456',       shortDescription: 'Driving Licence',   itemTypeId: 4,  itemTypeName: 'Document', isActive: true, createdDate: d(90),  lastUpdatedDate: d(90)  },
  { itemId: 26, description: 'Maruti Swift Service Record — May 2026',   shortDescription: 'Car Service Record',itemTypeId: 4,  itemTypeName: 'Document', isActive: true, createdDate: d(7),   lastUpdatedDate: d(7)   },
  // Credentials (27-30)
  { itemId: 27, description: 'HDFC NetBanking credentials',              shortDescription: 'HDFC NetBanking',   itemTypeId: 5,  itemTypeName: 'Credentials', isActive: true, createdDate: d(60),  lastUpdatedDate: d(14) },
  { itemId: 28, description: 'Gmail — personal account',                 shortDescription: 'Gmail Personal',    itemTypeId: 5,  itemTypeName: 'Credentials', isActive: true, createdDate: d(90),  lastUpdatedDate: d(7)  },
  { itemId: 29, description: 'GitHub developer account',                 shortDescription: 'GitHub Account',    itemTypeId: 5,  itemTypeName: 'Credentials', isActive: true, createdDate: d(120), lastUpdatedDate: d(30) },
  { itemId: 30, description: 'SBI debit card & NetBanking',              shortDescription: 'SBI NetBanking',    itemTypeId: 5,  itemTypeName: 'Credentials', isActive: true, createdDate: d(150), lastUpdatedDate: d(45) },
  // Entities (31-34)
  { itemId: 31, description: 'TechMind Solutions — IT services company',         shortDescription: 'TechMind Solutions',  itemTypeId: 8, itemTypeName: 'Entity', isActive: true, createdDate: d(60),  lastUpdatedDate: d(8)  },
  { itemId: 32, description: 'Sharma & Associates — Chartered Accountants',      shortDescription: 'Sharma & Associates', itemTypeId: 8, itemTypeName: 'Entity', isActive: true, createdDate: d(90),  lastUpdatedDate: d(9)  },
  { itemId: 33, description: 'Fortis Hospital — Bengaluru',                      shortDescription: 'Fortis Hospital',     itemTypeId: 8, itemTypeName: 'Entity', isActive: true, createdDate: d(120), lastUpdatedDate: d(5)  },
  { itemId: 34, description: 'HDFC Bank — Indiranagar Branch',                  shortDescription: 'HDFC Indiranagar',    itemTypeId: 8, itemTypeName: 'Entity', isActive: true, createdDate: d(180), lastUpdatedDate: d(20) },
  // Locations (35-38)
  { itemId: 35, description: 'Barbeque Nation, Koramangala 5th Block',           shortDescription: 'BBQ Nation Koramangala', itemTypeId: 9, itemTypeName: 'Location', isActive: true, createdDate: d(15), lastUpdatedDate: d(11) },
  { itemId: 36, description: 'Home address — Whitefield, Bengaluru',             shortDescription: 'Home — Whitefield',     itemTypeId: 9, itemTypeName: 'Location', isActive: true, createdDate: d(365),lastUpdatedDate: d(90) },
  { itemId: 37, description: 'Office — Electronic City Phase 1, Bengaluru',      shortDescription: 'Office — EC Phase 1',   itemTypeId: 9, itemTypeName: 'Location', isActive: true, createdDate: d(365),lastUpdatedDate: d(60) },
  { itemId: 38, description: 'HDFC Bank Indiranagar — 100 Feet Rd',              shortDescription: 'HDFC Indiranagar',       itemTypeId: 9, itemTypeName: 'Location', isActive: true, createdDate: d(180),lastUpdatedDate: d(20) },
  // Knowledge (39-42)
  { itemId: 39, description: 'Angular 19 standalone components — key notes',     shortDescription: 'Angular 19 Standalone', itemTypeId: 10, itemTypeName: 'Knowledge Repo', isActive: true, createdDate: d(5),  lastUpdatedDate: d(5)  },
  { itemId: 40, description: 'Prompt: Summarize meeting in 3 bullet points',     shortDescription: 'AI Meeting Summary Prompt', itemTypeId: 10, itemTypeName: 'Knowledge Repo', isActive: true, createdDate: d(3),  lastUpdatedDate: d(2)  },
  { itemId: 41, description: 'Idea: Build expense tracker with UPI integration', shortDescription: 'Expense Tracker Idea',  itemTypeId: 10, itemTypeName: 'Knowledge Repo', isActive: true, createdDate: d(14), lastUpdatedDate: d(14) },
  { itemId: 42, description: 'Memory: Rajesh prefers WhatsApp over email',       shortDescription: 'Rajesh contact pref', itemTypeId: 10, itemTypeName: 'Knowledge Repo', isActive: true, createdDate: d(20), lastUpdatedDate: d(20) },
  // WorkUnits (43-46)
  { itemId: 43, description: 'Submit ITR for FY 2025-26 — Due 31 Jul 2026',     shortDescription: 'ITR Filing Task',       itemTypeId: 2, itemTypeName: 'WorkUnit', isActive: true,  createdDate: d(10), lastUpdatedDate: d(9)  },
  { itemId: 44, description: 'Renew car insurance — HDFC Ergo [High] Due: 2026-06-15', shortDescription: 'Car Insurance Renewal', itemTypeId: 2, itemTypeName: 'WorkUnit', isActive: true, createdDate: d(5), lastUpdatedDate: d(5)  },
  { itemId: 45, description: 'Fix DClutter Android keyboard push-up issue',     shortDescription: 'Android KB Fix',        itemTypeId: 2, itemTypeName: 'WorkUnit', isActive: true,  createdDate: d(2),  lastUpdatedDate: d(1)  },
  { itemId: 46, description: 'Review Q2 sprint backlog with Rajesh',            shortDescription: 'Q2 Sprint Review',      itemTypeId: 2, itemTypeName: 'WorkUnit', isActive: false, createdDate: d(15), lastUpdatedDate: d(12) },
  // Money (47-50)
  { itemId: 47, description: 'Zomato order — Butter Chicken — ₹420 — @ Spice Garden — [Food] — 2026-05-19', shortDescription: 'Zomato ₹420',   itemTypeId: 12, itemTypeName: 'Money', isActive: true, createdDate: d(1),  lastUpdatedDate: d(1)  },
  { itemId: 48, description: 'Ola Auto fare — Office commute — ₹85 — 2026-05-20',  shortDescription: 'Ola ₹85',         itemTypeId: 12, itemTypeName: 'Money', isActive: true, createdDate: d(0),  lastUpdatedDate: d(0)  },
  { itemId: 49, description: 'Big Basket grocery — ₹1850 — [Groceries] — 2026-05-17', shortDescription: 'BigBasket ₹1850', itemTypeId: 12, itemTypeName: 'Money', isActive: true, createdDate: d(3),  lastUpdatedDate: d(3)  },
  { itemId: 50, description: 'Maruti Swift service charge — ₹4200 — @ Mandovi Motors — 2026-05-13', shortDescription: 'Service ₹4200', itemTypeId: 12, itemTypeName: 'Money', isActive: true, createdDate: d(7),  lastUpdatedDate: d(7)  },
];

// ─── Contacts for activity creation ──────────────────────────────────────────
export const DEMO_CONTACTS: ContactModel[] = [
  { itemId: 9,  name: 'Rajesh Kumar',   phoneNumberId: 1, phoneNumber: '+91 98451 23456' },
  { itemId: 10, name: 'Priya Sharma',   phoneNumberId: 2, phoneNumber: '+91 87654 32109' },
  { itemId: 11, name: 'Dr. Suresh Nair',phoneNumberId: 3, phoneNumber: '+91 80 4567 8901' },
  { itemId: 12, name: 'Anita Desai',    phoneNumberId: 4, phoneNumber: '+91 99001 44556' },
  { itemId: 13, name: 'Vikram Singh',   phoneNumberId: 5, phoneNumber: '+91 97400 11223' },
];

export const DEMO_PHONES: Record<number, PhoneModel[]> = {
  9:  [{ phoneNumberId: 1, phoneNumber: '+91 98451 23456', isWork: false, isPrimary: true  }],
  10: [{ phoneNumberId: 2, phoneNumber: '+91 87654 32109', isWork: true,  isPrimary: true  }],
  11: [{ phoneNumberId: 3, phoneNumber: '+91 80 4567 8901', isWork: true, isPrimary: true  }],
  12: [{ phoneNumberId: 4, phoneNumber: '+91 99001 44556', isWork: false, isPrimary: true  }],
  13: [{ phoneNumberId: 5, phoneNumber: '+91 97400 11223', isWork: true,  isPrimary: true  }],
};

// ─── Item details ─────────────────────────────────────────────────────────────
export const DEMO_ITEM_DETAILS: Record<number, ItemDetailModel> = {
  1:  { itemId: 1,  description: 'Call with Rajesh about Q2 plan', shortDescription: 'Call — Rajesh Q2', itemTypeId: 1, itemTypeName: 'Activity', variantId: 1, variantName: 'Phone Call', isActive: true, createdDate: d(2), lastUpdatedDate: d(1), contactItemId: 9, contactName: 'Rajesh Kumar', phoneNumberId: 1, phoneNumber: '+91 98451 23456', scheduleFrom: new Date('2026-05-19T11:00:00').toISOString(), scheduleTo: new Date('2026-05-19T11:30:00').toISOString(), isFullDay: false },
  2:  { itemId: 2,  description: 'Doctor visit — Fortis Hospital', shortDescription: 'Doctor — Fortis', itemTypeId: 1, itemTypeName: 'Activity', variantId: 2, variantName: 'Visit', isActive: true, createdDate: d(5), lastUpdatedDate: d(5), contactItemId: 11, contactName: 'Dr. Suresh Nair', scheduleFrom: new Date('2026-05-15T10:00:00').toISOString(), scheduleTo: new Date('2026-05-15T11:00:00').toISOString(), isFullDay: false },
  3:  { itemId: 3,  description: 'Online meeting — Project Kickoff', shortDescription: 'Online Kickoff Mtg', itemTypeId: 1, itemTypeName: 'Activity', variantId: 5, variantName: 'Online Meeting', isActive: true, createdDate: d(7), lastUpdatedDate: d(6), meetingPlatform: 'Google Meet', meetingLink: 'https://meet.google.com/abc-def-ghi', scheduleFrom: new Date('2026-05-13T14:00:00').toISOString(), scheduleTo: new Date('2026-05-13T15:30:00').toISOString(), isFullDay: false },
  4:  { itemId: 4,  description: 'CA appointment for ITR filing', shortDescription: 'CA — ITR Filing', itemTypeId: 1, itemTypeName: 'Activity', variantId: 6, variantName: 'Appointment', isActive: true, createdDate: d(10), lastUpdatedDate: d(9), contactItemId: 10, contactName: 'Priya Sharma', scheduleFrom: new Date('2026-05-22T15:00:00').toISOString(), scheduleTo: new Date('2026-05-22T16:00:00').toISOString(), isFullDay: false },
  5:  { itemId: 5,  description: 'Team lunch — Barbeque Nation, Koramangala', shortDescription: 'Team Lunch BBQ', itemTypeId: 1, itemTypeName: 'Activity', variantId: 7, variantName: 'Offline Meeting', isActive: true, createdDate: d(12), lastUpdatedDate: d(11), scheduleFrom: new Date('2026-05-09T13:00:00').toISOString(), scheduleTo: new Date('2026-05-09T14:30:00').toISOString(), isFullDay: false },
  6:  { itemId: 6,  description: 'Bank visit — HDFC Indiranagar', shortDescription: 'HDFC Bank Visit', itemTypeId: 1, itemTypeName: 'Activity', variantId: 2, variantName: 'Visit', isActive: false, createdDate: d(20), lastUpdatedDate: d(20) },
  7:  { itemId: 7,  description: 'Offline meeting — vendor review', shortDescription: 'Vendor Review Mtg', itemTypeId: 1, itemTypeName: 'Activity', variantId: 7, variantName: 'Offline Meeting', isActive: true, createdDate: d(15), lastUpdatedDate: d(14), scheduleFrom: new Date('2026-05-06T10:00:00').toISOString(), scheduleTo: new Date('2026-05-06T11:30:00').toISOString(), isFullDay: false },
  8:  { itemId: 8,  description: 'Phone call — insurance renewal', shortDescription: 'Insurance Renewal Call', itemTypeId: 1, itemTypeName: 'Activity', variantId: 1, variantName: 'Phone Call', isActive: true, createdDate: d(3), lastUpdatedDate: d(3) },
  9:  { itemId: 9,  description: 'Rajesh Kumar — Product Manager, TechMind Solutions', shortDescription: 'Rajesh Kumar', itemTypeId: 3, itemTypeName: 'Contact', variantId: 13, variantName: 'Contact', isActive: true, createdDate: d(30), lastUpdatedDate: d(8), contactIsPersonal: false, contactPhone: '+91 98451 23456', contactPhoneIsWork: false, contactPhoneIsPrimary: true, contactEmail: 'rajesh.kumar@techmind.in', contactEmailIsWork: true },
  10: { itemId: 10, description: 'Priya Sharma — CA, Sharma & Associates', shortDescription: 'Priya Sharma (CA)', itemTypeId: 3, itemTypeName: 'Contact', variantId: 13, variantName: 'Contact', isActive: true, createdDate: d(45), lastUpdatedDate: d(9), contactIsPersonal: false, contactPhone: '+91 87654 32109', contactPhoneIsWork: true, contactPhoneIsPrimary: true, contactEmail: 'priya@sharmaassociates.com', contactEmailIsWork: true },
  11: { itemId: 11, description: 'Dr. Suresh Nair — General Physician, Fortis', shortDescription: 'Dr. Suresh Nair', itemTypeId: 3, itemTypeName: 'Contact', variantId: 13, variantName: 'Contact', isActive: true, createdDate: d(60), lastUpdatedDate: d(5), contactIsPersonal: false, contactPhone: '+91 80 4567 8901', contactPhoneIsWork: true, contactPhoneIsPrimary: true },
  12: { itemId: 12, description: 'Anita Desai — Property Agent, Confident Group', shortDescription: 'Anita Desai', itemTypeId: 3, itemTypeName: 'Contact', variantId: 13, variantName: 'Contact', isActive: true, createdDate: d(90), lastUpdatedDate: d(25), contactIsPersonal: false, contactPhone: '+91 99001 44556', contactPhoneIsWork: false, contactPhoneIsPrimary: true },
  13: { itemId: 13, description: 'Vikram Singh — HDFC Bank Relationship Manager', shortDescription: 'Vikram — HDFC RM', itemTypeId: 3, itemTypeName: 'Contact', variantId: 13, variantName: 'Contact', isActive: true, createdDate: d(120), lastUpdatedDate: d(20), contactIsPersonal: false, contactPhone: '+91 97400 11223', contactPhoneIsWork: true, contactPhoneIsPrimary: true, contactEmail: 'vikram.singh@hdfcbank.com', contactEmailIsWork: true },
  14: { itemId: 14, description: 'Meena Pillai — HR Manager, InfyTech', shortDescription: 'Meena Pillai HR', itemTypeId: 3, itemTypeName: 'Contact', variantId: 13, variantName: 'Contact', isActive: false, createdDate: d(180), lastUpdatedDate: d(60), contactIsPersonal: false, contactEmail: 'meena.pillai@infytech.com', contactEmailIsWork: true },
  15: { itemId: 15, description: 'Meeting notes — Q2 roadmap discussion', shortDescription: 'Q2 Roadmap Notes', itemTypeId: 6, itemTypeName: 'Notes', variantId: 25, variantName: 'Notes', isActive: true, createdDate: d(1), lastUpdatedDate: d(1), noteTitle: 'Q2 Roadmap Discussion', noteContent: '• Mobile-first redesign approved\n• DClutter v2 target: Aug 2026\n• Budget approved: ₹12L\n• Rajesh to lead frontend, Meera on backend\n• Next review: 1st June 2026' },
  16: { itemId: 16, description: 'Car insurance renewal checklist', shortDescription: 'Car Insurance Notes', itemTypeId: 6, itemTypeName: 'Notes', variantId: 25, variantName: 'Notes', isActive: true, createdDate: d(4), lastUpdatedDate: d(4), noteTitle: 'Car Insurance Renewal', noteContent: '1. Compare HDFC Ergo vs New India\n2. Check no-claim bonus\n3. Add zero dep add-on\n4. Renew before 15 Jun 2026\n5. Keep RC copy ready' },
  17: { itemId: 17, description: 'Home renovation ideas — Bengaluru flat', shortDescription: 'Home Reno Ideas', itemTypeId: 6, itemTypeName: 'Notes', variantId: 25, variantName: 'Notes', isActive: true, createdDate: d(8), lastUpdatedDate: d(8), noteTitle: 'Home Renovation Ideas', noteContent: '• Kitchen: modular cabinets, granite top\n• Bedroom: false ceiling with LED\n• Living room: TV unit with wallpaper accent\n• Budget estimate: ₹2.5L–3.5L\n• Interior designer: Aisha Interiors (got ref from Anita)' },
  18: { itemId: 18, description: 'Diet plan and gym schedule for May 2026', shortDescription: 'Diet & Gym Plan', itemTypeId: 6, itemTypeName: 'Notes', variantId: 25, variantName: 'Notes', isActive: true, createdDate: d(12), lastUpdatedDate: d(10), noteTitle: 'Diet & Gym — May 2026', noteContent: 'Gym: Mon/Wed/Fri 6:30 AM\nDiet:\n• Breakfast: Oats + banana + black coffee\n• Lunch: Rice + dal + sabzi (no fried)\n• Dinner: Roti + paneer\n• Water: 3L/day\nTarget: lose 4 kg by end of May' },
  19: { itemId: 19, description: 'UIDAI Aadhaar portal — uidai.gov.in', shortDescription: 'UIDAI Aadhaar', itemTypeId: 7, itemTypeName: 'HyperLink', variantId: 26, variantName: 'HyperLink', isActive: true, createdDate: d(20), lastUpdatedDate: d(20), hyperlinkUrl: 'https://uidai.gov.in', hyperlinkDescription: 'Official UIDAI portal for Aadhaar updates, e-KYC and virtual ID generation' },
  20: { itemId: 20, description: 'HDFC NetBanking — netbanking.hdfcbank.com', shortDescription: 'HDFC NetBanking', itemTypeId: 7, itemTypeName: 'HyperLink', variantId: 26, variantName: 'HyperLink', isActive: true, createdDate: d(25), lastUpdatedDate: d(22), hyperlinkUrl: 'https://netbanking.hdfcbank.com', hyperlinkDescription: 'HDFC Bank internet banking login' },
  21: { itemId: 21, description: 'IRCTC train booking — irctc.co.in', shortDescription: 'IRCTC Booking', itemTypeId: 7, itemTypeName: 'HyperLink', variantId: 26, variantName: 'HyperLink', isActive: true, createdDate: d(30), lastUpdatedDate: d(30), hyperlinkUrl: 'https://www.irctc.co.in', hyperlinkDescription: 'Indian Railways ticket booking portal' },
  22: { itemId: 22, description: 'MakeMyTrip flight search — makemytrip.com', shortDescription: 'MakeMyTrip', itemTypeId: 7, itemTypeName: 'HyperLink', variantId: 26, variantName: 'HyperLink', isActive: true, createdDate: d(35), lastUpdatedDate: d(35), hyperlinkUrl: 'https://www.makemytrip.com', hyperlinkDescription: 'Flight, hotel and holiday bookings' },
  23: { itemId: 23, description: 'Aadhaar Card — 4521 XXXX XXXX 8834', shortDescription: 'Aadhaar Card', itemTypeId: 4, itemTypeName: 'Document', variantId: 16, variantName: 'ID Document', isActive: true, createdDate: d(180), lastUpdatedDate: d(180) },
  24: { itemId: 24, description: 'PAN Card — ABCPK1234X', shortDescription: 'PAN Card', itemTypeId: 4, itemTypeName: 'Document', variantId: 16, variantName: 'ID Document', isActive: true, createdDate: d(180), lastUpdatedDate: d(180) },
  25: { itemId: 25, description: 'Driving Licence — KA01-20200123456', shortDescription: 'Driving Licence', itemTypeId: 4, itemTypeName: 'Document', variantId: 16, variantName: 'ID Document', isActive: true, createdDate: d(90), lastUpdatedDate: d(90) },
  26: { itemId: 26, description: 'Maruti Swift Service Record — May 2026', shortDescription: 'Car Service Record', itemTypeId: 4, itemTypeName: 'Document', variantId: 17, variantName: 'General Document', isActive: true, createdDate: d(7), lastUpdatedDate: d(7) },
  27: { itemId: 27, description: 'HDFC NetBanking credentials', shortDescription: 'HDFC NetBanking', itemTypeId: 5, itemTypeName: 'Credentials', variantId: 23, variantName: 'Bank Credentials', isActive: true, createdDate: d(60), lastUpdatedDate: d(14), credUsername: 'praveen_kumar_hdfc', credPassword: '••••••••', credWebsite: 'https://netbanking.hdfcbank.com' },
  28: { itemId: 28, description: 'Gmail — personal account', shortDescription: 'Gmail Personal', itemTypeId: 5, itemTypeName: 'Credentials', variantId: 24, variantName: 'App / Web', isActive: true, createdDate: d(90), lastUpdatedDate: d(7), credUsername: 'praveen.personal', credEmail: 'praveen.personal@gmail.com', credPassword: '••••••••', credWebsite: 'https://mail.google.com' },
  29: { itemId: 29, description: 'GitHub developer account', shortDescription: 'GitHub Account', itemTypeId: 5, itemTypeName: 'Credentials', variantId: 24, variantName: 'App / Web', isActive: true, createdDate: d(120), lastUpdatedDate: d(30), credUsername: 'praveen-dev', credEmail: 'praveen.dev@gmail.com', credPassword: '••••••••', credWebsite: 'https://github.com' },
  30: { itemId: 30, description: 'SBI debit card & NetBanking', shortDescription: 'SBI NetBanking', itemTypeId: 5, itemTypeName: 'Credentials', variantId: 23, variantName: 'Bank Credentials', isActive: true, createdDate: d(150), lastUpdatedDate: d(45), credUsername: 'praveenk_sbi', credPassword: '••••••••', credWebsite: 'https://www.onlinesbi.sbi' },
  31: { itemId: 31, description: 'TechMind Solutions — IT services company', shortDescription: 'TechMind Solutions', itemTypeId: 8, itemTypeName: 'Entity', variantId: 28, variantName: 'Business Entity', isActive: true, createdDate: d(60), lastUpdatedDate: d(8), entityWebsiteUrl: 'https://techmind.in', entityAvailabilityHours: 'Mon–Fri 9 AM–6 PM' },
  32: { itemId: 32, description: 'Sharma & Associates — Chartered Accountants', shortDescription: 'Sharma & Associates', itemTypeId: 8, itemTypeName: 'Entity', variantId: 27, variantName: 'Service Entity', isActive: true, createdDate: d(90), lastUpdatedDate: d(9), entityAvailabilityHours: 'Mon–Sat 10 AM–5 PM' },
  33: { itemId: 33, description: 'Fortis Hospital — Bengaluru', shortDescription: 'Fortis Hospital', itemTypeId: 8, itemTypeName: 'Entity', variantId: 27, variantName: 'Service Entity', isActive: true, createdDate: d(120), lastUpdatedDate: d(5), entityWebsiteUrl: 'https://www.fortishealthcare.com', entityAvailabilityHours: '24×7' },
  34: { itemId: 34, description: 'HDFC Bank — Indiranagar Branch', shortDescription: 'HDFC Indiranagar', itemTypeId: 8, itemTypeName: 'Entity', variantId: 27, variantName: 'Service Entity', isActive: true, createdDate: d(180), lastUpdatedDate: d(20), entityWebsiteUrl: 'https://www.hdfcbank.com', entityAvailabilityHours: 'Mon–Sat 9:30 AM–3:30 PM' },
  35: { itemId: 35, description: 'Barbeque Nation, Koramangala 5th Block', shortDescription: 'BBQ Nation Koramangala', itemTypeId: 9, itemTypeName: 'Location', variantId: 30, variantName: 'Location', isActive: true, createdDate: d(15), lastUpdatedDate: d(11), locationMapsLink: 'https://maps.google.com/?q=Barbeque+Nation+Koramangala', locationLatitude: 12.9352, locationLongitude: 77.6245, locationKeywords: 'restaurant, grill, koramangala' },
  36: { itemId: 36, description: 'Home address — Whitefield, Bengaluru', shortDescription: 'Home — Whitefield', itemTypeId: 9, itemTypeName: 'Location', variantId: 35, variantName: 'Address', isActive: true, createdDate: d(365), lastUpdatedDate: d(90), addressHouseFlat: 'Flat 304', addressBuilding: 'Sobha Dream Acres', addressArea: 'Whitefield', addressCity: 'Bengaluru', addressState: 'Karnataka', addressPostalCode: '560066', addressCountry: 'India' },
  37: { itemId: 37, description: 'Office — Electronic City Phase 1, Bengaluru', shortDescription: 'Office — EC Phase 1', itemTypeId: 9, itemTypeName: 'Location', variantId: 35, variantName: 'Address', isActive: true, createdDate: d(365), lastUpdatedDate: d(60), addressBuilding: 'Infosys SEZ, Building 5', addressArea: 'Electronic City Phase 1', addressCity: 'Bengaluru', addressState: 'Karnataka', addressPostalCode: '560100', addressCountry: 'India' },
  38: { itemId: 38, description: 'HDFC Bank Indiranagar — 100 Feet Rd', shortDescription: 'HDFC Indiranagar', itemTypeId: 9, itemTypeName: 'Location', variantId: 30, variantName: 'Location', isActive: true, createdDate: d(180), lastUpdatedDate: d(20), locationMapsLink: 'https://maps.google.com/?q=HDFC+Bank+Indiranagar', locationLatitude: 12.9784, locationLongitude: 77.6408, locationDirections: 'Next to CMH Road junction, ground floor of the Prestige building' },
  39: { itemId: 39, description: 'Angular 19 standalone components — key notes', shortDescription: 'Angular 19 Standalone', itemTypeId: 10, itemTypeName: 'Knowledge Repo', variantId: 33, variantName: 'Memory', isActive: true, createdDate: d(5), lastUpdatedDate: d(5), noteTitle: 'Angular 19 Standalone', noteContent: '• No NgModule needed in standalone components\n• Use imports: [] directly in @Component\n• provideRouter() replaces RouterModule.forRoot()\n• Lazy loading: loadComponent() for standalone\n• HttpClient: provideHttpClient(withInterceptors([]))\n• Animations: provideAnimationsAsync()' },
  40: { itemId: 40, description: 'Prompt: Summarize meeting in 3 bullet points', shortDescription: 'AI Meeting Summary Prompt', itemTypeId: 10, itemTypeName: 'Knowledge Repo', variantId: 31, variantName: 'Prompt', isActive: true, createdDate: d(3), lastUpdatedDate: d(2), noteTitle: 'Meeting Summary Prompt', noteContent: 'Summarize the following meeting transcript into exactly 3 concise bullet points. Focus on decisions made, action items, and key insights. Format: • [Point]. Keep each bullet under 15 words.' },
  41: { itemId: 41, description: 'Idea: Build expense tracker with UPI integration', shortDescription: 'Expense Tracker Idea', itemTypeId: 10, itemTypeName: 'Knowledge Repo', variantId: 32, variantName: 'Idea', isActive: true, createdDate: d(14), lastUpdatedDate: d(14), noteTitle: 'UPI Expense Tracker Idea', noteContent: '• Parse UPI SMS notifications automatically\n• Categorise: Food, Transport, Bills, Shopping\n• Monthly budget alerts\n• Tech stack: Angular + Firebase + UPI Autopay API\n• Monetise: ₹99/month premium tier' },
  42: { itemId: 42, description: 'Memory: Rajesh prefers WhatsApp over email', shortDescription: 'Rajesh contact pref', itemTypeId: 10, itemTypeName: 'Knowledge Repo', variantId: 33, variantName: 'Memory', isActive: true, createdDate: d(20), lastUpdatedDate: d(20), noteTitle: 'Rajesh Kumar — Preferences', noteContent: '• Prefers WhatsApp for quick updates, email for formal docs\n• Responds faster before 10 AM or after 7 PM\n• Vegetarian — avoid non-veg lunch venues\n• Prefers Google Meet over Zoom' },
  43: { itemId: 43, description: 'Submit ITR for FY 2025-26 — Due 31 Jul 2026', shortDescription: 'ITR Filing Task', itemTypeId: 2, itemTypeName: 'WorkUnit', variantId: 36, variantName: 'Task', isActive: true, createdDate: d(10), lastUpdatedDate: d(9) },
  44: { itemId: 44, description: 'Renew car insurance — HDFC Ergo [High] Due: 2026-06-15', shortDescription: 'Car Insurance Renewal', itemTypeId: 2, itemTypeName: 'WorkUnit', variantId: 36, variantName: 'Task', isActive: true, createdDate: d(5), lastUpdatedDate: d(5) },
  45: { itemId: 45, description: 'Fix DClutter Android keyboard push-up issue', shortDescription: 'Android KB Fix', itemTypeId: 2, itemTypeName: 'WorkUnit', variantId: 36, variantName: 'Task', isActive: true, createdDate: d(2), lastUpdatedDate: d(1) },
  46: { itemId: 46, description: 'Review Q2 sprint backlog with Rajesh', shortDescription: 'Q2 Sprint Review', itemTypeId: 2, itemTypeName: 'WorkUnit', variantId: 36, variantName: 'Task', isActive: false, createdDate: d(15), lastUpdatedDate: d(12) },
  47: { itemId: 47, description: 'Zomato order — Butter Chicken — ₹420 — @ Spice Garden — [Food] — 2026-05-19', shortDescription: 'Zomato ₹420', itemTypeId: 12, itemTypeName: 'Money', variantId: 37, variantName: 'Expenses/Receipts', isActive: true, createdDate: d(1), lastUpdatedDate: d(1) },
  48: { itemId: 48, description: 'Ola Auto fare — Office commute — ₹85 — 2026-05-20', shortDescription: 'Ola ₹85', itemTypeId: 12, itemTypeName: 'Money', variantId: 37, variantName: 'Expenses/Receipts', isActive: true, createdDate: d(0), lastUpdatedDate: d(0) },
  49: { itemId: 49, description: 'Big Basket grocery — ₹1850 — [Groceries] — 2026-05-17', shortDescription: 'BigBasket ₹1850', itemTypeId: 12, itemTypeName: 'Money', variantId: 37, variantName: 'Expenses/Receipts', isActive: true, createdDate: d(3), lastUpdatedDate: d(3) },
  50: { itemId: 50, description: 'Maruti Swift service charge — ₹4200 — @ Mandovi Motors — 2026-05-13', shortDescription: 'Service ₹4200', itemTypeId: 12, itemTypeName: 'Money', variantId: 37, variantName: 'Expenses/Receipts', isActive: true, createdDate: d(7), lastUpdatedDate: d(7) },
};

// ─── Activity log ─────────────────────────────────────────────────────────────
export const DEMO_ACTIVITY_LOG: ActivityItem[] = [
  { logId: 1, activityId: 1, activityName: 'Call — Rajesh Q2',       date: d(1),  durationMinutes: 30, notes: 'Discussed Q2 roadmap. Next sync on 1 Jun.', createdAt: d(1)  },
  { logId: 2, activityId: 8, activityName: 'Insurance Renewal Call',  date: d(3),  durationMinutes: 15, notes: 'Spoke with HDFC Ergo agent. Renewal due 15 Jun.', createdAt: d(3) },
  { logId: 3, activityId: 4, activityName: 'CA — ITR Filing',         date: d(9),  durationMinutes: 60, notes: 'Priya confirmed appointment for 22 May.', createdAt: d(9)  },
  { logId: 4, activityId: 2, activityName: 'Doctor — Fortis',         date: d(5),  durationMinutes: 45, notes: 'Follow-up in 2 weeks. Prescribed Vitamin D.', createdAt: d(5)  },
  { logId: 5, activityId: 3, activityName: 'Online Kickoff Mtg',      date: d(6),  durationMinutes: 90, notes: 'Kickoff done. Sprint 1 starts 20 May.', createdAt: d(6)  },
  { logId: 6, activityId: 5, activityName: 'Team Lunch BBQ',          date: d(11), durationMinutes: 90, notes: 'Good team morale. 8 people attended.', createdAt: d(11) },
  { logId: 7, activityId: 7, activityName: 'Vendor Review Mtg',       date: d(14), durationMinutes: 60, notes: 'Shortlisted 2 vendors. Decision next week.', createdAt: d(14)},
  { logId: 8, activityId: 6, activityName: 'HDFC Bank Visit',         date: d(20), durationMinutes: 45, notes: 'KYC updated. Cheque book requested.', createdAt: d(20) },
];

// ─── Lists ────────────────────────────────────────────────────────────────────
export const DEMO_LISTS: ListItem[] = [
  { listId: 1, listName: 'Tax & Finance 2026',   createdDate: d(30), lastUsedDate: d(9)  },
  { listId: 2, listName: 'Home Project',         createdDate: d(20), lastUsedDate: d(8)  },
  { listId: 3, listName: 'Important Contacts',   createdDate: d(90), lastUsedDate: d(5)  },
  { listId: 4, listName: 'Dev Resources',        createdDate: d(14), lastUsedDate: d(2)  },
  { listId: 5, listName: 'May 2026 Expenses',    createdDate: d(5),  lastUsedDate: d(0)  },
];

// Items belonging to each list  (listId → itemIds)
export const DEMO_LIST_ITEMS: Record<number, number[]> = {
  1: [43, 10, 24, 27, 30, 4],      // Tax & Finance — tasks, CA, docs, creds, appointment
  2: [17, 35, 36, 41],              // Home Project — notes, locations, idea
  3: [9, 10, 11, 12, 13],           // Contacts
  4: [19, 20, 21, 22, 39, 40, 29], // Dev Resources — links, knowledge, github
  5: [47, 48, 49, 50],              // May Expenses
};

// ─── Mutable demo store (supports create/update/delete in-session) ─────────────
export class DemoStore {
  static items: ItemModel[]             = [...DEMO_ITEMS];
  static details: Record<number, ItemDetailModel> = { ...DEMO_ITEM_DETAILS };
  static lists: ListItem[]              = [...DEMO_LISTS];
  static listItems: Record<number, number[]> = { ...DEMO_LIST_ITEMS };
  static activityLog: ActivityItem[]    = [...DEMO_ACTIVITY_LOG];
  private static nextId = 1001;
  private static nextListId = 101;

  static nextItemId(): number { return this.nextId++; }
  static nextNewListId(): number { return this.nextListId++; }

  static addItem(item: ItemModel, detail: ItemDetailModel): void {
    this.items.unshift(item);
    this.details[item.itemId] = detail;
    // Update type count
    const type = DEMO_ITEM_TYPES.find(t => t.itemTypeId === item.itemTypeId);
    if (type) type.count++;
  }

  static updateItem(id: number, patch: Partial<ItemDetailModel>): void {
    const idx = this.items.findIndex(i => i.itemId === id);
    if (idx !== -1) {
      this.items[idx] = {
        ...this.items[idx],
        description: patch.description ?? this.items[idx].description,
        shortDescription: patch.shortDescription ?? this.items[idx].shortDescription,
        isActive: patch.isActive ?? this.items[idx].isActive,
        lastUpdatedDate: new Date().toISOString(),
      };
    }
    if (this.details[id]) {
      this.details[id] = { ...this.details[id], ...patch, lastUpdatedDate: new Date().toISOString() };
    }
  }

  static deleteItem(id: number): void {
    const item = this.items.find(i => i.itemId === id);
    this.items = this.items.filter(i => i.itemId !== id);
    delete this.details[id];
    if (item) {
      const type = DEMO_ITEM_TYPES.find(t => t.itemTypeId === item.itemTypeId);
      if (type && type.count > 0) type.count--;
    }
    // Remove from any list
    Object.keys(this.listItems).forEach(k => {
      this.listItems[+k] = this.listItems[+k].filter(id2 => id2 !== id);
    });
  }

  static addList(name: string): ListItem {
    const list: ListItem = {
      listId: this.nextNewListId(),
      listName: name,
      createdDate: new Date().toISOString(),
      lastUsedDate: new Date().toISOString(),
    };
    this.lists.unshift(list);
    this.listItems[list.listId] = [];
    return list;
  }

  static deleteList(listId: number): void {
    this.lists = this.lists.filter(l => l.listId !== listId);
    delete this.listItems[listId];
  }

  static getItemsForList(listId: number): ItemModel[] {
    const ids = this.listItems[listId] ?? [];
    return ids.map(id => this.items.find(i => i.itemId === id)).filter(Boolean) as ItemModel[];
  }

  static getTypeCounts(): ItemType[] {
    // Build fresh counts from current items
    const map = new Map<number, number>();
    this.items.forEach(i => {
      if (i.itemTypeId != null) map.set(i.itemTypeId, (map.get(i.itemTypeId) ?? 0) + 1);
    });
    return DEMO_ITEM_TYPES.map(t => ({ ...t, count: map.get(t.itemTypeId) ?? 0 })).filter(t => t.count > 0);
  }
}
