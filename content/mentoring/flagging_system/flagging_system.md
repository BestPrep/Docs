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
  A[Start] --> B{Decision}
  B -->|Yes| C[Do it]
  B -->|No| D[Cancel]
</div>
