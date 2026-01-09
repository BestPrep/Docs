# Email Templates

Email templates have been designed using BeeFree.io and are generated as inline HTML code, sent via the Lightning Email Template system.


## eMentors

| **Name** | **Trigger** | **Description**  | **Template Link**  |
| - | - | - | - |
| **Setup Emails** | | | |
| Mentoring - Class Request | Record Triggered from Flow | When a teacher submits a request for an eMentors experience, this template is sent to confirm their information | In-Progress |
| Mentoring - Class Request Edit | Record Triggered from Flow | When a teacher edits their previous request for an eMentors experience, this template is sent to confirm their changes | In-Progress |
| Mentoring - Company Request | Record Triggered from Flow | When a company coordinator submits a request for an eMentors epxerience, this template is sent to confirm their information | In-Progress | 
| Mentoring - Company Request Edit | Record Triggered from Flow | When a company coordinator edits their previous request for an eMentors experience, this template is sent to confirm their changes | In-Progress |
| Mentoring - Coordinator Handoff Notification (In-Person) | Record Triggered from Flow | When a coordinator is moved from the bucket to a case and the case is set to assigned, this email is sent from their BPPP | [Link to Template](https://bestprep.lightning.force.com/lightning/r/sObject/00XRP00000CTG0r2AH/view?queryScope=userFolders) |
| Mentoring - Coordinator Handoff Notification (Virtual) | Record Triggered from Flow | When a coordinator is moved from the bucket to a case and the case is set to assigned, this email is sent from their BPPP | [Link to Template](https://bestprep.lightning.force.com/lightning/r/sObject/00XRP00000CTFpZ2AX/view?queryScope=userFolders) |
| Mentoring - Teacher Handoff Notification (In-Person) | Record Triggered from Flow | When a teacher is moved from the bucket to a case and the case is set to assigned, this email is sent from their BPPP | [Link to Template](https://bestprep.lightning.force.com/lightning/r/sObject/00XRP00000CSnwX2AT/view?queryScope=userFolders) |
| Mentoring - Teacher Handoff Notification (Virtual) | Record Triggered from Flow | When a coordinator is moved from the bucket to a case and the case is set to assigned, this email is sent from their BPPP | [Link to Template](https://bestprep.lightning.force.com/lightning/r/sObject/00XRP00000CT6UX2A1/view?queryScope=userFolders) |
| **Scheduled Mentor Emails** |  |  |  |
| Mentor Welcome Email (eMentors) | Scheduled ([on Assigned Start Date](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view)) & User Triggerable for Entire Case or Single Connection | Mentor welcome email for mentors participating in eMentors connections | [Link to Template](https://bestprep.lightning.force.com/lightning/r/EmailTemplate/00XRP00000CQVfZ2AX/view?queryScope=userFolders) |
| Mentor Activity Prompt | [Scheduled to check daily at 6:30am from Flow](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view) | Reminds mentors of any virtual activity that is schedule for this week | [Link to Template](https://bestprep.lightning.force.com/lightning/r/sObject/00XRP00000CGGt72AH/view?queryScope=userFolders) |
| Mentor Reminder to Write | [Scheduled when mentor hasn't replied to student in more than 72 hours](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view) | | |
| eMentors Mentor Gapfill | [Scheduled when student misses 2 consecutive messages](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view)| | |
| Meet & Greet Reminder | [Scheduled 2 days prior to Meet & Greet](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view) | | |
| Mentor Program Conclusion | [Scheduled for Assigned End Date](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view) | | |
| Mentor Survey Reminder | [Scheduled for Assigned End Date if survey not completed](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP000001BkIH2A0/view) | | |
| Student Message Notification | [Triggered by a new student message being set to "Pass"](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP0000005qfV2AQ/view) | Send a notification to the mentor that their student wrote a new message | |
| **Triggered Mentor Emails** | | | |
| Mentor Drop Notification (To Mentor) | Trigger via swap flow on case | Send to mentor to notify them that they have been dropped from the program | |
| Student Drop Notification (To Mentor) | Trigger via swap flow on case | Send to a mentor to notify them that their student has been dropped from the program | |
| Mentor Swap Notification (To Mentor) | Trigger via swap flow on case | Send to a mentor to notify them that they have a new student from a mentor who dropped | |
| Mentor Portal Link | Triggered from connection via button | Send mentor an email with their portal link in it | |
| **Student Emails** | | | |
| Student Weekly Prompt | | Weekly prompt to students reminding them to write to their mentor | |
| Student Reminder to Write | | Reminder for a student to write if they are 3-days overdue | |
| Mentor Drop Notification | | Let a student know if their mentor has dropped out of the program and they are given a new mentor | |
| Mentor Out-of-Office Notification | [Triggered by a new messsage being set to "Pass" while mentor is Out-of-Office](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP0000005qfV2AQ/view) | Inform a student that their mentor is out of office if the student sends them a message during that time | |
| Mentor Message Notification | [Triggered by a new mentor message being set to "Pass"](https://bestprep.lightning.force.com/lightning/r/FlowRecord/2aFRP0000005qfV2AQ/view) | Inform a student that they have gotten a message from their mentor | |
| Student Portal Link | | Used to send a student the link to their portal if they loose it | |
| Student Survey Reminder | | Reminder for a student to complete their survey if they haven't 3 days after the final message | |



## Cloud Coach