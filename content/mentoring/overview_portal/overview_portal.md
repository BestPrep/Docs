# Teacher and Coordinator Portal

The teacher and company coordinator overview portal is the replacement for what was previously sending an exported Salesforce report to teachers each week and company coordinators upon request. 

**IMPORTANT NOTE:**
There are TWO different overview portals. There is the Connection Overview and the Connection Cloud. 

Connection Overview pulls its data from the child case. This would be used for an eMentors connection, or just a single specific Cloud Coach child case. However, the Connection Cloud pulls from the parent connection - and must use the case Id from the parent connection. It searches all related cases, pulls all their connections and messages, and then displays them in one place. 

Because of the fact that most Cloud Coach cases contain multiple companies, the Connection Cloud supports an additional URL tag "orgName" - orgName is a simple filter that looks for the data on the connection of the stripped ult parent organiation name. This means that as long as the social heiarchy is setup correctly in Salesforce, a mentor at "Old National Bank" and "Bremer Bank" should both have the same stripped ult parent org name - something like "oldnationalbank"

The URLs for

- [Apex Code](overview_apex.md)
- [JavaScript](overview_js.md)
- [HTML & CSS](overview_web.md)

### Screenshots