# Welcome to the BestPrep Mentoring Portals Documentation

This site documents the custom-built **Mentor and Student portals** that support BestPrep’s **eMentors** and **Cloud Coach** programs. Both portals are powered by a shared Salesforce backend and Lightning Web Components (LWC), with custom Apex, JavaScript, and Flow logic.

Use this site to understand the technical design, program logic, and how these tools work together to deliver a seamless mentoring experience.

---

## Purpose

- Provide clear technical documentation for the **Mentor Portal**, **Student Portal**, and **Overview Portal**
- Explain how both **eMentors** and **Cloud Coach** are supported within the **same codebase**
- Document Apex classes, JS modules, and LWC components behind each interface
- Help developers safely extend or troubleshoot the mentoring system

---

## Portal Overview

The mentoring system consists of 3 major public-facing portals:

| Portal           | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Mentor Portal**   | Used by mentors to send weekly messages, view student responses, and manage availability |
| **Student Portal**  | Used by students to read guiding questions, mentor responses, and submit messages |
| **Overview Portal** | Used by teachers to view weekly connection progress across all students |

Each portal dynamically loads based on a secure URL with a passkey and connection ID. All data is sourced from custom Salesforce objects and records.

---

## Explore the Code and Design

### Mentor Portal
- [Mentor Portal Overview](mentor_portal/mentor_portal.md)
- [Mentor Portal Apex](mentor_portal/mentor_apex.md)
- [Mentor Portal JS & LWC](mentor_portal/mentor_js.md)



---

## Need Help?

For questions about this portal or to suggest edits, contact **Tovin Sannes-Venhuizen** or email `tsannes-venhuizen@bestprep.org`.

