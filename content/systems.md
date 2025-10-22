# Understanding Salesforce

Salesforce is a **Customer Relationship Management (CRM)** system. It stores, connects, and manages data for people, organizations, and activities.  
Although Salesforce may look complex, it can be understood easily by comparing it to a spreadsheet.

---

## Comparing Salesforce to Excel

- **Organization (Org)** → like your Excel file (`BestPrep.xlsx`). Each org has a unique 18-character ID.  
- **Objects** → like sheets within that file (e.g., Contacts, Cases). Custom objects end in `__c`, such as `BestPrepProgramParticipation__c`.  
- **Fields** → like column headers. Examples: `FirstName`, `LastName`, or `Email`.  
- **Records** → like rows in a sheet. Each record represents one instance of data. Example: one contact named *Pippin* and another named *Phoebe*.

---

# Tools within Salesforce

### Lightning Experience
The **Lightning Experience** is the visual interface you use after logging in. It allows you to:
- Navigate between objects  
- View, edit, and create records  
- Access dashboards, reports, and flows  

This is where staff spend most of their time.

### Reports
**Reports** collect and filter data to show specific information.  
For example: to find flagged mentoring messages, create a report where  
`Filter_Status__c = "Flagged"` and the message belongs to your cases.  

Reports can also use related data from multiple objects, such as:
> Messages where `Filter_Status__c = "Flagged"`  
> **and** the related Case is `eMentors`  
> **and** the Contact’s `FirstName = "Pippin"`.

### Experience Sites
**Experience Sites** (formerly “Communities”) are public-facing web portals that connect directly to Salesforce data.  
They always include `/s/` in the URL (example:  
`https://mentoring.bestprep.org/s/student-portal`).  

These allow non-staff users to:
- Submit or view mentoring messages  
- Register for events  
- Access dashboards or forms  

The Mentor and Student Portals are both Experience Sites.

### Flows
**Flows** are Salesforce’s no-code automation tools. They can:
- Run automatically when records change (Record-Triggered Flows)  
- Execute on schedules (Scheduled Flows)  
- Display forms for user interaction (Screen Flows)

Flows help automate repetitive tasks such as sending emails, updating fields, or cleaning up records.

---

# Programming Languages in Salesforce Projects

Salesforce development often combines **Apex**, **HTML**, **CSS**, **JavaScript**, and **SOQL**.  
Each language serves a distinct purpose in building portals, automations, and data logic.

---

## Apex

**Apex** is Salesforce’s backend programming language, similar to Java.  
It runs entirely on Salesforce servers.

**It is:**
- Strongly typed  
- Object-oriented  
- Executed in the cloud  

**Apex is used to:**
- Run logic before or after record changes (triggers)  
- Enforce rules and automate complex workflows  
- Integrate Salesforce with external systems  
- Support Lightning Web Components (LWCs) through backend data access  

**When to use Apex:**
When Flows or Validation Rules cannot perform complex logic or handle large data volumes.

**Examples:**
- Creating related records automatically  
- Updating records in multiple related objects  
- Running batch jobs or scheduled processes  
- Supplying data to Lightning Web Components  

In our mentoring portals, Apex is primarily used to provide data and handle file submissions for LWCs.

---

## HTML

**HTML (HyperText Markup Language)** defines the structure of a webpage.  
In Experience Sites or Lightning Web Components, HTML determines what appears on screen.

**Example uses:**
- Displaying text, buttons, and forms  
- Embedding data retrieved from Apex  
- Structuring mentor and student message areas  

HTML forms the skeleton; everything else builds around it.

---

## CSS

**CSS (Cascading Style Sheets)** controls how a webpage looks.  
It manages color, size, spacing, and layout.

**Example uses:**
- Styling buttons, cards, or tables in portals  
- Making pages mobile-friendly  
- Adding hover effects and animations  

CSS ensures the portals match BestPrep’s visual identity while staying accessible and simple.

---

## JavaScript

**JavaScript** makes Salesforce sites interactive.  
It’s used heavily in **Lightning Web Components (LWCs)**.

**Example uses:**
- Validating form input before saving  
- Fetching data from Apex classes  
- Dynamically updating the page without refreshing  
- Managing conditional display of mentor/student messages  

In short, Apex handles logic and data. JavaScript handles interactivity and responsiveness.

---

## SOQL (Salesforce Object Query Language)

**SOQL** is similar to SQL but works specifically for Salesforce data.  
It retrieves records from objects inside your org.

**Example:**
```sql
SELECT Id, FirstName, LastName, Email 
FROM Contact 
WHERE Email LIKE '%@bestprep.org'
```

### Common uses:
- Querying records in Apex code
- Filtering related data for portals
- Powering reports or admin scripts
- SOQL is the language Apex uses to communicate with your Salesforce database.

### Summary
- Salesforce is structured like a multi-sheet spreadsheet where data is stored as objects, fields, and records.
- Lightning Experience and Experience Sites provide user-friendly ways to view and edit data.
- Reports and Flows handle data visualization and automation.
- Apex, HTML, CSS, JavaScript, and SOQL together power the mentoring portals—combining backend logic, data retrieval, visual layout, styling, and interactivity.