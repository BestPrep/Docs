# Mentoring Sites - JavaScript

The JavaScript (called js) is what allows the part of the website we see (the html) to talk to the data we got from Salesforce (the apex code). Below is the code for the mentor portal:

## mentorPortal.js

```java
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import MentoringEasterEgg from '@salesforce/resourceUrl/MentoringEasterEgg';
import getConnectionData from '@salesforce/apex/MentoringMentorPortal.getConnectionData';
import upsertMentorMessageWithFile from '@salesforce/apex/MentoringMentorPortal.upsertMentorMessageWithFile';
import submitVolunteerAgreement from '@salesforce/apex/MentoringMentorPortal.submitVolunteerAgreement';
import updateOutOfOfficeWeeks from '@salesforce/apex/MentoringMentorPortal.updateOutOfOfficeWeeks';



export default class StudentPortal extends LightningElement {
  @track isEasterEggVisible = false;
  @track svgUrl;
  @track isLoading = true;
  @track accessDenied = true;
  @track connectionId;
  @track pw;
  @track mentorName = '';
  @track mentorEmail = '';
  @track companyName = '';
  @track weekList = [];
  @track currentOutOfOffice = [];
  @track isSettingsOpen = false;
  @track connectionData = {};
  @track talkingPoints = {};
  @track allMessages = [];
  @track selectedTrack = 'Track 2';
  @track trackDescription = 'Track 2 is the default track - it will work well for most students.';
  @track selectedWeek = 'VAF';
  @track messageBody = '';
  @track statusMsg = '';
  @track isInfoOpen = false;
  @track infoData = {};
  @track mapMarkers = [];
  @track mentorResourcesUrl = '';
  @track trainingVideoUrl = '';
  @track googleCalUrl = '';
  @track outlookCalUrl = '';
  @track bestPrepMailto = '';
  @track companyCoordMailto = '';
  @track modalStatusMsg = '';
  @track vafForm = {
    pronouns: [],
    ethnicity: '',
    agreements: {},
  };
  @track vafDateValid = null;
  @track selectedFile;
  @track attachmentEnabled = false;

  weekOptions = [
    { label: 'VAF', value: 'VAF' },
    { label: 'Week 1', value: 'Week 1' },
    { label: 'Week 2', value: 'Week 2' },
    { label: 'Week 3', value: 'Week 3' },
    { label: 'Week 4', value: 'Week 4' },
    { label: 'Week 5', value: 'Week 5' },
    { label: 'Week 6', value: 'Week 6' },
    { label: 'Week 7', value: 'Week 7' },
    { label: 'Week 8', value: 'Week 8' },
    { label: 'Survey', value: 'Survey' }
  ];

  @wire(CurrentPageReference)
  async getStateParams(pageRef) {
    const today = new Date();
    if (!pageRef?.state?.connectionId || !pageRef?.state?.passkey) return;
    this.connectionId = pageRef.state.connectionId;
    this.pw = pageRef.state.passkey;

    try {
      const result = await getConnectionData({
        connectionId: this.connectionId,
        passkey: this.pw
      });

      this.connectionData = result.connection;
      this.talkingPoints = result.talkingPoints || {};
      this.allMessages = result.messages;
      this.isLoading = false;
      this.accessDenied = false;

      const fiscalYearStart = today.getMonth() >= 8 ? new Date(today.getFullYear(), 8, 1) : new Date(today.getFullYear() - 1, 8, 1);
      const fiscalYearEnd = new Date(fiscalYearStart.getFullYear() + 1, 7, 31);
      const rawVafDate = this.connectionData?.Mentor_VAF_Date__c;
      const vafDate = rawVafDate ? new Date(rawVafDate) : null;
      this.vafDateValid = !!(vafDate && vafDate >= fiscalYearStart && vafDate <= fiscalYearEnd);
      this.selectedWeek = this.vafDateValid ? 'Week 1' : 'VAF';

      this.weekOptions = [{
        label: 'VAF',
        value: 'VAF',
        cssClass: this.vafDateValid ? 'sidebar-item disabled' : 'sidebar-item'
      }];

      if (this.vafDateValid) {
        for (let i = 1; i <= 8; i++) {
          const key = `Week ${i}`;
          const tp = this.talkingPoints[key];
          if (tp && tp.talkingPoints) {
            const isOverdue = this.isWeekOverdue(key);
            this.weekOptions.push({
              label: key,
              value: key,
              cssClass: 'sidebar-item',
              isOverdue
            });
          }
        }
      }

      this.attachmentEnabled = this.talkingPoints[this.selectedWeek]?.enableAttachments || false;

      this.weekOptions.push({
        label: 'Survey',
        value: 'Survey',
        cssClass: 'sidebar-item'
      });

    } catch (e) {
      console.error('Connection error:', e);
      this.isLoading = false;
      this.accessDenied = true;
    }
  }

  connectedCallback() {

    this.svgUrl = MentoringEasterEgg;

    const params = new URLSearchParams(window.location.search);
    if (params.get('easteregg') === 'true') {
      this.isEasterEggVisible = true;

      setTimeout(() => {
        this.isEasterEggVisible = false;
      }, 30000);
    }


  }

  renderedCallback() {
    if (this.accessDenied || !this.connectionData?.Id || typeof this.vafDateValid !== 'boolean') return;
    const msgBox = this.template.querySelector('[data-id="mentorMsg"]');
    if (msgBox && this.mentorMessage) msgBox.innerHTML = this.mentorMessage;

    this.template.querySelectorAll('.sidebar-item').forEach(el => {
      const weekVal = el.dataset.week;
      el.classList.toggle('active-week', weekVal === this.selectedWeek);
    });
  }

  handleWeekClick(event) {
    const el = event.currentTarget;
    if (el.classList.contains('disabled')) return;

    const selected = el.dataset.week;
    this.selectedWeek = selected;
    this.statusMsg = '';
    this.messageBody = '';
    this.selectedFile = null;
    this.attachmentEnabled = this.talkingPoints[selected]?.enableAttachments || false;

    setTimeout(() => {
      const msgBox = this.template.querySelector('[data-id="mentorMsg"]');
      if (msgBox && this.mentorMessage) msgBox.innerHTML = this.mentorMessage;
    }, 10);
  }

  handleChange(event) {
    this.messageBody = event.target.value;
  }

  handleFileChange(event) {
    this.selectedFile = event.target.files[0];
  }

  openInfoModal() {
    this.isInfoOpen = true;
    this.modalStatusMsg = '';
    this.loadInfoModal();
  }

  closeInfoModal() {
    this.isInfoOpen = false;
  }


  openSettingsModal() {
    this.isSettingsOpen = true;
  }

  closeSettingsModal() {
    this.isSettingsOpen = false;
  }

  handleBackdropClick(event) {
    this.closeSettingsModal();
    this.closeInfoModal();
  }

  stopModalClick(event) {
    event.stopPropagation();
  }

  openSettingsModal() {
    this.isSettingsOpen = true;
    this.modalStatusMsg = '';

    // Always load current settings (even if weekList is already populated)
    this.loadMentorSettings();
  }

  loadInfoModal() {
    try {
      const conn = this.connectionData;
      const caseData = conn.Case__r || {};
      const type = conn.Connection_Type__c || '';
      const event = type === 'Cloud Coach' ? 'Cloud Summit' : 'Meet & Greet';

      this.mentorResourcesUrl = type === 'Cloud Coach'
        ? 'https://bestprep.org/cloud-coach-volunteers/resources/'
        : 'https://bestprep.org/ementors-volunteers/resources/';

      this.trainingVideoUrl = type === 'Cloud Coach'
        ? 'https://youtu.be/zQT96G5pNYY'
        : 'https://www.youtube.com/watch?v=_nDPkJ80hvw';

      const date = caseData.Celebration_Date__c; // e.g., "2025-07-30"
      const startTime = caseData.Celebration_Start_Time__c; // e.g., "11:00 AM"
      const endTime = caseData.Celebration_End_Time__c;     // e.g., "2:00 PM"
      const calAddress = caseData.Meet_And_Greet_Location_Address__c || '';
      const school = caseData.Assigned_School__r?.Preferred_Recognition__c || '';
      const company = caseData.Assigned_Company__r?.Preferred_Recognition__c || '';
      const title = `${event} - ${school} & ${company}`;

      // Convert AM/PM to 24-hour
      const to24Hour = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      };

      const startTime24 = to24Hour(startTime);
      const endTime24 = to24Hour(endTime);

      const startDateTime = `${date}T${startTime24}:00`;
      const endDateTime = `${date}T${endTime24}:00`;


      // Google Calendar (UTC required)
      const formatForGoogle = (dateStr) => {
        const dt = new Date(dateStr); // assumes local time
        if (isNaN(dt)) {
          console.warn('Invalid date for calendar:', dateStr);
          return '';
        }
        return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };


      const googleStart = formatForGoogle(startDateTime);
      const googleEnd = formatForGoogle(endDateTime);

      if (googleStart && googleEnd) {
        const googleParams = new URLSearchParams({
          action: 'TEMPLATE',
          text: title,
          dates: `${googleStart}/${googleEnd}`,
          location: calAddress,
          details: 'Event details available in your BestPrep mentor portal.'
        });
        this.googleCalUrl = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;
      } else {
        this.googleCalUrl = '';
      }


      // Outlook Calendar (local)
      const outlookParams = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        startdt: startDateTime,
        enddt: endDateTime,
        subject: title,
        location: calAddress,
        body: 'Event details available in your BestPrep mentor portal.'
      });
      this.outlookCalUrl = `https://outlook.office.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;

      // Emails
      const bestPrepEmail = caseData.Owner?.Email || '';
      this.bestPrepMailto = `mailto:${bestPrepEmail}?subject=Mentor Info&body=Hello BestPrep Coordinator,%0D%0A...`;

      const ccList = this.connectionData?.companyCoordinators || [];
      if (ccList.length > 0) {
        const to = ccList[0];
        const cc = ccList.slice(1).join(',');
        this.companyCoordMailto = `mailto:${to}?cc=${cc}&subject=Mentor Info&body=Hello Company Coordinator,%0D%0A...`;
      }

      // Map address split
      const address = calAddress;
      let street = '', city = '', state = '', postalCode = '';
      const parts = address.split(',');
      if (parts.length === 3) {
        street = parts[0].trim();
        city = parts[1].trim();
        const stateZip = parts[2].trim().split(' ');
        if (stateZip.length >= 2) {
          state = stateZip[0];
          postalCode = stateZip[1];
        }
      }

      this.mapMarkers = street && city && state && postalCode ? [{
        location: { Street: street, City: city, State: state, PostalCode: postalCode },
        title: event,
        description: 'Event Location'
      }] : [];

      this.infoData = {
        event,
        date,
        startTime,
        endTime,
        address
      };
    } catch (e) {
      console.error('Error loading info modal:', e);
    }
  }


  loadMentorSettings() {
    const conn = this.connectionData;

    this.mentorName = conn.Mentor_Full_Name__c;
    this.mentorEmail = conn.Mentor_Email__c;
    this.companyName = conn.Case__r?.Assigned_Company__r?.Preferred_Recognition__c || '';
    this.modalStatusMsg = '';


    this.selectedTrack = conn.Track__c || 'Track 2';
    this.trackDescription = this.getTrackDescription(this.selectedTrack);


    this.selectedTrack = ''; // force LWC to re-track
    setTimeout(() => {
      this.selectedTrack = conn.Track__c || 'Track 2';
      this.trackDescription = this.getTrackDescription(this.selectedTrack);
    }, 0);

    const outOfOffice = conn.Mentor_Out_of_Office__c || '';
    this.currentOutOfOffice = outOfOffice.split(';').map(w => w.trim());

    this.weekList = [];
    for (let i = 1; i <= 8; i++) {
      const tp = this.talkingPoints[`Week ${i}`];
      if (tp && tp.dueDate) {
        this.weekList.push({
          label: `Week ${i} (${tp.dueDate})`,
          name: `Week ${i}`,
          checked: this.currentOutOfOffice.includes(`Week ${i}`)
        });
      }
    }

    const half = Math.ceil(this.weekList.length / 2);
    this.weekListLeft = this.weekList.slice(0, half);
    this.weekListRight = this.weekList.slice(half);
  }



  handleWeekToggle(event) {
    const week = event.target.name;
    const isChecked = event.target.checked;

    // Update currentOutOfOffice
    if (isChecked) {
      if (!this.currentOutOfOffice.includes(week)) {
        this.currentOutOfOffice.push(week);
      }
    } else {
      this.currentOutOfOffice = this.currentOutOfOffice.filter(w => w !== week);
    }

    // Sync checked status in weekList
    this.weekList = this.weekList.map(w => ({
      ...w,
      checked: w.name === week ? isChecked : w.checked
    }));
  }

  handleUpdateSettings() {
    try {
      const selectedWeeks = this.weekList
        .filter(w => w.checked)
        .map(w => w.name)
        .join(';');

      updateOutOfOfficeWeeks({
        connectionId: this.connectionId,
        passkey: this.pw,
        weeks: selectedWeeks,
        track: this.selectedTrack
      })
        .then(() => {
          this.connectionData.Mentor_Out_of_Office__c = selectedWeeks;
          this.connectionData.Track__c = this.selectedTrack;

          this.currentOutOfOffice = selectedWeeks.split(';');
          this.weekList.forEach(w => {
            w.checked = this.currentOutOfOffice.includes(w.name);
          });

          const half = Math.ceil(this.weekList.length / 2);
          this.weekListLeft = this.weekList.slice(0, half);
          this.weekListRight = this.weekList.slice(half);

          this.modalStatusMsg = 'Settings updated successfully.';
        })
        .catch((e) => {
          console.error('Update error:', e);
          this.modalStatusMsg = 'An error occurred while saving your settings.';
        });
    } catch (e) {
      console.error('JS error:', e);
      this.modalStatusMsg = 'Unexpected error while saving your settings.';
    }
  }


  handleReportError() {
    const conn = this.connectionData;
    const coordinatorEmail = conn?.Case__r?.Owner?.Email;
    const connectionId = conn?.Id;
    const connectionType = conn?.Connection_Type__c;

    if (!coordinatorEmail || !connectionId || !connectionType) {
      this.modalStatusMsg = 'Could not find coordinator email or connection info.';
      return;
    }

    const connectionUrl = `https://bestprep.lightning.force.com/lightning/r/Connection__c/${connectionId}/view`;

    const subject = encodeURIComponent('Please Update my Information');
    const body = encodeURIComponent(
      `Hi!\n\nCan you please update my information for the ${connectionType} Connection?\n\n${connectionType} Connection: ${connectionUrl}`
    );

    const mailtoLink = `mailto:${coordinatorEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }


  async handleSubmit() {
    const cleanHtml = this.sanitizeInput(this.messageBody);
    const triggerEasterEgg = cleanHtml.toLowerCase().includes('i am underpaid');

    try {
      let base64FileContent = '';
      let fileName = '';

      if (this.attachmentEnabled && this.selectedFile) {
        if (this.selectedFile.type !== 'application/pdf') {
          this.statusMsg = 'Only PDF files are allowed.';
          return;
        }

        const fileData = await this.readFileAsBase64(this.selectedFile);
        base64FileContent = fileData;
        fileName = this.selectedFile.name;
      }

      await upsertMentorMessageWithFile({
        connectionId: this.connectionId,
        week: this.selectedWeek,
        messageBody: cleanHtml,
        passkey: this.pw,
        fileName,
        base64FileContent
      });

      if (triggerEasterEgg) {
        this.isEasterEggVisible = true;
        setTimeout(() => {
          this.isEasterEggVisible = false;
          window.location.reload();
        }, 30000); // 30,000 = 30 seconds
      } else {
        window.location.reload();
      }

    } catch (e) {
      console.error('Submission error:', e);
      this.statusMsg = e?.body?.message || e?.message || 'An error occurred while submitting.';
    }
  }


  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  handleCheckboxChange(event) {
    const name = event.target.name;
    if (event.target.type === 'checkbox') {
      this.vafForm.agreements[name] = event.target.checked;
    } else {
      this.vafForm[name] = event.detail.value;
    }
  }

  selectSupportTrack() {
    this.selectedTrack = 'Support Track';
    this.trackDescription = this.getTrackDescription(this.selectedTrack);
  }

  selectTrack1() {
    this.selectedTrack = 'Track 1';
    this.trackDescription = this.getTrackDescription(this.selectedTrack);
  }

  selectTrack2() {
    this.selectedTrack = 'Track 2';
    this.trackDescription = this.getTrackDescription(this.selectedTrack);
  }

  selectTrack3() {
    this.selectedTrack = 'Track 3';
    this.trackDescription = this.getTrackDescription(this.selectedTrack);
  }


  getTrackDescription(track) {
    switch (track) {
      case 'Support Track':
        return 'Support Track is for students that have not replied to you after two weeks.';
      case 'Track 1':
        return 'Track 1 focuses on building a strong foundation with simple questions.';
      case 'Track 2':
        return 'Track 2 is the default track - it will work well for most students.';
      case 'Track 3':
        return 'Track 3 is for advanced students. Use this track if your student is writing long and engaging messages.';
      default:
        return '';
    }
  }



  async handleVafSubmit() {
    const { pronouns, ethnicity, agreements } = this.vafForm;

    const hasPronoun = Array.isArray(pronouns) && pronouns.length > 0;
    const hasEthnicity = ethnicity && ethnicity.trim() !== '';
    const allAgreed = ['agreeBelief', 'watchedVideo', 'agreePractice']
      .every(key => agreements[key] === true);

    if (!hasPronoun) {
      this.statusMsg = 'Please select at least one pronoun.';
      return;
    }

    if (!hasEthnicity) {
      this.statusMsg = 'Please select an ethnicity.';
      return;
    }

    if (!allAgreed) {
      this.statusMsg = 'Please check all three agreement boxes.';
      return;
    }

    try {
      await submitVolunteerAgreement({
        connectionId: this.connectionId,
        passkey: this.pw,
        pronouns: pronouns.join('; '),
        ethnicity: ethnicity
      });
      window.location.reload();
    } catch (e) {
      console.error('submitVolunteerAgreement error', JSON.stringify(e));
      this.statusMsg = e?.body?.message || e?.message || 'Error submitting VAF.';
    }
  }


  sanitizeInput(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelectorAll('img').forEach(img => img.remove());
    return div.innerHTML;
  }

  get isCloudCoach() {
    return this.connectionData.Connection_Type__c === 'Cloud Coach';
  }

  get isVAF() {
    return this.selectedWeek === 'VAF';
  }

  get isSurveyWeek() {
    return this.selectedWeek === 'Survey';
  }

  get mentorMessageNeedsReview() {
    return this.mentorMessage && this.mentorMessageStatus !== 'Pass';
  }

  get mentorFileLink() {
    const msg = this.allMessages.find(m => m.Week__c === this.selectedWeek && m.Role__c === 'Mentor');
    return msg?.Link_to_File_Attached__c || null;
  }

  get isMentorFileProcessing() {
    const msg = this.allMessages.find(m => m.Week__c === this.selectedWeek && m.Role__c === 'Mentor');
    return msg?.Link_to_File_Attached__c === 'Attachment Processing';
  }


  get studentFileLink() {
    const msg = this.allMessages.find(m => m.Week__c === this.selectedWeek && m.Role__c === 'Student');
    return msg?.Filter_Status__c === 'Pass' ? msg?.Link_to_File_Attached__c : null;
  }

  get studentFamiliarName() {
    return this.connectionData?.Student_Familiar_Name__c || '';
  }

  get mentorFullName() {
    return this.connectionData?.Mentor_Full_Name__c || '';
  }

  get assignedCompany() {
    return this.connectionData?.Case__r.Assigned_Company__r.Preferred_Recognition__c || '';
  }

  get assignedSchool() {
    return this.connectionData?.Case__r.Assigned_School__r.Preferred_Recognition__c || '';
  }

  get studentMessage() {
    const msg = this.allMessages.find(m => m.Week__c === this.selectedWeek && m.Role__c === 'Student');
    if (!msg) return '';
    return msg.Filter_Status__c === 'Pass' ? msg.Message__c : `${this.studentFamiliarName}'s message is still pending manual review.`;
  }

  get mentorMessage() {
    return this.allMessages.find(m => m.Week__c === this.selectedWeek && m.Role__c === 'Mentor')?.Message__c;
  }

  get mentorMessageStatus() {
    const msg = this.allMessages.find(m => m.Week__c === this.selectedWeek && m.Role__c === 'Mentor');
    return msg?.Filter_Status__c;
  }

  get supportTrackVariant() {
    return this.selectedTrack === 'Support Track' ? 'brand' : 'neutral';
  }
  get track1Variant() {
    return this.selectedTrack === 'Track 1' ? 'brand' : 'neutral';
  }
  get track2Variant() {
    return this.selectedTrack === 'Track 2' ? 'brand' : 'neutral';
  }
  get track3Variant() {
    return this.selectedTrack === 'Track 3' ? 'brand' : 'neutral';
  }

  // Dynamic event name based on type
  get eventName() {
    return this.connectionData?.Connection_Type__c === 'Cloud Coach' ? 'Cloud Summit' : 'Meet & Greet';
  }


  get googleCalendarLabel() {
    return `Add ${this.eventName} to Google Calendar`;
  }

  get outlookCalendarLabel() {
    return `Add ${this.eventName} to Outlook Calendar`;
  }

  get contactCompanyCoordinatorLabel() {
    return `Contact ${this.assignedCompany} Coordinator`;
  }


  // Date/time formatting (optional based on data)
  get eventDate() {
    return this.connectionData?.Case__r?.Celebration_Date__c || '';
  }

  get eventStartTime() {
    return this.connectionData?.Case__r?.Celebration_Start_Time__c || '';
  }
  get eventEndTime() {
    return this.connectionData?.Case__r?.Celebration_End_Time__c || '';
  }
  get eventAddress() {
    return this.connectionData?.Case__r?.Meet_And_Greet_Location_Address__c || '';
  }



  get mentorCanWrite() {
    const tp = this.talkingPoints[this.selectedWeek];
    if (!tp?.dueDate) return false;

    const today = new Date();
    const due = new Date(tp.dueDate);
    const studentWrote = !!this.studentMessage;
    const mentorWrote = !!this.mentorMessage;

    if (this.isCloudCoach) {
      const early = new Date(due);
      early.setDate(early.getDate() - 7);
      return today >= early;
    }

    const late = new Date(due);
    late.setDate(late.getDate() + 14);
    return !mentorWrote && (studentWrote || today >= late);
  }

  get mentorCanWriteDateText() {
    const tp = this.talkingPoints[this.selectedWeek];
    if (!tp?.dueDate) return '';
    const due = new Date(tp.dueDate);
    const ref = new Date(due);
    ref.setDate(ref.getDate() + (this.isCloudCoach ? -7 : 14));
    return ref.toLocaleDateString();
  }

  get currentGuidingQuestion() {
    return this.talkingPoints[this.selectedWeek] || { title: '', dueDate: '', talkingPoints: '' };
  }

  get leftMessageLabel() {
    return this.isCloudCoach ? 'Your' : `${this.studentFamiliarName}'s`;
  }

  get rightMessageLabel() {
    return this.isCloudCoach ? `${this.studentFamiliarName}'s` : 'Your';
  }

  get leftMessageContent() {
    return this.isCloudCoach ? this.mentorMessage : this.studentMessage;
  }

  get pronounOptions() {
    return [
      { label: 'She/Her', value: 'She/Her' },
      { label: 'He/Him', value: 'He/Him' },
      { label: 'They/Them', value: 'They/Them' },
      { label: "Ey/em", value: "Ey/em" },
      { label: "Ze/zir", value: "Ze/zir" },
      { label: "Co/co", value: "Co/co" },
      { label: 'Prefer not to say', value: 'Prefer not to say' }
    ];
  }

  get ethnicityOptions() {
    return [
      { label: 'Asian', value: 'Asian' },
      { label: 'Black or African American', value: 'Black or African American' },
      { label: 'Hispanic or Latino', value: 'Hispanic or Latino' },
      { label: 'White', value: 'White' },
      { label: "American Indian", value: "American Indian" },
      { label: "Two or more races", value: "Two or more races" },
      { label: 'Other', value: 'Other' },
      { label: 'Prefer not to say', value: 'Prefer not to say' }
    ];
  }

  get vafCheckboxes() {
    return [
      { name: 'agreeBelief', label: 'I have read the Belief Statements.' },
      { name: 'watchedVideo', label: 'I have watched the cultural humility video.' },
      { name: 'agreePractice', label: 'I agree to practice cultural humility.' }
    ];
  }

  isWeekOverdue(week) {
    const tp = this.talkingPoints[week];
    if (!tp?.dueDate) return false;

    const dueDate = new Date(tp.dueDate);
    const today = new Date();

    const mentorMsg = this.allMessages.find(m => m.Week__c === week && m.Role__c === 'Mentor');
    const studentMsg = this.allMessages.find(m => m.Week__c === week && m.Role__c === 'Student');

    if (this.isCloudCoach) {
      return today > dueDate && !mentorMsg;
    } else {
      if (studentMsg && !mentorMsg) {
        const threeDaysAfterStudent = new Date(studentMsg.CreatedDate);
        threeDaysAfterStudent.setDate(threeDaysAfterStudent.getDate() + 3);
        return today > threeDaysAfterStudent;
      }
      return false;
    }
  }
}
```
## Metadata
Similarly to our Apex code, the JavaScript also needs a meta file for Salesforce LWC use. 

** mentorPortal.js-meta.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
  <apiVersion>59.0</apiVersion>
  <isExposed>true</isExposed>
  <targets>
    <target>lightningCommunity__Page</target>
  </targets>
</LightningComponentBundle>

```
