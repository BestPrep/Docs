# Mentoring Sites - Apex Code

Every single 

## MentoringMentorPortal.cls

```java
global without sharing class MentoringMentorPortal {
    
    @AuraEnabled
    public static Map<String, Object> getConnectionData(Id connectionId, String passkey) {
        Connection__c conn = [
            SELECT Id, Connection_Passkey__c, Connection_Type__c, Mentor_Out_of_Office__c,
                   Student_Familiar_Name__c, Mentor_Familiar_Name__c, Mentor_Full_Name__c,
                   Track__c, Mentor_VAF_Date__c, Mentor_Email__c,
                   Case__r.Id,
                   Case__r.Owner.Email,
                   Case__r.ParentId,
                   Case__r.Assigned_Company__r.Preferred_Recognition__c,
                   Case__r.Assigned_School__r.Preferred_Recognition__c,
                   Case__r.Celebration_Date__c,
                   Case__r.Celebration_Start_Time__c,
                   Case__r.Celebration_End_Time__c,
                   Case__r.Meet_And_Greet_Location_Address__c,
                   Case__r.CC_Date_1__c, Case__r.CC_Date_2__c, Case__r.CC_Date_3__c, Case__r.CC_Date_4__c,
                   Case__r.CC_Date_5__c, Case__r.CC_Date_6__c, Case__r.CC_Date_7__c, Case__r.CC_Date_8__c,
                   Case__r.GQ_1__r.Name, Case__r.GQ_1__r.Mentor_Talking_Points__c, Case__r.GQ_1__r.Enable_Attachments__c,
                   Case__r.GQ_2__r.Name, Case__r.GQ_2__r.Mentor_Talking_Points__c, Case__r.GQ_2__r.Enable_Attachments__c,
                   Case__r.GQ_3__r.Name, Case__r.GQ_3__r.Mentor_Talking_Points__c, Case__r.GQ_3__r.Enable_Attachments__c,
                   Case__r.GQ_4__r.Name, Case__r.GQ_4__r.Mentor_Talking_Points__c, Case__r.GQ_4__r.Enable_Attachments__c,
                   Case__r.GQ_5__r.Name, Case__r.GQ_5__r.Mentor_Talking_Points__c, Case__r.GQ_5__r.Enable_Attachments__c,
                   Case__r.GQ_6__r.Name, Case__r.GQ_6__r.Mentor_Talking_Points__c, Case__r.GQ_6__r.Enable_Attachments__c,
                   Case__r.GQ_7__r.Name, Case__r.GQ_7__r.Mentor_Talking_Points__c, Case__r.GQ_7__r.Enable_Attachments__c,
                   Case__r.Activity_GQ__r.Name, Case__r.Activity_GQ__r.Mentor_Talking_Points__c, Case__r.Activity_GQ__r.Enable_Attachments__c
            FROM Connection__c
            WHERE Id = :connectionId
            LIMIT 1
        ];
        
        if (conn.Connection_Passkey__c != passkey) {
            throw new AuraHandledException('Invalid Passkey');
        }
        
        // Determine which Case to use for coordinator query
        Id coordinatorCaseId = conn.Connection_Type__c == 'Cloud Coach'
            ? conn.Case__r.ParentId
            : conn.Case__c;
        
        // Get all coordinators for that Case
        List<BestPrep_Program_Participation__c> coordinatorRecords = [
            SELECT Role__c, Contact__r.Email
            FROM BestPrep_Program_Participation__c
            WHERE Case_Number__c = :coordinatorCaseId
            AND Role__c = 'Company Coordinator'
        ];
        
        // Extract just the email addresses
        List<String> coordinatorEmails = new List<String>();
        for (BestPrep_Program_Participation__c bppp : coordinatorRecords) {
            if (bppp.Contact__r.Email != null) {
                coordinatorEmails.add(bppp.Contact__r.Email);
            }
        }
        
        // Get messages
        List<Message__c> messages = [
            SELECT Id, Week__c, Role__c, Message__c, Filter_Status__c, CreatedDate, Link_to_File_Attached__c
            FROM Message__c
            WHERE Connection__c = :connectionId
        ];
        
        // Prepare talking points
        Map<String, Object> talkingPoints = new Map<String, Object>{
            'Week 1' => buildTP('Week 1', conn.Case__r.CC_Date_1__c, conn.Case__r.GQ_1__r),
            'Week 2' => buildTP('Week 2', conn.Case__r.CC_Date_2__c, conn.Case__r.GQ_2__r),
            'Week 3' => buildTP('Week 3', conn.Case__r.CC_Date_3__c, conn.Case__r.GQ_3__r),
            'Week 4' => buildTP('Week 4', conn.Case__r.CC_Date_4__c, conn.Case__r.GQ_4__r),
            'Week 5' => buildTP('Week 5', conn.Case__r.CC_Date_5__c, conn.Case__r.GQ_5__r),
            'Week 6' => buildTP('Week 6', conn.Case__r.CC_Date_6__c, conn.Case__r.GQ_6__r),
            'Week 7' => buildTP('Week 7', conn.Case__r.CC_Date_7__c, conn.Case__r.GQ_7__r),
            'Week 8' => buildTP('Week 8', conn.Case__r.CC_Date_8__c, conn.Case__r.Activity_GQ__r)
        };
        
        return new Map<String, Object>{
            'connection' => conn,
            'messages' => messages,
            'talkingPoints' => talkingPoints,
            'companyCoordinators' => coordinatorEmails
        };
    }
    
    private static Map<String, Object> buildTP(String week, Date d, eMentors_GQ__c gq) {
        if (gq == null) {
            return new Map<String, Object>{
                'week' => week,
                'dueDate' => '',
                'title' => 'No topic for this week.',
                'talkingPoints' => ''
            };
        }
        
        return new Map<String, Object>{
            'week' => week,
            'dueDate' => d != null ? d.format() : '',
            'title' => gq.Name,
            'talkingPoints' => gq.Mentor_Talking_Points__c,
            'enableAttachments' => gq.Enable_Attachments__c
        };
    }
    
    
    
    @AuraEnabled
    public static void upsertMentorMessage(Id connectionId, String week, String messageBody, String passkey) {
        upsertMessage(connectionId, week, 'Mentor', messageBody, passkey);
    }
    
    private static void upsertMessage(Id connectionId, String week, String role, String messageBody, String passkey) {
        Connection__c conn = [
            SELECT Id, Connection_Passkey__c
            FROM Connection__c
            WHERE Id = :connectionId
        ];
        
        if (conn.Connection_Passkey__c != passkey) {
            throw new AuraHandledException('Invalid credentials');
        }
        
        Message__c msg;
        List<Message__c> existing = [
            SELECT Id
            FROM Message__c
            WHERE Connection__c = :connectionId AND Week__c = :week AND Role__c = :role
        ];
        if (!existing.isEmpty()) {
            msg = existing[0];
            msg.Message__c = messageBody;
            msg.Filter_Status__c = 'Flag - New';
            update msg;
        } else {
            msg = new Message__c(
                Connection__c = connectionId,
            Week__c = week,
            Role__c = role,
            Message__c = messageBody,
            Filter_Status__c = 'Flag - New',
            OwnerId = UserInfo.getUserId()
                );
            insert msg;
        }
    }
    
    @AuraEnabled
    public static void upsertMentorMessageWithFile(
        Id connectionId,
    String week,
    String messageBody,
    String passkey,
    String fileName,
    String base64FileContent
    ) {
        // Validate connection credentials
        Connection__c conn = [
        SELECT Id, Connection_Passkey__c
        FROM Connection__c
        WHERE Id = :connectionId
    ];
        
        if (conn.Connection_Passkey__c != passkey) {
            throw new AuraHandledException('Invalid credentials');
        }
        
        // Upsert the mentor's message
        Message__c msg;
        List<Message__c> existing = [
        SELECT Id
        FROM Message__c
        WHERE Connection__c = :connectionId AND Week__c = :week AND Role__c = 'Mentor'
    ];
        if (!existing.isEmpty()) {
            msg = existing[0];
            msg.Message__c = messageBody;
            msg.Filter_Status__c = 'Flag - New';
            update msg;
        } else {
            msg = new Message__c(
                Connection__c = connectionId,
            Week__c = week,
            Role__c = 'Mentor',
            Message__c = messageBody,
            Filter_Status__c = 'Flag - New'
                //,OwnerId = UserInfo.getUserId()
            );
            insert msg;
        }
        
        // Upload and link file (if provided)
        if (!String.isBlank(fileName) && !String.isBlank(base64FileContent)) {
            ContentVersion cv = new ContentVersion(
                Title = fileName,
            PathOnClient = fileName,
            VersionData = EncodingUtil.base64Decode(base64FileContent)
                );
            insert cv;
            
            ContentVersion inserted = [
            SELECT Id, ContentDocumentId
            FROM ContentVersion
            WHERE Id = :cv.Id
        ];
            
            insert new ContentDocumentLink(
                ContentDocumentId = inserted.ContentDocumentId,
            LinkedEntityId = msg.Id,
            ShareType = 'V',
            Visibility = 'AllUsers'
                );
            
            System.enqueueJob(new FileAttachQueueable(msg.Id));
        }
        
    }
    
    @AuraEnabled
    public static void updateOutOfOfficeWeeks(Id connectionId, String passkey, String weeks, String track) {
        Connection__c conn = [
        SELECT Id, Connection_Passkey__c
        FROM Connection__c
        WHERE Id = :connectionId
    ];
        
        if (conn.Connection_Passkey__c != passkey) {
            throw new AuraHandledException('Invalid credentials');
        }
        
        conn.Mentor_Out_of_Office__c = weeks;
        conn.Track__c = track;
        update conn;
    }
    
    
    
    @AuraEnabled
    public static void submitVolunteerAgreement(Id connectionId, String passkey, String pronouns, String ethnicity) {
        Connection__c conn = [
            SELECT Id, Connection_Passkey__c, Mentor_BPPP__r.Contact__c
            FROM Connection__c
            WHERE Id = :connectionId
        ];
        
        if (conn.Connection_Passkey__c != passkey) {
            throw new AuraHandledException('Invalid credentials');
        }
        
        Id contactId = conn.Mentor_BPPP__r.Contact__c;
        if (contactId == null) {
            throw new AuraHandledException('Mentor contact not found.');
        }
        
        Contact c = [SELECT Id FROM Contact WHERE Id = :contactId];
        c.Pronouns__c = pronouns;
        c.Ethnicity__c = ethnicity;
        c.Volunteer_Agreement_Date__c = Date.today();
        update c;
    }
}
```
