# Job Application Tracker — Design Spec

## Context

Tyler's portfolio site needs a private, admin-only job application tracker to manage applications, interview rounds, contacts, follow-ups, and get a dashboard overview of the job search pipeline. The site already has a full admin system with auth, Prisma, role-based access, and established CRUD patterns that this feature will follow.

## Data Model

### JobApplication

| Field           | Type          | Notes                                                                                                                                          |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | String (cuid) | PK                                                                                                                                             |
| createdAt       | DateTime      | Auto                                                                                                                                           |
| updatedAt       | DateTime      | Auto                                                                                                                                           |
| company         | String        | Required                                                                                                                                       |
| position        | String        | Required                                                                                                                                       |
| status          | Enum          | APPLIED, PHONE_SCREEN, ONLINE_ASSESSMENT, BEHAVIORAL_INTERVIEW, TECHNICAL_INTERVIEW, ONSITE, OFFER, NEGOTIATING, ACCEPTED, REJECTED, WITHDRAWN |
| applicationDate | DateTime      | Required                                                                                                                                       |
| postingUrl      | String?       | Job listing link                                                                                                                               |
| salaryMin       | Int?          | In dollars                                                                                                                                     |
| salaryMax       | Int?          | In dollars                                                                                                                                     |
| salaryNotes     | String?       | Equity, benefits, etc.                                                                                                                         |
| location        | String?       | City/state or "Remote"                                                                                                                         |
| locationType    | Enum?         | REMOTE, HYBRID, ONSITE                                                                                                                         |
| source          | Enum          | LINKEDIN, COMPANY_SITE, REFERRAL, INDEED, RECRUITER_OUTREACH, OTHER                                                                            |
| sourceDetail    | String?       | e.g. referral name                                                                                                                             |
| resumeVersion   | String?       | Which resume sent                                                                                                                              |
| notes           | String?       | Free-form, long text                                                                                                                           |
| followUpDate    | DateTime?     | When to follow up next                                                                                                                         |
| followUpNotes   | String?       | Follow-up context                                                                                                                              |

Relations: has many Interview, has many JobContact (onDelete: Cascade for both)

### Interview

| Field                | Type          | Notes                                                                 |
| -------------------- | ------------- | --------------------------------------------------------------------- |
| id                   | String (cuid) | PK                                                                    |
| createdAt            | DateTime      | Auto                                                                  |
| updatedAt            | DateTime      | Auto                                                                  |
| jobApplicationId     | String        | FK → JobApplication                                                   |
| type                 | Enum          | PHONE_SCREEN, ONLINE_ASSESSMENT, BEHAVIORAL, TECHNICAL, ONSITE, OTHER |
| scheduledDate        | DateTime      | Required                                                              |
| interviewerNames     | String?       | Free text                                                             |
| prepNotes            | String?       | Pre-interview prep                                                    |
| questionsAsked       | String?       | Questions they asked                                                  |
| yourAnswers          | String?       | Your responses/notes                                                  |
| debriefNotes         | String?       | Post-interview thoughts                                               |
| rating               | Int?          | 1-5, validated server-side                                            |
| followUpSentAt       | DateTime?     | Thank-you sent date                                                   |
| expectedResponseDate | DateTime?     | When they said you'd hear back                                        |
| responseReceivedAt   | DateTime?     | When you actually heard back                                          |

### JobContact

| Field            | Type          | Notes               |
| ---------------- | ------------- | ------------------- |
| id               | String (cuid) | PK                  |
| jobApplicationId | String        | FK → JobApplication |
| name             | String        | Required            |
| title            | String?       | Job title           |
| email            | String?       |                     |
| phone            | String?       |                     |
| notes            | String?       |                     |

### Enums

```
enum JobStatus {
  APPLIED
  PHONE_SCREEN
  ONLINE_ASSESSMENT
  BEHAVIORAL_INTERVIEW
  TECHNICAL_INTERVIEW
  ONSITE
  OFFER
  NEGOTIATING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum JobSource {
  LINKEDIN
  COMPANY_SITE
  REFERRAL
  INDEED
  RECRUITER_OUTREACH
  OTHER
}

enum LocationType {
  REMOTE
  HYBRID
  ONSITE
}

enum InterviewType {
  PHONE_SCREEN
  ONLINE_ASSESSMENT
  BEHAVIORAL
  TECHNICAL
  ONSITE
  OTHER
}
```

## Pages & Views

All routes under `/admin/jobs/*`, protected by admin role check.

### Main Page — `/admin/jobs`

- Toggle between **Table view** and **Kanban view** (persisted in localStorage)
- **Table view**: Sortable columns (company, position, status, date applied, follow-up date). Filterable by status and source. Text search across company/position. Pagination.
- **Kanban view**: Columns for each status. Cards show company, position, application date. Drag-and-drop between columns using dnd-kit to update status. Cards show color-coded overdue follow-up indicator.
- Both views: color-coded badge when follow-up date is past due (red) or due today (yellow)

### Dashboard — `/admin/jobs/dashboard`

- **Stats row**: Total applications, Active count (not accepted/rejected/withdrawn), Offers received, Rejection rate (%), Avg days in pipeline
- **Charts** (Recharts):
  - Applications over time (bar chart, by week/month)
  - Pipeline funnel (horizontal bar)
  - Applications by source (donut chart)
  - Response rate by source (bar chart)
- **Needs Attention section**:
  - Overdue follow-ups (past followUpDate with no status change)
  - Interviews scheduled this week
  - Applications waiting past expectedResponseDate

### Detail Page — `/admin/jobs/[id]`

- Application info displayed at top, editable via form
- Sections/tabs:
  - **Interviews**: Timeline of rounds, each expandable showing prep notes, questions, debrief, rating (1-5 stars), follow-up tracking (sent date, expected response, actual response)
  - **Contacts**: List of people at the company with contact info
  - **Notes**: The free-form notes field, editable
- Inline add for new interviews and contacts
- Delete application with confirmation modal

### New Application — `/admin/jobs/new`

- Form with core fields (company, position, status, date, source, posting URL, salary, resume version, notes, follow-up date)
- Interviews and contacts added after creation on the detail page

### Nav Integration

- Add "Jobs" link to admin navigation alongside Projects, Contacts, Members, Chat Sessions

## API Routes

All routes require admin role via `getServerSession(authOptions)`.

| Method | Route                                           | Purpose                                           |
| ------ | ----------------------------------------------- | ------------------------------------------------- |
| GET    | `/api/admin/jobs`                               | List with filtering, sorting, pagination          |
| POST   | `/api/admin/jobs`                               | Create application                                |
| GET    | `/api/admin/jobs/[id]`                          | Single application with interviews & contacts     |
| PATCH  | `/api/admin/jobs/[id]`                          | Update application (including status from kanban) |
| DELETE | `/api/admin/jobs/[id]`                          | Delete application                                |
| GET    | `/api/admin/jobs/[id]/interviews`               | List interviews                                   |
| POST   | `/api/admin/jobs/[id]/interviews`               | Add interview                                     |
| PATCH  | `/api/admin/jobs/[id]/interviews/[interviewId]` | Update interview                                  |
| DELETE | `/api/admin/jobs/[id]/interviews/[interviewId]` | Delete interview                                  |
| GET    | `/api/admin/jobs/[id]/contacts`                 | List contacts                                     |
| POST   | `/api/admin/jobs/[id]/contacts`                 | Add contact                                       |
| PATCH  | `/api/admin/jobs/[id]/contacts/[contactId]`     | Update contact                                    |
| DELETE | `/api/admin/jobs/[id]/contacts/[contactId]`     | Delete contact                                    |
| GET    | `/api/admin/jobs/dashboard`                     | Aggregated stats and chart data                   |

### API Patterns

- Auth: `getServerSession(authOptions)` → check `role === 'admin'` → 401/403
- Responses: `NextResponse.json({ data })` or `NextResponse.json({ error }, { status })`
- Validation: Check required fields, return 400 with message on failure. Rating validated 1-5 when provided.
- Includes: GET single application uses Prisma `include: { interviews: { orderBy: { scheduledDate: 'asc' } }, contacts: true }`

### GET `/api/admin/jobs` Query Parameters

| Param  | Type            | Default           | Notes                                                     |
| ------ | --------------- | ----------------- | --------------------------------------------------------- |
| page   | number          | 1                 | Pagination                                                |
| limit  | number          | 20                | Page size                                                 |
| sort   | string          | "applicationDate" | Column to sort by                                         |
| order  | "asc" \| "desc" | "desc"            | Sort direction                                            |
| status | string          | —                 | Comma-separated JobStatus values to filter                |
| source | string          | —                 | Comma-separated JobSource values to filter                |
| search | string          | —                 | Searches company and position (case-insensitive contains) |

Response: `{ jobs: JobApplication[], total: number, page: number, totalPages: number }`

### GET `/api/admin/jobs/dashboard` Response Shape

```json
{
  "stats": {
    "total": 42,
    "active": 15,
    "offers": 3,
    "rejectionRate": 0.35,
    "avgDaysInPipeline": 22
  },
  "applicationsOverTime": [{ "period": "2026-W10", "count": 5 }],
  "pipelineFunnel": [{ "status": "APPLIED", "count": 20 }],
  "bySource": [{ "source": "LINKEDIN", "count": 18 }],
  "responseRateBySource": [
    { "source": "LINKEDIN", "responded": 12, "total": 18 }
  ],
  "needsAttention": {
    "overdueFollowUps": [
      { "id": "...", "company": "...", "followUpDate": "..." }
    ],
    "interviewsThisWeek": [
      { "id": "...", "company": "...", "scheduledDate": "..." }
    ],
    "awaitingResponse": [
      { "id": "...", "company": "...", "expectedResponseDate": "..." }
    ]
  }
}
```

### Post-Creation Redirect

`/admin/jobs/new` redirects to `/admin/jobs/[id]` after successful creation so the user can immediately add interviews and contacts.

### Kanban Status Transitions

Any status can be dragged to any other status — no constraints. The pipeline order is a guideline, not enforced.

### Database Indexes

```
@@index([jobApplicationId]) on Interview
@@index([jobApplicationId]) on JobContact
@@index([status]) on JobApplication
@@index([applicationDate]) on JobApplication
@@index([followUpDate]) on JobApplication
```

## Existing Code to Reuse

- **Auth pattern**: `app/lib/auth.ts` — `getServerSession(authOptions)` for route protection
- **Prisma client**: `app/lib/prisma.ts`
- **Toast notifications**: `useToast()` from existing ToastProvider
- **Drag-and-drop**: dnd-kit (already a dependency)
- **Charts**: Recharts (already used in admin dashboard)
- **Modal**: `app/components/Modal.tsx`
- **Admin nav**: existing admin layout pattern
- **Form patterns**: follow existing admin/projects/new and admin/projects/[id] forms
- **API route patterns**: follow existing `/api/admin/users` and `/api/projects/[id]/*` structure

## Verification

1. Run `npx prisma migrate dev` to apply schema changes
2. Run `npm run build` to verify no TypeScript errors
3. Run `npm run dev` and:
   - Log in as admin
   - Create a job application at `/admin/jobs/new`
   - Verify it appears in both table and kanban views
   - Drag a card in kanban to change status
   - Open detail page, add an interview and a contact
   - Check dashboard stats and charts populate
   - Verify non-admin users get redirected from `/admin/jobs`
