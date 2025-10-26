# Mentoring Portal Upload

Due to the high number of errors that were historically happening with Apsona portal uploads for every connection and the high cost of Apsona licenses, we have switched to a custom build integration that allows us to process portal uploads internally. The base of this system is a simple CSV file processor that parses the CSV content into rows, then creates / updates the contact for student and mentor first, creates the BestPrep Program Participation record and relates it to each contact respectively, then creates the Connection and links it to both the case and the student and mentor BPPPs. 

To reduce errors, the upload system has extremely strict data validation filters, as well as formatting data itself when mis-constructed. 

- Names are always corrected to proper formatting 
    - "james" would become "James"
    - "RUTHIE" would become "Ruthie"
- Any pronoun format that does not match the He/him/his or She/they/theirs format will be rejected with an error message
- Case ID must be valid
- All email addresses must be in the format user@domain.com and are formatted to all lower-case. 
- Once a portal upload is completed, the option to do another portal upload for that case is disabled and must be done manually. 