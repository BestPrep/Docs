# Understanding Salesforce

Salesforce is a Customer Relationship Management system, more commonly referred to as a CRM. The sheer size and ability of something like Salesforce can be daunting to new users, but when broken down, is much easier to understand. Let's compare it to an Excel Spreadsheet, or a Google Sheet. 

- In Excel, you have a file - for example, **BestPrep.xlsx**. In Salesforce, we call this our **organization** which is given a custom identifier, as a string of 18 characters. 
- Within our "excel file" we have many different sheets. Each sheet contains a different set of information, such as Contacts or Cases. In Salesforce, we call these **objects**. A standard object is just given its name - Contacts. However, a custom object has two underscores and a c appended to the end, such as BestPrepProgramParticipation__c. 
- Within each sheet, we have columns. Each column has a different title. Using our Contact sheet as an example, we would expect to have a column named "First Name" or "Last Name" or perhaps "Work Email." In Salesforce, we call these **fields** and they are used to categorize the information within object. 
- Finally, we have **records**. Think of records as the rows of our excel file. Within our sheet "Contacts" we have a field "First Name" and a row with the name "Pippin" and another row with the name "Phoebe." Each of these rows are a different contact, which is called a record in the Salesforce ecosystem.

---

# Tools within Salesforce

### Lightning Experience:
Inside of Salesforce, we have many different tools for interacting and managing this data. The most well known is the **lightning experience** which is what you see every day when you log onto Salesforce. This allows you to navigate between objects, view and edit records, or create new records. 

### Reports:
We also have **reports** which are a way to view large amounts of data, filtered by custom criteria. For example, within Salesforce we have thousands of mentoring messages. Messages go through a system where they are scanned by the system for flagged content (contact information, explitives, etc.) and then given a filter status based on this. If we want to run a report to check our flagged messages, we would not want to view every single message ever. Instead, we would filter by cases owned by our user (or another user if checking for someone else) and where Filter_Status__c is set to "Flagged." 

We can create reports that filter by any criteria, or even criteria from across multiple objects (such as messages where Filter_Status__c equals flagged and ALSO the associated case is eMentors and the associated contact has the First_Name of "Pippin.").

### Experience Sites: 
For public facing parts (the parts the our mentors, students, teachers, and partners see) we have a few different options. Most commonly used are **experience sites** which you can recognize by their unique URL, with a /s/ appended to the end (for example, https://mentoring.bestprep.org/s/student-portal). These are internal and customizable websites that can display, create, or edit data inside of Salesforce by those outside the organization. Some examples are hosting our mentoring platforms (the Student and Mentor portals) or allowing people to register for our events.

### Flows:
Flows are used to automate different parts of our data collection, organization, or clean-up. They can be scheduled (happening repeatedly on a date or time), triggered (ran everytime a record is edited), or even be Screen Flows, which are flows that have a graphical user interface for user input or display (such as in the case of forms and teacher sign-ups).

---

# Programming Languages

### Apex
Apex is a programming language developed by Salesforce that lets developers write custom business logic directly on the Salesforce platform.

**It is:**

- Strongly typed (like Java)
- Object-oriented
- Hosted and executed entirely in the Salesforce cloud


**Apex allows you to:**

- Create custom triggers that run before or after record changes (like INSERT, UPDATE, DELETE)
- Write classes and methods to automate processes, enforce rules, or integrate with external systems
- Call APIs, perform complex logic, or build reusable tools that work across your org

## When Is Apex Used?
You use Apex when point-and-click tools like Flows, Process Builder, or Validation Rules aren’t enough.

### Common examples:
- Automatically create child records when a parent is inserted
- Update related objects across lookups
- Schedule jobs or run batch operations on thousands of records
- Build Lightning Web Components (LWCs) that fetch or modify Salesforce data

That last use case (Building LWCs) is what we primarily use Apex for in the mentoring project.

### HTML

Content Here


### CSS

Content Here


### JavaScript

Content Here


### SQL

Content Here