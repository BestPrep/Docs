# BestPrep Mentor Portal — Technical Documentation

**Component:** `mentorPortal` (LWC)  
**Apex Controller:** `MentoringMentorPortal`  
**Test Class:** `MentoringMentorPortalTest`  
**Hosted on:** Salesforce Experience Site (`bestprep.my.site.com`)  
**Programs served:** eMentors, Cloud Coach  
**Last updated:** March 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication & Access Control](#authentication--access-control)
4. [Data Model](#data-model)
5. [Apex Controller](#apex-controller)
6. [LWC Component](#lwc-component)
7. [Portal Tabs & Navigation](#portal-tabs--navigation)
8. [Volunteer Agreement Form (VAF)](#volunteer-agreement-form-vaf)
9. [Weekly Messages](#weekly-messages)
10. [Modals](#modals)
11. [Security Measures](#security-measures)
12. [Static Resources](#static-resources)
13. [Test Class](#test-class)
14. [Known Limitations & Deferred Work](#known-limitations--deferred-work)
15. [Deployment Notes](#deployment-notes)

---

## Overview

The Mentor Portal is a public-facing LWC hosted on a Salesforce Experience Site. It gives mentors in the eMentors and Cloud Coach programs a single destination to:

- Complete their annual Volunteer Agreement Form (VAF)
- Read weekly guiding questions and write messages to their student
- View messages from their student
- Manage settings (out-of-office weeks, Cloud Coach track selection)
- Access event info, resources, and calendar links for the Meet & Greet / Cloud Summit
- Switch between multiple connections if they mentor more than one student

Authentication is entirely stateless — no Salesforce login is required. Access is controlled by a `(connectionId, passkey)` pair passed in the URL, which is verified server-side on every Apex call.

---

## Architecture

```
Experience Site (guest user)
    │
    ├── mentorPortal (LWC)
    │       ├── mentorPortal.html       — template
    │       ├── mentorPortal.js         — controller
    │       └── mentorPortal.css        — styles
    │
    └── MentoringMentorPortal (Apex, global without sharing)
            ├── getConnectionData()
            ├── checkMentorMessageExists()
            ├── upsertMentorMessage()
            ├── upsertMentorMessageWithFile()
            ├── updateOutOfOfficeWeeks()
            ├── submitVolunteerAgreement()
            └── getMentorConnections()
```

**Supporting classes:**
- `FileAttachQueueable` — async job that updates `Link_to_File_Attached__c` after a `ContentVersion` finishes processing
- `MessageFilterScheduledJob` — scheduled job that scans `Message__c` records with `Filter_Status__c = 'Flag - New'` and either passes or flags them for review

---

## Authentication & Access Control

### URL Parameters

| Parameter | Description |
|---|---|
| `connectionId` | Salesforce ID of the `Connection__c` record |
| `passkey` | Auto-generated value stored in `Connection_Passkey__c` on the record |
| `targetWeek` | Optional. Short code for the week tab to open on load (`VAF`, `W1`–`W8`, `SV`) |

### Flow

1. The `@wire(CurrentPageReference)` handler in `mentorPortal.js` reads credentials from URL parameters **or** from `sessionStorage` (populated on first successful load).
2. `getConnectionData()` is called with the credentials. The Apex method verifies the passkey before returning any data.
3. On success, credentials are written to `sessionStorage` (`bp_connId`, `bp_pw`) and stripped from the visible URL using `history.replaceState`.
4. On reload, the URL is clean but `sessionStorage` provides the credentials — the portal loads normally.
5. Three server-side conditions cause an `AuraHandledException` and show the access-denied screen:
   - Wrong or missing passkey → generic error message
   - `Deactivate__c = true` on the connection → generic error message
   - Today is more than 10 days after `Case__r.Assigned_End_Date__c` → "Portal access has ended" message

### Session Scoping

`sessionStorage` is tab-scoped and clears when the tab closes. A mentor opening a new tab from a bookmark will see the access-denied screen and must use their original link.

---

## Data Model

### Primary Objects

| Object | Role |
|---|---|
| `Connection__c` | One record per mentor–student pair. The root object for the portal. |
| `Case__c` | The program case. Holds dates, event info, guiding questions, and announcement data. |
| `Message__c` | One record per week per role. Stores the message body, filter status, and file link. |
| `BestPrep_Program_Participation__c` (BPPP) | Links a `Contact` to a `Case`. Used to resolve the mentor's Contact record. |
| `Contact` | The mentor's contact record. Stores VAF data, pronouns, ethnicity, job title, etc. |
| `eMentors_GQ__c` | Guiding question records linked to the Case via lookup fields `GQ_1__c`–`GQ_7__c` and `Activity_GQ__c`. |

### Key Connection__c Fields

| Field | Type | Notes |
|---|---|---|
| `Connection_Passkey__c` | Text | Auto-generated auth token |
| `Connection_Type__c` | Picklist | `eMentors` or `Cloud Coach` |
| `Deactivate__c` | Checkbox | Blocks portal access when true |
| `CaseActive__c` | Formula (Text) | `TEXT(Case__r.Status)` — used in sibling connection queries |
| `Mentor_VAF_Date__c` | Formula (Date) | Reflects `Contact.Volunteer_Agreement_Date__c` |
| `Student_Familiar_Name__c` | Formula (Text) | Read-only; used for display |
| `Mentor_Familiar_Name__c` | Formula (Text) | Read-only; display name |
| `Mentor_Out_of_Office__c` | Text | Semicolon-delimited list of weeks (e.g. `Week 2;Week 5`) |
| `Track__c` | Picklist | Cloud Coach gateway prompt track |

### Key Case__c Fields

| Field | Type | Notes |
|---|---|---|
| `Assigned_Start_Date__c` | Date | Portal open date (currently not enforced — no start restriction) |
| `Assigned_End_Date__c` | Date | Portal closes 10 days after this date |
| `CC_Date_1__c`–`CC_Date_8__c` | Date | Due dates for each week's message |
| `Celebration_Date__c` | Date | Meet & Greet / Cloud Summit date |
| `Display_Announcement__c` | Checkbox | Shows the announcement modal when true |
| `Announcement_Audience__c` | Picklist | `Mentors`, `Students`, or `Both` |

### Message__c Fields

| Field | Type | Notes |
|---|---|---|
| `Week__c` | Picklist | `VAF`, `Week 1`–`Week 8`, `Survey` |
| `Role__c` | Picklist | `Mentor` or `Student` |
| `Filter_Status__c` | Picklist | `Flag - New` → `Pass` or `Flag - In Progress` |
| `Link_to_File_Attached__c` | Text | Set to `'Attachment Processing'` by queueable, then replaced with the file URL |

### Contact Fields Written by VAF

| Field | Notes |
|---|---|
| `Familiar_Name__c` | Preferred name (max 30 chars) |
| `Title` | Job title (max 128 chars) |
| `Pronouns` | Standard Salesforce picklist field (not `Pronouns__c`) |
| `Ethnicity__c` | Custom picklist |
| `Volunteer_Agreement_Date__c` | Set to `Date.today()` when liability checkbox is checked |
| `Liability__c` | Checkbox — set to `true` when liability checkbox is checked |
| `Background_Check_Permission__c` | Checkbox |
| `Photo_permission__c` | Checkbox (optional) |
| `Receive_Newsletter__c` | Checkbox (optional) |

---

## Apex Controller

**Class:** `MentoringMentorPortal`  
**Sharing:** `global without sharing`  
> Note: `without sharing` is intentional given the guest user context and stateless passkey auth model. The primary access control is the server-side passkey check on every method. Revisiting `with sharing` is deferred to a future off-season.

### Validation Constants

Declared at the top of the class and used across all write methods:

| Constant | Value | Purpose |
|---|---|---|
| `VALID_WEEKS` | `VAF`, `Week 1`–`Week 8`, `Survey` | Allowlist for `week` parameters |
| `VALID_TRACKS` | `Track 1`, `Track 2`, `Track 3`, `Support Track` | Allowlist for `track` parameters |
| `MAX_MESSAGE_LENGTH` | `15000` | Max characters in a message body |
| `PDF_BASE64_MAGIC` | `'JVBER'` | PDF magic bytes in base64 — used to verify file type server-side |

---

### `getConnectionData(Id connectionId, String passkey)`

**Returns:** `Map<String, Object>`

The main data-loading method. Called once on page load. Performs three security checks before returning data:
1. Passkey match
2. `Deactivate__c` check
3. Portal close date check (`Assigned_End_Date__c + 10 days`)

**Return map keys:**

| Key | Type | Contents |
|---|---|---|
| `connection` | `Connection__c` | The full connection record with all queried fields |
| `messages` | `List<Message__c>` | All messages for this connection |
| `talkingPoints` | `Map<String, Object>` | Keyed by `'Week 1'`–`'Week 8'`, each containing `dueDate`, `title`, `talkingPoints`, `enableAttachments`, `track1`–`track3`, `supportTrack` |
| `companyCoordinators` | `List<String>` | Email addresses of company coordinators for this case |
| `contactData` | `Map<String, Object>` | VAF-related Contact fields: `title`, `preferredName`, `pronouns`, `ethnicity`, `liability`, `backgroundCheck`, `photoPermission`, `receiveNewsletter` |

---

### `checkMentorMessageExists(Id connectionId, String week, String passkey)`

**Returns:** `Boolean`

Pre-submit duplicate check. Called immediately before `upsertMentorMessageWithFile` to detect the case where a mentor has the portal open in two tabs and already submitted from the other tab. Returns `true` if a `Mentor` message already exists for that week.

---

### `upsertMentorMessageWithFile(Id connectionId, String week, String messageBody, String passkey, String fileName, String base64FileContent)`

**Returns:** `void`

The primary message submission method. Validates week, message body (non-empty, max 15,000 chars), and file (PDF magic bytes, max ~4MB base64). Upserts the `Message__c` record, then if a file is provided: inserts a `ContentVersion`, links it to the message via `ContentDocumentLink`, and enqueues `FileAttachQueueable` to update `Link_to_File_Attached__c`.

---

### `updateOutOfOfficeWeeks(Id connectionId, String passkey, String weeks, String track)`

**Returns:** `void`

Updates `Mentor_Out_of_Office__c` (semicolon-delimited string) and `Track__c` on the connection. Both parameters are validated against allowlists before the update.

---

### `submitVolunteerAgreement(Id connectionId, String passkey, String pronouns, String ethnicity, String jobTitle, String preferredName, Boolean liabilityAgreed, Boolean backgroundCheckAgreed, Boolean photoPermission, Boolean receiveNewsletter)`

**Returns:** `void`

Writes VAF data to the mentor's `Contact` record. Sets `Volunteer_Agreement_Date__c = Date.today()` and `Liability__c = true` only when `liabilityAgreed = true`. `preferredName` is only written if non-blank, and is truncated to 30 characters server-side.

---

### `getMentorConnections(Id connectionId, String passkey)`

**Returns:** `List<Map<String, String>>`

Finds all other active connections belonging to the same mentor (identified via `Mentor_BPPP__r.Contact__c`). Filters to `Deactivate__c = false` and `CaseActive__c = 'Assigned'`, excludes the current connection. Returns a list of maps with keys `id`, `name`, `studentName`, and `passkey` — the passkey is included so the JS can navigate directly to another connection.

---

## LWC Component

### Files

| File | Purpose |
|---|---|
| `mentorPortal.js` | Component controller — state, data loading, event handlers, getters |
| `mentorPortal.html` | Template — all UI markup |
| `mentorPortal.css` | Styles — layout, modals, tabs, status bubbles, etc. |
| `mentorPortal.js-meta.xml` | Component metadata |

### Key Tracked Properties

| Property | Default | Purpose |
|---|---|---|
| `connectionId` | — | Salesforce ID of the current connection |
| `pw` | — | Passkey (kept in memory; stripped from URL after auth) |
| `connectionData` | `{}` | Full connection record returned by Apex |
| `allMessages` | `[]` | All message records for the connection |
| `talkingPoints` | `{}` | Guiding question data keyed by week |
| `selectedWeek` | `'VAF'` | Currently active sidebar tab |
| `vafDateValid` | `null` | `true` if VAF completed in current fiscal year |
| `vafForm` | — | Object holding all VAF form field values |
| `accessDenied` | `true` | Flipped to `false` on successful auth |
| `accessDeniedReason` | `''` | `'expired'` or `''` (generic) |
| `activeTrainingTab` | `'tab1'` | Active tab within the VAF training section |
| `trainTabViewed` | `{tab1:false,...}` | Tracks whether each training tab has been viewed for 30+ seconds |
| `selectedBelief` | — | *(Removed)* Previously used for two-column belief layout |

### Page Load Sequence

1. `@wire(CurrentPageReference)` fires → credentials read from URL params or `sessionStorage`
2. `getConnectionData()` called → data populated into tracked properties
3. Credentials saved to `sessionStorage`, stripped from URL
4. `vafForm` pre-populated from `contactData`
5. `weekOptions` sidebar list built based on VAF status and available guiding questions
6. Default week resolved (VAF if not completed, Week 1 if completed, or `targetWeek` param)
7. `renderedCallback` runs → Markdown rendered, sidebar highlighted, belief SVG injected on tab 1

### Fiscal Year Logic

The VAF "completed" check uses a fiscal year window: September 1 of the current or previous calendar year through August 31 of the following year. A VAF date outside this window is treated as if no VAF exists for the current year.

### Draft Auto-Save

Message drafts are saved to `localStorage` as the mentor types, keyed as `mentorDraft_{connectionId}_{week}`. Drafts are cleared on successful submission. This is separate from `sessionStorage` (which holds credentials) and persists across tab closes on the same device.

---

## Portal Tabs & Navigation

### Sidebar Weeks

The sidebar is built dynamically from `weekOptions`:

- **Waiver** (internal value: `VAF`) — always shown first
- **Week 1–8** — shown only if VAF is complete and a guiding question exists for that week
- **Survey** — shown only if VAF is complete

Weeks with overdue messages show a `⚠` warning icon with an em dash separator (e.g. `Week 3 — ⚠`).

### Short Codes

Used in the `targetWeek` URL parameter:

| Short Code | Week |
|---|---|
| `VAF` | Waiver tab |
| `W1`–`W8` | Week 1–Week 8 |
| `SV` | Survey tab |

### Post-Submit Redirect

After a message is submitted successfully, the portal reloads to the same week. If the submitted week was the **last available week**, the portal redirects to the Survey tab instead.

---

## Volunteer Agreement Form (VAF)

The VAF is shown when `selectedWeek === 'VAF'`. It is read-only (`vaf-readonly` CSS class applied) if a valid VAF date exists for the current fiscal year. The form still allows interaction with the training tab section even when locked.

### Fields

| Label | Field | Required | Notes |
|---|---|---|---|
| Preferred Name | `Contact.Familiar_Name__c` | No | Max 30 chars |
| Job Title | `Contact.Title` | Yes | Max 128 chars |
| Pronouns | `Contact.Pronouns` | Yes | Standard SF picklist |
| Ethnicity | `Contact.Ethnicity__c` | Yes | Custom picklist |
| Volunteer Agreement | `Contact.Liability__c` + `Volunteer_Agreement_Date__c` | Yes | Combined checkbox |
| Background Check | `Contact.Background_Check_Permission__c` | Yes | — |
| Photo Permission | `Contact.Photo_permission__c` | No | Optional |
| Newsletter | `Contact.Receive_Newsletter__c` | No | Optional |

### Pronouns Picklist Values

| Label | API Value |
|---|---|
| He/Him | `He/Him` |
| She/Her | `She/Her` |
| They/Them | `They/Them` |
| He/They | `He/They` |
| She/They | `She/They` |
| Other / Prefer Not to Share | `Not Listed` |

### Training Tabs

The VAF includes a three-tab training section before the agreement checkboxes:

| Tab | Content | Turns Green After |
|---|---|---|
| Belief Statements | Animated SVG hexagon graphic of BestPrep's six belief statements | 30 seconds |
| Volunteer Training | Embedded YouTube training video (eMentors or Cloud Coach, based on connection type) | 30 seconds |
| Cultural Humility | Embedded YouTube cultural humility video | 30 seconds |

The 30-second timer is purely visual. Tabs are always clickable, including when the form is locked.

The belief graphic is a `lwc:dom="manual"` SVG rendered via `_buildBeliefSvg()` — six flat-top hexagons in BestPrep brand colors arranged around a center "BestPrep Believes" label. The SVG uses hover animations (scale + drop-shadow) driven by CSS in an injected `<style>` block.

---

## Weekly Messages

### Write Logic

**eMentors:**
- Mentor can write if the student has written (and their message passed the filter), OR if 9 days have passed since the due date with no student message.

**Cloud Coach:**
- Mentor can write starting 7 days before the due date.

In both cases, if the mentor has already written a message for that week, the form is hidden and the existing message is displayed.

### Guiding Question Header

Each week shows a single-line header in the format `Week X — Title (Track)` with a colored status bubble on the right:

| Color | Meaning |
|---|---|
| Blue | eMentors — student hasn't written yet |
| Yellow | eMentors student wrote but mentor hasn't replied; or Cloud Coach message not yet written |
| Green | Mentor has replied / written |
| Red | Overdue |

### File Attachments

If `Enable_Attachments__c` is true on the guiding question record, a PDF upload input appears. Validation:
- Client-side: file type must be `application/pdf`, max 4MB
- Server-side: base64 must start with `JVBER` (PDF magic bytes), encoded size must be under 5.5MB

### Message Filtering

All submitted messages are created with `Filter_Status__c = 'Flag - New'`. The `MessageFilterScheduledJob` (runs on a schedule) scans these records and either sets them to `Pass` (clean) or `Flag - In Progress` (contains banned terms, URLs, or attached files). Only `Pass` messages are shown to the other party.

---

## Modals

### Info Modal

Opened via the `ℹ` button in the top-right corner. Displays:
- Event date and time (Meet & Greet or Cloud Summit)
- "Add to Calendar" dropdown with Google Calendar, Microsoft Outlook, and .ics download
- Links to Mentor Resources and Training Video
- "Contact BestPrep" mailto link (to: `mentoring@bestprep.org`, cc: `helpdesk@bestprep.org`, subject includes the connection ID)

The .ics download uses a hidden `<a data-id="icsDownload">` element in the template (driven by `handleDownloadIcs()`) rather than `URL.createObjectURL`, which is blocked by Lightning Web Security.

### Settings Modal

Opened via the `⚙` button. Allows the mentor to:
- View their name, company, and email (with Gravatar / logo.dev profile image)
- Set out-of-office weeks (shown as checkboxes)
- Select a Cloud Coach gateway prompt track (Cloud Coach connections only)
- Report an error (opens a pre-filled mailto to the BestPrep coordinator)

### Connections Modal

Opened via the `change_owner` icon button. Queries all other active connections (`Deactivate__c = false`, `CaseActive__c = 'Assigned'`) for the same mentor contact. Clicking a connection navigates to it by reloading with the new connection's credentials.

### Announcement Modal

Automatically shown on page load if `Case__r.Display_Announcement__c = true`, the audience is `Mentors` or `Both`, and the announcement hasn't expired (`Announcement_End__c`). Rendered via `<lightning-formatted-rich-text>`.

---

## Security Measures

| Measure | Implementation |
|---|---|
| Passkey auth | Every Apex method verifies `Connection_Passkey__c` before doing anything |
| URL credential stripping | `history.replaceState` removes `connectionId` and `passkey` from the address bar after auth |
| Session credential storage | `sessionStorage` (tab-scoped) stores credentials for reload support |
| Message length limit | 15,000 characters enforced server-side |
| Week/track allowlists | `VALID_WEEKS` and `VALID_TRACKS` sets validated on all write methods |
| File type validation | Client: MIME type check. Server: base64 magic bytes (`JVBER`) |
| File size limit | Client: 4MB. Server: 5.5MB encoded |
| Input sanitization | Client-side allowlist sanitizer strips all non-whitelisted HTML tags and dangerous attributes/hrefs before submission |
| Portal close window | Server enforces close 10 days after `Assigned_End_Date__c` |
| Duplicate-tab guard | `checkMentorMessageExists()` called before `upsertMentorMessageWithFile()` |

---

## Static Resources

| Resource Name | Usage |
|---|---|
| `BestPrepLogo` | Logo displayed in the header and mobile sidebar |
| `BestPrepLoadingDots` | Animated loading spinner SVG |
| `MessageSentAnimation` | Lottie JSON animation played after successful message submission |
| `LottieJS` | Lottie animation runtime |
| `Marked` | Markdown parser — used to render guiding question talking points |
| `md5js` | MD5 hash library — used to generate Gravatar URLs |

---

## Test Class

**Class:** `MentoringMentorPortalTest`  
**Total test methods:** 18

### Helper

`createTestConnection()` — inserts a `Contact`, `Case`, `BestPrep_Program_Participation__c`, and `Connection__c` and returns the connection with its auto-generated passkey.

### Test Methods

| Method | What it covers |
|---|---|
| `testGetConnectionData` | Happy path; asserts all five return map keys including `contactData` |
| `testUpsertMentorMessage` | Basic message insert |
| `testUpsertMentorMessageWithFile` | File upload path; asserts `ContentDocumentLink` and `ContentVersion` with title `file.pdf` |
| `testFileAttachQueueable` | Asserts `Link_to_File_Attached__c` set to `'Attachment Processing'` |
| `testSubmitVolunteerAgreement_AllRequired` | All required fields written correctly including `Familiar_Name__c` |
| `testSubmitVolunteerAgreement_OptionalFieldsChecked` | Photo permission and newsletter saved when opted in |
| `testSubmitVolunteerAgreement_LiabilityFalseDoesNotSetVafDate` | VAF date not set when liability checkbox unchecked |
| `testSubmitVolunteerAgreement_InvalidPasskey` | `AuraHandledException` thrown on bad passkey |
| `testMessageFilterScheduledJob` | End-to-end: flagged message moves to `Flag - In Progress`, clean message moves to `Pass`; running user given an email to satisfy the Process Builder |
| `testUpdateOutOfOfficeWeeks` | Out-of-office string and track saved correctly |
| `testCheckMentorMessageExists_NoMessage` | Returns `false` when no message exists |
| `testCheckMentorMessageExists_MessageExists` | Returns `true` when message exists for that week |
| `testCheckMentorMessageExists_WrongWeek` | Returns `false` when message exists for a different week |
| `testCheckMentorMessageExists_InvalidPasskey` | `AuraHandledException` thrown |
| `testGetMentorConnections_NoSiblings` | Returns empty list when no other connections |
| `testGetMentorConnections_WithSiblings` | Returns one sibling with correct `id` and `passkey` |
| `testGetMentorConnections_ExcludesDeactivated` | Deactivated sibling not returned |
| `testGetMentorConnections_InvalidPasskey` | `AuraHandledException` thrown |

### Known Test Gotchas

- `CaseActive__c` is a formula (`TEXT(Case__r.Status)`) — tests set `Case.Status = 'Assigned'` rather than writing `CaseActive__c` directly.
- `Student_Familiar_Name__c` and other formula fields on `Connection__c` are not writable in tests.
- `testMessageFilterScheduledJob` must set an email on the running test user via `System.runAs(me)` before creating data, because the `Mentoring - Notify Case Owner of Flagged Message` Process Builder sends a template email to the Case owner.
- PDF file blobs in tests must start with `'%PDF-'` (e.g. `Blob.valueOf('%PDF-1.0 test content')`) so the base64 starts with `'JVBER'` and passes server-side validation.

---

## Known Limitations & Deferred Work

| Item | Notes |
|---|---|
| `global without sharing` | Intentional given guest user context. Low risk given consistent passkey auth and scoped SOQL. Revisit after season ends if desired. |
| `logo.dev` API token in JS | Token `pk_ND5fuI1FS7G0KwfKwLuDnw` is client-visible. Low monetary exposure. Could be moved to Custom Metadata. |
| `marked.parse()` → `innerHTML` | GQ markdown is parsed and written directly to the DOM. Mitigated by trust in admin-only content editors, but no DOMPurify sanitizer is applied. |
| Training video hosting | YouTube videos may be blocked at some corporate sites. Vimeo is the recommended alternative for the next hosting review — bandwidth at ~2,000 mentors/year makes WordPress self-hosting impractical. |
| Rate limiting | No Salesforce-native rate limiting on `@AuraEnabled` endpoints. Passkey requirement makes brute force impractical. |
| Draft storage on shared devices | `localStorage` drafts persist across browser sessions on shared computers. Low risk in practice. |

---

## Deployment Notes

- All files live in the `mentorPortal` LWC bundle: `mentorPortal.html`, `mentorPortal.js`, `mentorPortal.css`, `mentorPortal.js-meta.xml`
- The Apex class (`MentoringMentorPortal`) and test class (`MentoringMentorPortalTest`) deploy together
- The component is added to an Experience Site page — guest user profile must have read access to `Connection__c`, `Case__c`, `Message__c`, `BestPrep_Program_Participation__c`, and `eMentors_GQ__c`, and write access to `Message__c` and `Contact`
- The `mentorPortalDev` LWC (not documented here) is the development copy — always test changes there before deploying to `mentorPortal`
- Mid-season deployments should be made with caution — avoid structural changes to auth, VAF, or message submission during active program seasons (~September through May)