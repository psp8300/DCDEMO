# DClutter Angular

A personal information management app built with Angular 19 and .NET 9 Web API. Rebuild of the original WinForms DClutter desktop app.

## What It Does

Store and organise everything in one place — contacts, notes, credentials, activities, tasks, links, documents, entities, locations, knowledge, and expenses — all searchable and filterable by type.

## Item Types

| Type | Variants | What it stores |
|------|----------|----------------|
| Activity | Call, Visit, Meeting, Online Meeting, Schedule | Logged interactions with contacts |
| Note | — | Quick text notes |
| HyperLink | — | URLs and web links |
| Contact | Personal, Emergency | People with phone and email |
| Document | ID Document, General | Doc number, dates, issuing authority |
| Credentials | Bank, App/Web | Usernames, passwords, PINs, emails |
| Entity | Service, Business, Govt | Organisations with website and hours |
| Location | Location/Place, Address | Coordinates, maps links, or structured address |
| Knowledge | Prompt, Idea, Memory | Free-form knowledge capture |
| Task | — | Tasks with priority and due date |
| Money | Expenses/Receipts | Amount, merchant, category |

---

## Prerequisites

- Node.js 20+
- Angular CLI 19: `npm install -g @angular/cli`
- .NET 9 SDK
- SQL Server (local or Express) with Windows Authentication

---

## Setup

### 1. Database

Restore or run the schema script on your SQL Server instance.

- Database name: `DClutter_Angular`
- Auth: Windows Authentication

> Ask the developer for the `.bak` backup file or the schema `.sql` script.

### 2. API

```bash
git clone https://github.com/psp8300/DCApi.git
cd DCApi
```

Update the connection string in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_INSTANCE;Database=DClutter_Angular;Trusted_Connection=True;TrustServerCertificate=True"
}
```

```bash
dotnet run
```

API runs on `http://localhost:5000`

### 3. Angular App

```bash
git clone https://github.com/psp8300/DCAngular.git
cd DCAngular
npm install
ng serve
```

App runs on `http://localhost:4200`

---

## Usage

1. Open `http://localhost:4200`
2. Log in with your user credentials
3. Use **Items** to browse, search, and filter all your data
4. Click **New Item** to create any of the 11 item types

---

## Project Structure

```
src/app/
├── pages/
│   ├── login/          # Login page
│   ├── home/           # Dashboard
│   ├── items/          # Main items list with search + type filter
│   ├── activity/       # Activity log
│   └── lists/          # Lists
├── dialogs/
│   ├── create-item/        # Type selector (entry point for all creates)
│   ├── create-activity/    # 3-step stepper: type > details > contact
│   ├── create-note/
│   ├── create-hyperlink/
│   ├── create-contact/
│   ├── create-document/
│   ├── create-credentials/
│   ├── create-entity/
│   ├── create-location/    # Location + Address in one dialog
│   ├── create-knowledge/
│   ├── create-workunit/
│   └── create-money/
└── services/
    └── items.service.ts    # All API calls and TypeScript interfaces
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 19, Angular Material, standalone components |
| Backend | .NET 9 Web API, ADO.NET (SqlCommand) |
| Database | SQL Server, Windows Authentication |

---

## Repos

- Frontend: https://github.com/psp8300/DCAngular
- Backend API: https://github.com/psp8300/DCApi
