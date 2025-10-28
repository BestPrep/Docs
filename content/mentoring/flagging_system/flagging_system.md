# Message Flagging System

The message flagging system is put in place to protect mentors, students, and BestPrep from both safety concerns and potential liability. This system checks for the following: 

- Flagged Words
- Links
- Attachments & Files

If you want to remove or add a term from the checked filter list, you can do so here: [Filter Terms (Salesforce)](https://bestprep.lightning.force.com/lightning/o/Filter_Terms__c/list?filterName=All_Filter_Terms)


## Life of a Message
When a message is submitted to our system in any way (via the portal or manually by a BestPrep staff member) it goes through the following process. 

<div class="mermaid">
flowchart TD
    A[Message created] --> B[Status: Flag - New]
    B --> C{Scheduled job runs}
    C --> D[Load banned terms and message text]
    D --> E{Banned word or link?}
    E -- Yes --> F[Set status: Flag - In Progress]
    E -- No --> G{Attachment present?}
    G -- Yes --> H[Create ContentDistribution link]
    H --> F
    G -- No --> J[Set status: Pass]
    F --> K[Save flag reason]
    J --> L[Message approved and visible]
    F --> M[Awaiting review]
    M --> N{Reviewer decision}
    N -- Valid --> J
    N -- Inappropriate --> O[Remove or escalate]
    J --> P[End]
    O --> P[End]
</div>



## Flagging Code

This Apex job automatically scans new mentoring messages to detect inappropriate content or risky files.  
Every 15 minutes, Salesforce runs this scheduled job to look for new messages marked **“Flag – New.”**  
It checks three things:  
1. Whether the message contains any banned words stored in the custom object `Filter_Terms__c`.  
2. Whether the message includes a hyperlink.  
3. Whether a file is attached that needs to be safely shared.  

If a problem is found, the job flags the message by updating its status to **“Flag – In Progress”** and lists the reason in `Flag_Reason__c`.  
If a file is attached, the code automatically creates a secure public link using Salesforce `ContentDistribution`.  
Messages without issues are marked as **“Pass.”**  
This automation allows mentors’ and students’ messages to be screened without manual review while still protecting file privacy and message integrity.


The scheduled jobs are a group of four, set to run every 15 minutes. 

- [`Mentoring Message Filter 00`](https://bestprep.my.salesforce-setup.com/ui/setup/apex/batch/ManageScheduledApexJobPage?retURL=%2F08e%3FretURL%3D%252Fsetup%252Fhome%26appLayout%3Dsetup%26tour%3D%26sfdcIFrameOrigin%3Dhttps%253A%252F%252Fbestprep.my.salesforce-setup.com%26sfdcIFrameHost%3Dweb%26nonce%3Db8458fec0e9653b8718fe6aa2be9443ab26ad4f33c2bff6c3885426dbdee5d87%26ltn_app_id%3D%26clc%3D1&job_name=Mentoring+Message+Filter+00&EXISTING_JOB_NAME=Mentoring+Message+Filter+00&pid=08aRP00000dYbbX&triggerId=08eRP00000dYNIR&scheduleusing=1&cronexp=0+0+*+*+*+%3F&_CONFIRMATIONTOKEN=VmpFPSxNakF5TlMweE1DMHpNVlF4TWpvMU5qbzBNeTR3T0RaYSxPQzd0akhwWlNiOW03bW9DN2hQTTlZNlp1d1ozYjZPYmFlRElNZGZPSExrPSxZV1ZtT0dFeg%3D%3D)
- [`Mentoring Message Filter 15`](https://bestprep.my.salesforce-setup.com/ui/setup/apex/batch/ManageScheduledApexJobPage?retURL=%2F08e%3FretURL%3D%252Fsetup%252Fhome%26appLayout%3Dsetup%26tour%3D%26sfdcIFrameOrigin%3Dhttps%253A%252F%252Fbestprep.my.salesforce-setup.com%26sfdcIFrameHost%3Dweb%26nonce%3Db8458fec0e9653b8718fe6aa2be9443ab26ad4f33c2bff6c3885426dbdee5d87%26ltn_app_id%3D%26clc%3D1&job_name=Mentoring+Message+Filter+15&EXISTING_JOB_NAME=Mentoring+Message+Filter+15&pid=08aRP00000dYbbY&triggerId=08eRP00000dYNIS&scheduleusing=1&cronexp=0+15+*+*+*+%3F&_CONFIRMATIONTOKEN=VmpFPSxNakF5TlMweE1DMHpNVlF4TWpvMU5qbzBNeTR4TVRGYSxWQWpoNklFa2ZrZ0xzSXpTWjhZX211X2JBbXRONlNEZ1NNSFdDMGVUZXQ0PSxZV1ZtT0dFeg%3D%3D)
- [`Mentoring Message Filter 30`](https://bestprep.my.salesforce-setup.com/ui/setup/apex/batch/ManageScheduledApexJobPage?retURL=%2F08e%3FretURL%3D%252Fsetup%252Fhome%26appLayout%3Dsetup%26tour%3D%26sfdcIFrameOrigin%3Dhttps%253A%252F%252Fbestprep.my.salesforce-setup.com%26sfdcIFrameHost%3Dweb%26nonce%3Db8458fec0e9653b8718fe6aa2be9443ab26ad4f33c2bff6c3885426dbdee5d87%26ltn_app_id%3D%26clc%3D1&job_name=Mentoring+Message+Filter+30&EXISTING_JOB_NAME=Mentoring+Message+Filter+30&pid=08aRP00000dYbbZ&triggerId=08eRP00000dYNIT&scheduleusing=1&cronexp=0+30+*+*+*+%3F&_CONFIRMATIONTOKEN=VmpFPSxNakF5TlMweE1DMHpNVlF4TWpvMU5qbzBNeTR4TXpaYSxUR1ZPMHBZeVdLN0VOTTdWLV8zeEhsUHBvZU4xVkR2dnhYZFV4OWg3c0c0PSxZV1ZtT0dFeg%3D%3D)
- [`Mentoring Message Filter 45`](https://bestprep.my.salesforce-setup.com/ui/setup/apex/batch/ManageScheduledApexJobPage?retURL=%2F08e%3FretURL%3D%252Fsetup%252Fhome%26appLayout%3Dsetup%26tour%3D%26sfdcIFrameOrigin%3Dhttps%253A%252F%252Fbestprep.my.salesforce-setup.com%26sfdcIFrameHost%3Dweb%26nonce%3Db8458fec0e9653b8718fe6aa2be9443ab26ad4f33c2bff6c3885426dbdee5d87%26ltn_app_id%3D%26clc%3D1&job_name=Mentoring+Message+Filter+45&EXISTING_JOB_NAME=Mentoring+Message+Filter+45&pid=08aRP00000dYbba&triggerId=08eRP00000dYNIU&scheduleusing=1&cronexp=0+45+*+*+*+%3F&_CONFIRMATIONTOKEN=VmpFPSxNakF5TlMweE1DMHpNVlF4TWpvMU5qbzBNeTR4TmpGYSxRYWUyVkZDV1NxZjBqOUtZYVdDYWxkRkE5bzc2aU9Sa0hHNDR4MS1aajhvPSxZV1ZtT0dFeg%3D%3D)

---

## MessageFilterScheduledJob.cls

```java

global class MessageFilterScheduledJob implements Schedulable {
    
    global void execute(SchedulableContext context) {
        // Load all banned terms
        Set<String> bannedWords = new Set<String>();
        for (Filter_Terms__c term : [SELECT Name FROM Filter_Terms__c]) {
            bannedWords.add(term.Name.toLowerCase());
        }
        
        // Load messages to process
        List<Message__c> messages = [
            SELECT Id, Message__c, Filter_Status__c, Link_to_File_Attached__c,
                   (SELECT ContentDocumentId FROM ContentDocumentLinks LIMIT 1)
            FROM Message__c
            WHERE Filter_Status__c = 'Flag - New'
            LIMIT 100
        ];
        
        List<Message__c> messagesToUpdate = new List<Message__c>();
        
        for (Message__c msg : messages) {
            System.debug('Processing Message: ' + msg.Id);
            
            String original = msg.Message__c != null ? msg.Message__c.toLowerCase() : '';
         
            
            Boolean hasBannedWord = false;
            Boolean hasLink = Pattern.matches('(?i).*(https?://|www\\.).*', original);
            
            Set<String> matchedWords = new Set<String>();
            
            for (String word : bannedWords) {
                if (original.contains(word)) {
                    hasBannedWord = true;
                    matchedWords.add(word);
                }
            }
            
            Boolean hasAttachment = msg.Link_to_File_Attached__c == 'Attachment Processing';
            
            List<String> reasons = new List<String>();
            if (hasAttachment) reasons.add('File Attached');
            if (!matchedWords.isEmpty()) reasons.addAll(matchedWords);
            
            // Join and truncate to 255 characters max for the reason field
            String flagReason = String.join(reasons, ', ');
            if (flagReason.length() > 255) {
                flagReason = flagReason.substring(0, 255);
            }
            msg.Flag_Reason__c = flagReason;
            
            // --- FILE HANDLING ---
            if (hasAttachment) {
                if (!msg.ContentDocumentLinks.isEmpty()) {
                    try {
                        Id contentDocId = msg.ContentDocumentLinks[0].ContentDocumentId;
                        ContentVersion cv = [
                    SELECT Id
                    FROM ContentVersion
                    WHERE ContentDocumentId = :contentDocId
                    ORDER BY VersionNumber DESC
                    LIMIT 1
                ];
                        
                        ContentDistribution cd = new ContentDistribution();
                        cd.Name = 'Mentoring Program Attachment';
                        cd.ContentVersionId = cv.Id;
                        cd.PreferencesAllowOriginalDownload = false;
                        cd.PreferencesAllowPDFDownload = true;
                        cd.PreferencesAllowViewInBrowser = true;
                        cd.PreferencesLinkLatestVersion = true;
                        cd.PreferencesNotifyOnVisit = false;
                        cd.PreferencesPasswordRequired = false;
                        
                        insert cd;
                        
                        cd = [SELECT DistributionPublicUrl FROM ContentDistribution WHERE Id = :cd.Id];
                        msg.Link_to_File_Attached__c = cd.DistributionPublicUrl;
                        msg.Filter_Status__c = 'Flag - In Progress';
                        
                    } catch (Exception e) {
                        System.debug('ContentDistribution creation failed: ' + e.getMessage());
                        msg.Filter_Status__c = 'Flag - In Progress';
                    }
                } else {
                    System.debug('No ContentDocumentLink found for message: ' + msg.Id);
                    msg.Filter_Status__c = 'Flag - In Progress';
                }
            } else {
                if (hasBannedWord || hasLink) {
                    msg.Filter_Status__c = 'Flag - In Progress';
                } else {
                    msg.Filter_Status__c = 'Pass';
                }
            }
            
            messagesToUpdate.add(msg);
        }
        
        
        
        
        
        if (!messagesToUpdate.isEmpty()) {
            update messagesToUpdate;
        }
    }
}

```


    