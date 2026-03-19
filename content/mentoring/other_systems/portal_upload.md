# CSV Upload — Developer & Admin Documentation

## Overview

The CSV uploader is a Lightning Web Component (`csvUploader`) that allows staff to bulk-create or update mentor/student pairings from a spreadsheet. It supports two program types: **eMentors** and **Cloud Coach**.

When a file is submitted the component:
1. Parses and validates the CSV client-side (structure, column count, pronoun normalization)
2. Sends batches of 15 rows at a time to the `PortalUpload` Apex class via `@AuraEnabled`
3. The Apex class upserts Contacts, inserts BestPrep Program Participation records (BPPPs), and creates Connection records

---

## CSV Format

### General Rules

- File must be `.csv` format
- First row must be a header row (see column names below)
- Each subsequent row represents one mentor/student pairing
- **Fields containing a comma must be wrapped in double-quotes** (e.g. `"Senior Manager, Operations"`)
  - Excel and Google Sheets handle this automatically on export — no manual quoting needed unless editing the raw file by hand
- Completely blank rows are skipped automatically

---

## Columns

### eMentors

| # | Column Header | Required | Notes |
|---|---|---|---|
| 1 | `Class Period` | Yes | Free text, e.g. `1`, `2A` |
| 2 | `Student First Name` | Yes | |
| 3 | `Student Last Name` | Yes | |
| 4 | `Student Email` | Yes | Used as the unique identifier for upsert |
| 5 | `Student Pronouns` | Yes | See [Pronoun Handling](#pronoun-handling) |
| 6 | `Mentor First Name` | Yes | |
| 7 | `Mentor Last Name` | Yes | |
| 8 | `Mentor Title` | Yes | Quote if it contains a comma |
| 9 | `Mentor Email` | Yes | Used as the unique identifier for upsert |
| 10 | `Mentor Pronouns` | Yes | See [Pronoun Handling](#pronoun-handling) |
| 11 | `Mentor Organization` | Yes | |

### Cloud Coach

Same as eMentors, plus one additional column:

| # | Column Header | Required | Notes |
|---|---|---|---|
| 12 | `Child Case ID` | Yes | Salesforce ID of the child Case to link records to |

---

## Example Rows

**eMentors:**
```
Class Period,Student First Name,Student Last Name,Student Email,Student Pronouns,Mentor First Name,Mentor Last Name,Mentor Title,Mentor Email,Mentor Pronouns,Mentor Organization
1,Jane,Doe,jane.doe@school.edu,She/Her,John,Smith,Engineer,john.smith@company.com,He/Him,Acme Corp
2A,Alex,Lee,alex.lee@school.edu,They/Them,Sarah,Adams,"Senior Manager, Operations",sarah.adams@company.com,She/Her,BestCo
```

**Cloud Coach:**
```
Class Period,Student First Name,Student Last Name,Student Email,Student Pronouns,Mentor First Name,Mentor Last Name,Mentor Title,Mentor Email,Mentor Pronouns,Mentor Organization,Child Case ID
1,Jordan,Kim,jordan.kim@school.edu,They/Them,Chris,Nguyen,Analyst,chris.nguyen@firm.com,He/Him,Firm LLC,5001200000AbCdEAAZ
```

---

## Pronoun Handling

Pronouns are normalized automatically — users do not need to enter exact values. The component maps raw input to a standard picklist value before any data is saved.

### Mapping Rules (applied in priority order)

| If the input contains… | Normalized to |
|---|---|
| `they`, `them`, `theirs`, `nb`, `non-binary` | `They/Them` |
| `she`, `her`, `female`, `woman`, `girl`, `f` *(whole word)*, `w` *(whole word)* | `She/Her` |
| `he`, `male`, `man`, `m` *(whole word)* | `He/Him` |
| Anything else, or blank | `Not Listed` |

Single-letter shorthands (`F`, `M`, `W`) are matched as **whole words only**, so values like `"Prefer not to disclose"` correctly fall through to `Not Listed` rather than accidentally matching on the `f` in "prefer."

Both the text field (`Pronouns__c`) and the standard picklist field (`Pronouns`) are populated with the normalized value.

---

## Validation

All validation happens client-side before any data is sent to Salesforce. The upload will not proceed if any of the following are found:

| Check | Error shown to user |
|---|---|
| Fewer than 2 rows (no data rows) | `CSV must have at least one data row.` |
| A required column header is missing | `[column name] is missing from your file` |
| More columns than expected | `Extra column in file. Please follow the template.` |
| A data row has fewer fields than the header | `Row [N]: You are missing some data in cell(s): [column names]` |

Rows with no data in any cell are silently skipped.

---

## Salesforce Records Created

### Contacts

- Contacts are **upserted** — if a Contact with a matching email already exists it is updated, otherwise a new one is created.
- Email matching checks `Email`, `npe01__HomeEmail__c`, and `npe01__WorkEmail__c`.

| Field | Student | Mentor |
|---|---|---|
| `RecordTypeId` | `012A0000000z8IJIAY` | `012A0000000z2dGIAQ` |
| `npe01__Preferred_Email__c` | `Personal` | `Work` |
| `npe01__HomeEmail__c` | Set to student email | — |
| `npe01__WorkEmail__c` | — | Set to mentor email |
| `Contact_Type__c` | — | `Volunteer` |
| `Title` | — | From CSV |
| `npsp__Primary_Affiliation__c` | — | From `Mentor Organization` column |
| `Pronouns__c` | Normalized value | Normalized value |
| `Pronouns` | Normalized value | Normalized value |

### BestPrep Program Participation (BPPP)

Two BPPP records are created per row — one for the student (`Role__c = Student`) and one for the mentor (`Role__c = Mentor`).

| Program | Record Type ID |
|---|---|
| eMentors | `012A0000000zBxrIAE` |
| Cloud Coach | `01212000000zt33AAA` |

For Cloud Coach rows, the BPPP `Case_Number__c` is set to the **Child Case ID** from the CSV. For eMentors, it is set to the Case passed into the component via the `caseId` property.

### Connections

One `Connection__c` record is created per row, linking the student BPPP and mentor BPPP together.

| Field | Value |
|---|---|
| `Connection_Type__c` | `eMentors` or `Cloud Coach` |
| `Student_BPPP__c` | Student BPPP Id |
| `Mentor_BPPP__c` | Mentor BPPP Id |
| `Case__c` | Parent case (eMentors) or child case (Cloud Coach) |

---

## Component Properties (`@api`)

| Property | Type | Description |
|---|---|---|
| `caseId` | `Id` | The Salesforce Case Id to associate records with |
| `programType` | `String` | `eMentors` or `Cloud Coach` |
| `uploadResultMessage` | `String` | Output property — set to `Upload successful.` on success; readable by the parent Flow |

---

## Batch Processing

To stay within Salesforce governor limits, rows are sent to Apex in **batches of 15**. Each batch includes the header row so column mapping is preserved. Batches are processed sequentially — if any batch fails, the upload stops and the error is shown to the user. Records inserted by earlier batches in the same upload are not rolled back.

---

## Files

| File | Purpose |
|---|---|
| `csvUploader.html` | Component template |
| `csvUploader.js` | Client-side parsing, validation, and pronoun normalization |
| `csvUploader.css` | Component styles |
| `csvUploader.js-meta.xml` | Component metadata |
| `PortalUpload.cls` | Apex controller — CSV parsing, upsert logic, record creation |
| `PortalUploadTest.cls` | Test class — unit tests for `parseCsvLine`, `normalizePronoun`, and integration tests for both program types |