# Welcome to the BestPrep Mentoring Portals Documentation

This site documents the custom-built **Mentor and Student portals** that support BestPrep’s **eMentors** and **Cloud Coach** programs. Both portals are powered by a shared Salesforce backend and Lightning Web Components (LWC), with custom Apex, JavaScript, and Flow logic.

Use this site to understand the technical design, program logic, and how these tools work together to deliver a seamless mentoring experience.

### Development Edition:

Please note that each page contains two versions - a production version, and a development version. The development versions simply have "Dev" appended to the end of the file name *(studentPortalDev.js)* and are used to develop and test new features without inturrupting the user experience within the production version. The development versions are not hosted within the documentation site. 

If you make changes, please always ensure you are testing thoroughly within the development files before deploying to production. The development URLs may be found below: 

- [Mentor Portal (Development)](https://mentoring.bestprep.org/s/mentordev?connectionId={Connection.Id}&passkey={Connection.Passkey__c})
- [Student Portal (Development)](https://mentoring.bestprep.org/s/studentdev?connectionId={Connection.Id}&passkey={Connection.Passkey__c})
- [Overview Portal (Development)](https://mentoring.bestprep.org/s/overviewdev?caseId={Case.Id}&PW={Case.Case_Password__c})

---

## System Overview

The entire system starts differently depending on whether it is an eMentors or a Cloud Coach connection. While Cloud Coach cases are setup by the Cloud Coach Program Manager based on interested schools and available companies, eMentors start with the teacher requesting an eMentors Experience. This is done using a public screen flow hosted on the [mentoring experience site](https://mentoring.bestprep.org/s/sign-up). The respective requests are then added to either the teacher or company "bucket case" which stores them for the program manager to sort through, pair, and assign. You can view those here: 

- [Teacher Sign-Up Flow]()
- [Teacher Sign-Up Site](https://mentoring.bestprep.org/s/teacher-sign-up)
- [Teacher Bucket](https://bestprep.lightning.force.com/lightning/r/Case/500RP00000JVPf7YAH/view)
- [Company Sign-Up Flow]()
- [Company Sign-Up Site](http://mentoring.bestprep.org/s/company-sign-up)
- [Company Bucket](https://bestprep.lightning.force.com/lightning/r/Case/500RP00000JVKijYAH/view)

---

## Portal Overview

The mentoring system consists of 3 major public-facing portals:

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

## Need Help?

For questions about this portal or to suggest edits, contact **Tovin Sannes-Venhuizen** or email `tsannes-venhuizen@bestprep.org`.

