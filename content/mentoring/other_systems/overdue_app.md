# Mentoring Overdue App

The Overdue App is the BestPrep way to monitor our mentoring connections within Salesforce — to see what mentors and students have written, completed their surveys, or may be overdue on messages. The app can be found in the **Overview** tab, which you can search for via the 9 dots in the upper left corner of the screen.

By default, the app will attempt to load any open cases that you own which have the record type of either eMentors or Cloud Coach. If none exist, you will be met with an empty screen. This is the same screen you will see if you have an active case but no connection objects have yet been created.

![Overdue App Empty Window](../../images/mentoring/overdue_app/Empty.jpg)

If you would like to view a specific case that might not belong to you, you can do so using the selection dropdown on the right-hand side of the app. Cases in the dropdown are grouped by case owner. You can choose to view all cases for a specific staff member at once using the **View All [Name] Cases** option, or select a single specific case.

![An example of the options for selection](../../images/mentoring/overdue_app/Selection.jpg)

Once you have selected a case, the view will populate. You have the option to choose from two different overall views — either **Mentors** or **Students** — using the toggle buttons in the upper left. You can then further narrow what you see using the **Class Period** filter or the **Only Show Overdue** checkbox. Any changes you make to the on-screen filters will also apply to the file downloaded using the download feature.

![Overdue App Default Window](../../images/mentoring/overdue_app/Default.jpg)

![Overdue App Filtered Window](../../images/mentoring/overdue_app/Filtered.jpg)

Each case is displayed as its own table, with the header showing the **Case Subject** and the **Case Owner's name**. The row count shown next to the case title reflects the number of connections currently visible given your active filters.

---

## The Status Grid

Each row in the table represents one mentor-student connection. The columns are as follows:

- **Primary name column** — the name of the person whose view you are in (Mentor or Student), shown in bold and linked to the connection record in Salesforce
- **Secondary name column** — the paired person's name, shown in grey
- **Week columns** — one column per program week, labeled **Week 1**, **Week 2**, etc., with the due date shown in smaller italic text beneath the label
- **Survey column(s)** — one or two checkbox columns at the end depending on the view (see below)

Each week cell displays one of four icons:

| Icon | Meaning |
|------|---------|
| ✅ Green check | The message was submitted. Hovering shows the submission date. |
| ❌ Red X | The message is overdue. Clicking opens a pre-filled email to the mentor or student. |
| ⚠️ Yellow warning | The message is at risk — it is due soon but has not yet been written. Clicking opens a pre-filled reminder email. |
| ••• Grey dots | The week is not yet due. No action needed. |
| 🔘 Grey circle | The mentor is marked as Out of Office for this week (see below). |

---

## Mentor View

The Mentor view shows one row per connection, with the **mentor** as the primary (bold) name and the **student** as the secondary (grey) name.

For **Cloud Coach** cases, a mentor is considered overdue as soon as the week date has passed and they have not written their message. They are considered **at risk** if the due date is within 4 days and no message has been written yet.

For **eMentors** cases, a mentor is considered overdue if their student has written a message and the mentor has not replied within 3 days.

At the end of each row there is a **Mentor Survey** column showing whether the mentor has completed their end-of-program survey (green check = complete, red X = incomplete).

---

## Student View

The Student view shows one row per connection, with the **student** as the primary (bold) name and the **mentor** as the secondary (grey) name.

A student is considered overdue if they have not written their week's message more than 3 days after the week date.

For **Cloud Coach** cases, there are two survey columns at the end of each row:

- **Pre-Survey** — whether the student completed the pre-program survey
- **Survey** — whether the student completed the end-of-program survey

For **eMentors** cases, only the **Survey** column is shown.

---

## Only Show Overdue Filter

The **Only Show Overdue** checkbox (located in the top controls bar, next to the Class Period filter) limits the table to connections that currently require attention. The logic differs slightly by program type and view:

**Mentor view — Cloud Coach:** Shows mentors who have not written the most recent due week's message, and are either past the due date or within 4 days of it.

**Mentor view — eMentors:** Shows mentors who have not replied to their student's most recent message within 3 days.

**Student view (all types):** Shows students who have not written the most recent due week's message and are more than 3 days past that week's due date.

> **Important:** Only the *most recent active week* is evaluated. A mentor or student who missed an earlier week but is current on the latest week will **not** appear in the overdue filter.

---

## Out of Office

If a mentor has been marked as **Out of Office** for a given week (set on the connection record in Salesforce), their week cell will display a grey circle icon rather than a red X or yellow warning, and they will **not** be included in the overdue filter for that week.

The one exception is the **previous week fallback rule**: if a mentor is out of office for the current week *and* also missed the previous week without being out of office for it, they will still appear in the overdue filter. This ensures that a sustained pattern of missed messages is not hidden by an out-of-office designation.

---

## Emailing Mentors and Students

Clicking a **red X** (overdue) or **yellow warning** (at risk) icon opens your default email client with a pre-filled message addressed to the mentor or student. The email includes:

- A personalized greeting using the mentor's or student's familiar name
- Context about which week is missing
- A direct link to their mentoring portal
- Your first name as the sign-off

If you are viewing a case that belongs to another staff member (i.e., you used the dropdown to load someone else's case), the case owner will automatically be **CC'd** on any email you send from within the app.

---

## Downloading a CSV

Clicking the **download icon** (top right of the app, only visible when data is loaded) generates one CSV file per case currently displayed. The filename follows the format:

```
CaseSubject_OverdueMentors.csv
CaseSubject_OverdueStudents.csv
```

The file only includes the connections currently visible on screen — if you have the **Only Show Overdue** filter active or a **Class Period** filter applied, only those rows will be exported. This makes the download immediately ready for tasks such as a mail merge in Outlook to all overdue mentors.

Depending on the active view, the columns in the exported file differ:

**Mentor CSV:**

| Mentor Full Name | Mentor Familiar Name | Mentor Email | Mentor Organization | Week 1 Date | Week 2 Date | … | Mentor Survey Complete | Mentor Portal Link |

**Student CSV (Cloud Coach):**

| Student Full Name | Student Familiar Name | Student Email | Student Pre-Survey Complete | Week 1 Date | Week 2 Date | … | Survey Complete | Student Portal Link |

**Student CSV (eMentors):**

| Student Full Name | Student Familiar Name | Student Email | Week 1 Date | Week 2 Date | … | Survey Complete | Student Portal Link |

Week date columns are labeled with the week name and date (e.g. `Week 1 (01/16/2026)`). A date value is only filled in for weeks where the message has been submitted; overdue or pending weeks are left blank.

![Excel Spreadsheet - CSV](../../images/mentoring/overdue_app/Excel.jpg)

---

## Features Summary

- **Mentor and Student views** — toggle between the two perspectives using the button group in the top left
- **Class Period filter** — narrow the table to a single class period when a case has multiple periods
- **Only Show Overdue** — hide connections that are current and only surface those needing follow-up
- **Out of Office awareness** — mentors marked OOO for a week are shown with a grey icon and excluded from the overdue filter, unless they also missed the prior week without being OOO
- **Click-to-email** — red and yellow icons are clickable links that open a pre-addressed, pre-filled email in your default mail client; case owner is auto-CC'd if you are not the owner
- **Survey status columns** — at-a-glance checkboxes for mentor survey completion (mentor view) and student pre-survey and survey completion (student view)
- **Case owner grouping** — the dropdown groups cases by staff member, with a "View All" option per person
- **CSV download** — exports exactly what is on screen, one file per case, in a format ready for mail merge or reporting
- **Case header** — every table is labeled with both the case subject and the case owner's name so context is always clear when viewing multiple cases at once