# Welcome to the BestPrep Mentoring Portals Documentation

This site documents the custom-built **Mentor and Student portals** that support BestPrep’s **eMentors** and **Cloud Coach** programs. Both portals are powered by a shared Salesforce backend and Lightning Web Components (LWC), with custom Apex, JavaScript, and Flow logic.

Use this site to understand the technical design, program logic, and how these tools work together to deliver a seamless mentoring experience.

### Development Edition:

Please note that each portal contains two versions - a production version, and a development version. The development versions simply have "Dev" appended to the end of the file name *(studentPortalDev.js)* and are used to develop and test new features without inturrupting the user experience within the production version. The development versions are not hosted within the documentation site. 

If you make changes, please always ensure you are testing thoroughly within the development files before deploying to production. The development URLs may be found below: 

- [Mentor Portal (Development)](https://mentoring.bestprep.org/s/mentordev?connectionId={Connection.Id}&passkey={Connection.Passkey__c})
- [Student Portal (Development)](https://mentoring.bestprep.org/s/studentdev?connectionId={Connection.Id}&passkey={Connection.Passkey__c})
- [Overview Portal (Development)](https://mentoring.bestprep.org/s/overviewdev?caseId={Case.Id}&PW={Case.Case_Password__c})

---

## System Overview

### Specific to eMentors 

The entire system starts differently depending on whether it is an eMentors or a Cloud Coach connection. While Cloud Coach cases are setup by the Cloud Coach Program Manager based on interested schools and available companies, eMentors start with the teacher requesting an eMentors Experience. This is done using a public screen flow hosted on the [mentoring experience site](https://mentoring.bestprep.org/s/sign-up). The respective requests are then added to either the teacher or company "bucket case" which stores them for the program manager to sort through, pair, and assign as a BestPrep Program Participation record. You can view those here - anytime a teacher or company coordinator requests an eMentors experience, the program manager is notified: 

- [Teacher Sign-Up Flow]()
- [Teacher Sign-Up Site](https://mentoring.bestprep.org/s/teacher-sign-up)
- [Teacher Bucket](https://bestprep.lightning.force.com/lightning/r/Case/500RP00000JVPf7YAH/view)
- [Company Sign-Up Flow]()
- [Company Sign-Up Site](http://mentoring.bestprep.org/s/company-sign-up)
- [Company Bucket](https://bestprep.lightning.force.com/lightning/r/Case/500RP00000JVKijYAH/view)

Once the teacher or company coordinator has recieved their connection conformation, they are also given the opportunity to edit it, through the request edit page. The program manager for eMentors is notified by email anytime a teacher or coordinator makes an update to their request. Once the teacher or company coordinator BPPP has been moved to its respective case, it is no longer available to be edited. 

The eMentors program manager will use a flow ([Move to Case Flow](https://link-goes-here.bestprep.org)) to create a new case and move both the teacher and company coordinator into it. Along with this process, the program manager will assign a staff to handle the connection, and upon saving, the company coordinator, teacher, and BestPrep staff will all be sent a notification email. 

### Portal Upload

Before this point, the case must be complete - that is, filled out with guiding questions, messaging dates, and Meet & Greet information (if known). Note that for Cloud Coach cases, this information only needs to be entered on the Parent Case, and [this flow](https://link-to-flow) will copy it to child cases. 

Beyond this point, both eMentors and Cloud Coach connections are handled the same, with some slight differences in flow control. The first step is uploading a spreadsheet as a .CSV file into the system which contains the following information - this can be downloaded in an easy template for [eMentors and Cloud Coach](https://link-to-download.com). There is also another version available to send to teachers via [email attachement](https://link-to-email-attachment.com) or as a [Google Drive Link](https://google-drive-link.com): 

- Case ID
- Mentor First Name
- Mentor Last Name
- Mentor Job Title
- Mentor Email Address
- Student First Name
- Student Last Name
- Student Preferred Name (Optional)
- Student Pronouns (optional)
- Student Email Address
- Connection Type (eMentors or Cloud Coach)

To read more about the portal upload system, go [to this page](https://internal-link.com). 


---

## Portal Overview

The mentoring system consists of 6 major public-facing portals:

| Portal           | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Teacher Sign-Up** | Used by the teacher to initially request their class participates in eMentors |
| **Company Sign-Up** | Used by the company coordinator to initially request that their company participates in eMentors (or is forwarded onto Cloud Coach if large enough) |
| **Request Edit Page** | Used by teachers to edit their eMentors request as it gets closer to the starting date |
| **Mentor Portal**   | Used by mentors to send weekly messages, view student responses, and manage availability |
| **Student Portal**  | Used by students to read guiding questions, mentor responses, and submit messages |
| **Overview Portal** | Used by teachers to view weekly connection progress across all students, and by company coordinators to pull statistics from their connection |

Each portal dynamically loads based on a secure URL with a passkey and connection ID. All data is sourced from custom Salesforce objects and records. The format for the URL follows this formula: 

- Overview Portal: https://mentoring.bestprep.org/s/connection-overview?caseId={Case.Id}&PW={Case.Case_Password__c}&Role=Teacher

- Mentor Portal: https://mentoring.bestprep.org/s/mentor-portal?connectionId={Connection.Id}&passkey={Connection.Passkey__c}

- Student Portal: https://mentoring.bestprep.org/s/student-portal?connectionId={Connection.Id}&passkey={Connection.Passkey__c}

---

## Explore the Code and Design

### Mentor Portal

- [Mentor Portal Overview](mentor_portal/mentor_portal.md)
- [Mentor Portal Apex](mentor_portal/mentor_apex.md)
- [Mentor Portal JS & LWC](mentor_portal/mentor_js.md)

### Student Portal

- [Student Portal Overview](mentor_portal/mentor_portal.md)
- [Student Portal Apex](mentor_portal/mentor_apex.md)
- [Student Portal JS & LWC](mentor_portal/mentor_js.md)

### Overview Portal (Teachers and Company Coordinators)

- [Overview Portal](mentor_portal/mentor_portal.md)
- [Overview Portal Apex](mentor_portal/mentor_apex.md)
- [Overview Portal JS & LWC](mentor_portal/mentor_js.md)


---

### Ideas for future development 

The idea has been floated to allow students to choose a mentor themselves, rather than randomly assigning them. This would work by having mentors and students uploaded but not paired into a connection. Then students could view a list of mentors available to them with first name and last initial, what company they work for, their pronouns, and their job title. 

The idea for an "announcement system" is also planned, allowing BestPrep staff to push messages to either the mentor, student, or both portals for a specified amount of time (or until a specified date). This would be controled from the case on the Salesforce side with a few fields, such as Message (text), Audience (picklist), Expiration (date), and Active (check-box) and display as a modal style announcement upon portal load. 