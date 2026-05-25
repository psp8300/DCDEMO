import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DemoStore,
  DEMO_CONTACTS,
  DEMO_PHONES,
  DEMO_VARIANTS,
  DEMO_TEAM_MEMBERS,
} from './demo.data';
import { ItemDetailModel, ItemModel } from '../services/items.service';

/** Simulate a tiny network delay (ms) so the UI feels real */
const DELAY = 250;

function ok(body: unknown) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(DELAY));
}

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.demo) return next(req);

  const url = req.url;
  const method = req.method.toUpperCase();

  // ── Auth ──────────────────────────────────────────────────────────────────
  // POST /auth/login
  if (method === 'POST' && url.includes('/auth/login')) {
    const body = req.body as { username?: string; password?: string };
    const u = (body?.username ?? '').toLowerCase().trim();
    const p = (body?.password ?? '').trim();
    if ((u === 'employee1@dc.com' || u === 'employee1') && p === 'dce1') {
      return ok({ success: true, message: 'Login successful', user: { userId: 2, username: 'employee1@dc.com', email: 'employee1@dc.com', displayName: 'Ravi Kumar', role: 'Employee', hourlyRate: 200, defaultLocation: 'Office' } });
    }
    if ((u === 'employee2@dc.com' || u === 'employee2') && p === 'dce2') {
      return ok({ success: true, message: 'Login successful', user: { userId: 3, username: 'employee2@dc.com', email: 'employee2@dc.com', displayName: 'Preethi Nair', role: 'Employee', hourlyRate: 180, defaultLocation: 'Home' } });
    }
    if ((u === 'manager@dc.com' || u === 'manager' || u === 'demo') && (p === 'dcm' || p === 'demo')) {
      return ok({ success: true, message: 'Login successful', user: { userId: 1, username: 'manager@dc.com', email: 'manager@dc.com', displayName: 'Demo Manager', role: 'Manager', hourlyRate: 249, defaultLocation: 'Office' } });
    }
    return ok({ success: false, message: 'Invalid email or password.' });
  }

  // ── Items ─────────────────────────────────────────────────────────────────

  // GET /items/{userId}/types
  if (method === 'GET' && /\/items\/\d+\/types$/.test(url)) {
    return ok({ success: true, types: DemoStore.getTypeCounts() });
  }

  // GET /items/{userId}/variants
  if (method === 'GET' && /\/items\/\d+\/variants$/.test(url)) {
    return ok({ success: true, variants: DEMO_VARIANTS });
  }

  // GET /items/{userId}/contacts?search=...
  if (method === 'GET' && /\/items\/\d+\/contacts/.test(url)) {
    const search = new URL(url, 'http://x').searchParams.get('search')?.toLowerCase() ?? '';
    const filtered = DEMO_CONTACTS.filter(c =>
      !search || c.name.toLowerCase().includes(search)
    );
    return ok({ success: true, contacts: filtered });
  }

  // GET /items/{userId}/phones/{contactItemId}
  if (method === 'GET' && /\/items\/\d+\/phones\/\d+$/.test(url)) {
    const contactId = +url.split('/phones/')[1];
    return ok({ success: true, phones: DEMO_PHONES[contactId] ?? [] });
  }

  // GET /items/{userId}/{itemId}  (detail)
  if (method === 'GET' && /\/items\/\d+\/\d+$/.test(url)) {
    const parts = url.split('/');
    const itemId = +parts[parts.length - 1];
    const detail = DemoStore.details[itemId];
    if (detail) {
      return ok({ success: true, item: detail });
    }
    // Fallback: build minimal detail from list item
    const listItem = DemoStore.items.find(i => i.itemId === itemId);
    if (listItem) {
      return ok({ success: true, item: { ...listItem } });
    }
    return ok({ success: false, message: 'Item not found' });
  }

  // GET /items/{userId}?page=&pageSize=&search=&itemTypeId=
  if (method === 'GET' && /\/items\/\d+$/.test(url)) {
    const params = new URL(url, 'http://x').searchParams;
    const search      = params.get('search')?.toLowerCase() ?? '';
    const typeId      = params.get('itemTypeId') ? +params.get('itemTypeId')! : null;
    const page        = +(params.get('page') ?? 1);
    const pageSize    = +(params.get('pageSize') ?? 50);

    let filtered = DemoStore.items.filter(item => {
      const matchType   = typeId == null || item.itemTypeId === typeId;
      const matchSearch = !search
        || item.description.toLowerCase().includes(search)
        || item.shortDescription.toLowerCase().includes(search);
      return matchType && matchSearch;
    });

    const totalCount = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return ok({ success: true, items: paged, totalCount });
  }

  // POST /items  (create)
  if (method === 'POST' && /\/items$/.test(url)) {
    const body: any = req.body;
    const newId = DemoStore.nextItemId();
    const typeName = DEMO_VARIANTS.find(v => v.variantId === body.variantId)?.itemType ?? 'Item';

    const listItem: ItemModel = {
      itemId: newId,
      description: body.description ?? '',
      shortDescription: body.description?.substring(0, 60) ?? '',
      itemTypeId: body.itemTypeId,
      itemTypeName: typeName,
      isActive: true,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    };

    const detail: ItemDetailModel = {
      ...listItem,
      variantId: body.variantId,
      variantName: DEMO_VARIANTS.find(v => v.variantId === body.variantId)?.variantName,
      contactItemId: body.contactItemId,
      contactName: DEMO_CONTACTS.find(c => c.itemId === body.contactItemId)?.name,
      phoneNumberId: body.phoneNumberId,
      phoneNumber: body.phoneNumber,
      meetingPlatform: body.meetingPlatform,
      meetingLink: body.meetingLink,
      meetingIdNumber: body.meetingIdNumber,
      meetingPassword: body.meetingPassword,
      scheduleFrom: body.scheduleFrom,
      scheduleTo: body.scheduleTo,
      isFullDay: body.isFullDay,
      noteTitle: body.noteTitle,
      noteContent: body.noteContent,
      hyperlinkUrl: body.hyperlinkUrl,
      hyperlinkDescription: body.hyperlinkDescription,
      credUsername: body.credUsername,
      credPassword: body.credPassword,
      credEmail: body.credEmail,
      credPin: body.credPin,
      credMobile: body.credMobile,
      credWebsite: body.credWebsite,
      entityWebsiteUrl: body.entityWebsiteUrl,
      entityAvailabilityHours: body.entityAvailabilityHours,
      locationMapsLink: body.locationMapsLink,
      locationLatitude: body.locationLatitude,
      locationLongitude: body.locationLongitude,
      locationDirections: body.locationDirections,
      locationKeywords: body.locationKeywords,
      addressHouseFlat: body.addressHouseFlat,
      addressBuilding: body.addressBuilding,
      addressArea: body.addressArea,
      addressStreet: body.addressStreet,
      addressCity: body.addressCity,
      addressState: body.addressState,
      addressPostalCode: body.addressPostalCode,
      addressCountry: body.addressCountry,
      contactIsPersonal: body.contactIsPersonal,
      contactIsEmergency: body.contactIsEmergency,
      contactPhone: body.contactPhone,
      contactPhoneIsWork: body.contactPhoneIsWork,
      contactPhoneIsPrimary: body.contactPhoneIsPrimary,
      contactEmail: body.contactEmail,
      contactEmailIsWork: body.contactEmailIsWork,
    };

    DemoStore.addItem(listItem, detail);
    return ok({ success: true, itemId: newId, message: 'Item created' });
  }

  // PUT /items/{itemId}  (update)
  if (method === 'PUT' && /\/items\/\d+$/.test(url)) {
    const parts = url.split('/');
    const itemId = +parts[parts.length - 1];
    const body: any = req.body;
    DemoStore.updateItem(itemId, { ...body });
    return ok({ success: true, itemId, message: 'Item updated' });
  }

  // DELETE /items/{userId}/{itemId}
  if (method === 'DELETE' && /\/items\/\d+\/\d+$/.test(url)) {
    const parts = url.split('/');
    const itemId = +parts[parts.length - 1];
    DemoStore.deleteItem(itemId);
    return ok({ success: true, message: 'Item deleted' });
  }

  // ── Activity log ──────────────────────────────────────────────────────────
  // GET /activity/{userId}
  if (method === 'GET' && /\/activity\/\d+$/.test(url)) {
    return ok({ success: true, activities: DemoStore.activityLog, message: '' });
  }

  // ── Lists ─────────────────────────────────────────────────────────────────

  // GET /lists/{userId}/{listId}/items
  if (method === 'GET' && /\/lists\/\d+\/\d+\/items$/.test(url)) {
    const parts = url.split('/');
    const listId = +parts[parts.length - 2];
    const items = DemoStore.getItemsForList(listId);
    return ok({ success: true, items, totalCount: items.length });
  }

  // DELETE /lists/{userId}/{listId}
  if (method === 'DELETE' && /\/lists\/\d+\/\d+$/.test(url)) {
    const parts = url.split('/');
    const listId = +parts[parts.length - 1];
    DemoStore.deleteList(listId);
    return ok({ success: true, message: 'List deleted' });
  }

  // POST /lists  (create list)
  if (method === 'POST' && /\/lists$/.test(url)) {
    const body: any = req.body;
    const list = DemoStore.addList(body.listName ?? 'New List');
    return ok({ success: true, listId: list.listId, message: 'List created' });
  }

  // GET /lists/{userId}
  if (method === 'GET' && /\/lists\/\d+$/.test(url)) {
    return ok({ success: true, lists: DemoStore.lists, message: '' });
  }

  // ── Workday ───────────────────────────────────────────────────────────────

  if (method === 'POST' && url.includes('/workday/start')) {
    const body = req.body as { userId?: number; location?: string };
    const session = DemoStore.startWorkday(body.userId ?? 1, (body.location ?? 'Office') as 'Office' | 'Home');
    return ok({ success: true, sessionId: session.sessionId });
  }

  if (method === 'POST' && /\/workday\/\d+\/end/.test(url)) {
    const sessionId = +url.match(/\/workday\/(\d+)\/end/)![1];
    DemoStore.endWorkday(sessionId);
    return ok({ success: true });
  }

  if (method === 'POST' && /\/workday\/\d+\/activity/.test(url)) {
    const sessionId = +url.match(/\/workday\/(\d+)\/activity/)![1];
    const body = req.body as { activityType?: string; taskId?: number };
    const act = DemoStore.changeActivity(sessionId, (body.activityType ?? 'SystemWork') as 'SystemWork' | 'LunchBreak' | 'CoffeeBreak' | 'ScreenLock' | 'PersonalBreak', body.taskId);
    return ok({ success: true, workActivityId: act.workActivityId });
  }

  if (method === 'GET' && /\/workday\/team\/\d+\/live/.test(url)) {
    const managerId = +url.match(/\/workday\/team\/(\d+)/)![1];
    return ok({ success: true, members: DemoStore.getTeamLiveStatus(managerId) });
  }

  if (method === 'GET' && /\/workday\/team\/\d+\/attendance/.test(url)) {
    const params = new URL(url, 'http://x').searchParams;
    const period = params.get('period') ?? 'day';
    const date   = params.get('date')   ?? new Date().toISOString().split('T')[0];
    const memberId = params.get('memberId') ? +params.get('memberId')! : undefined;
    const managerId = +url.match(/\/workday\/team\/(\d+)/)![1];
    return ok({ success: true, records: DemoStore.getTeamAttendance(managerId, period, date, memberId) });
  }

  if (method === 'GET' && /\/workday\/team\/\d+$/.test(url)) {
    return ok({ success: true, members: DEMO_TEAM_MEMBERS });
  }

  if (method === 'GET' && /\/workday\/attendance\/\d+/.test(url)) {
    const userId = +url.match(/\/workday\/attendance\/(\d+)/)![1];
    const params = new URL(url, 'http://x').searchParams;
    const period = params.get('period') ?? 'month';
    const date   = params.get('date')   ?? new Date().toISOString().split('T')[0];
    return ok({ success: true, records: DemoStore.getAttendance(userId, period, date) });
  }

  if (method === 'GET' && /\/workday\/day\/\d+/.test(url)) {
    const userId = +url.match(/\/workday\/day\/(\d+)/)![1];
    const date   = new URL(url, 'http://x').searchParams.get('date') ?? new Date().toISOString().split('T')[0];
    return ok(DemoStore.getWorkdayView(userId, date));
  }

  // ── Pass-through (should not happen in demo mode) ─────────────────────────
  return next(req);
};
