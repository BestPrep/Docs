# Mentoring Sites - HTML & CSS

Every single webpage has a few different parts. Ours has 4 - the Apex Code (Salesforce), the JavaScript (what talks to Salesforce), the HTML (what we see), and the CSS (the code that tells our computer how to style the HTML). Think of the HTML like the structure of the house, and the CSS like the paint and wallpaper. 

## mentorPortal.html

```html
<template>
  <!-- Loading Spinner -->
  <div if:true={isLoading} class="spinner-wrapper">
    <lightning-spinner alternative-text="Loading" size="large"></lightning-spinner>
  </div>

  <!-- Loaded View -->
  <div if:false={isLoading}>
    <!-- Access Denied -->
    <template if:true={accessDenied}>
      <h1>Access denied. Please check your credentials.</h1>
    </template>

    <!-- Main Portal -->
    <template if:false={accessDenied}>
      <div class="container">

        <!-- Top Button Group -->
        <div class="button-group-top">
          <div class="info-button" onclick={openInfoModal}>
            <lightning-icon icon-name="utility:info" alternative-text="More Information" size="small"></lightning-icon>
          </div>
          <div class="settings-button" onclick={openSettingsModal}>
            <lightning-icon icon-name="utility:settings" alternative-text="Settings" size="small"></lightning-icon>
          </div>
        </div>

 
          <template if:true={isEasterEggVisible}>
            <div class="easteregg-backdrop">
              <div class="easteregg-wrapper">
                <object data={svgUrl} type="image/svg+xml" class="easteregg-svg"></object>
              </div>
            </div>
          </template>
      


        <!-- INFO MODAL -->
        <template if:true={isInfoOpen}>
          <section role="dialog" tabindex="-1" class="modal-backdrop" onclick={handleBackdropClick}>
            <div class="settings-modal" onclick={stopModalClick}>
              <div class="modal-header">
                <lightning-icon icon-name="utility:close" alternative-text="Close" size="x-small"
                  onclick={closeInfoModal} class="close-icon"></lightning-icon>
              </div>
              <div class="modal-body">
                <div class="info-grid">
                  <div class="info-box">
                    <p><strong>{eventName} Date:</strong> {eventDate}</p>
                    <p><strong>{eventName} Start Time:</strong> {eventStartTime}</p>
                    <p><strong>{eventName} End Time:</strong> {eventEndTime}</p>
                  </div>
                  <div class="info-box">
                    <p><strong>{eventName} Address:</strong> {eventAddress}</p>
                    <lightning-map map-markers={mapMarkers} zoom-level="14" style="height: 200px;"></lightning-map>
                  </div>
                  <div class="info-box">
                    <a href={mentorResourcesUrl} target="_blank" class="link-button">Mentor Resources</a><br>
                    <a href={trainingVideoUrl} target="_blank" class="link-button">Training Video</a>
                  </div>
                  <div class="info-box">
                    <a href={googleCalUrl} target="_blank" class="link-button">Add to Google Calendar</a><br>
                    <a href={outlookCalUrl} target="_blank" class="link-button">Add to Outlook Calendar</a>
                  </div>
                </div>
                <div class="modal-footer">
                  <a href={bestPrepMailto} class="link-button">Contact BestPrep Coordinator</a>
                  <a href={companyCoordMailto} class="link-button">{contactCompanyCoordinatorLabel}</a>
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- SETTINGS MODAL -->
        <template if:true={isSettingsOpen}>
          <section role="dialog" tabindex="-1" class="modal-backdrop" onclick={handleBackdropClick}>
            <div class="settings-modal" onclick={stopModalClick}>
              <div class="modal-header">
                <lightning-icon icon-name="utility:close" alternative-text="Close" size="x-small"
                  onclick={closeSettingsModal} class="close-icon"></lightning-icon>
              </div>
              <div class="modal-body">
                <h2 style="text-align: center;">BestPrep's Mentor Portal Settings</h2>
                <div class="mentor-info">
                  <p><strong>Name:</strong> {mentorFullName}</p>
                  <p><strong>Company:</strong> {assignedCompany}</p>
                  <p><strong>Email:</strong> {connectionData.Mentor_Email__c}</p>
                </div>

                <!-- Track Selection -->
                <template if:true={isCloudCoach}>
                  <h3 style="text-align: center; margin-top: 1.5rem;">Select Student Track</h3>
                  <div class="track-toggle-row">
                    <lightning-button label="Support Track" variant={supportTrackVariant}
                      onclick={selectSupportTrack}></lightning-button>
                    <lightning-button label="Track 1" variant={track1Variant} onclick={selectTrack1}></lightning-button>
                    <lightning-button label="Track 2" variant={track2Variant} onclick={selectTrack2}></lightning-button>
                    <lightning-button label="Track 3" variant={track3Variant} onclick={selectTrack3}></lightning-button>
                  </div>
                  <div class="track-description">
                    <p>{trackDescription}</p>
                  </div>
                </template>

                <!-- Week Availability -->
                <h3 style="text-align: center; margin-top: 1.5rem;">Set Out of Office</h3>
                <div class="weeks-container two-column">
                  <div class="week-column">
                    <template for:each={weekListLeft} for:item="week">
                      <div key={week.label} class="week-option">
                        <lightning-input type="checkbox" label={week.label} name={week.name} checked={week.checked}
                          onchange={handleWeekToggle}></lightning-input>
                      </div>
                    </template>
                  </div>
                  <div class="week-column">
                    <template for:each={weekListRight} for:item="week">
                      <div key={week.label} class="week-option">
                        <lightning-input type="checkbox" label={week.label} name={week.name} checked={week.checked}
                          onchange={handleWeekToggle}></lightning-input>
                      </div>
                    </template>
                  </div>
                </div>

                <div class="modal-footer">
                  <lightning-button variant="brand" label="Update Settings"
                    onclick={handleUpdateSettings}></lightning-button>
                  <lightning-button variant="neutral" label="Report an Error"
                    onclick={handleReportError}></lightning-button>
                </div>
                <div class="modal-status">
                  <p class="error">{modalStatusMsg}</p>
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- Sidebar Week Selection -->
        <div class="sidebar">
          <template for:each={weekOptions} for:item="opt">
            <div key={opt.value} data-week={opt.value} onclick={handleWeekClick} class={opt.cssClass}>
              {opt.label}
              <template if:true={opt.isOverdue}>
                <lightning-icon icon-name="utility:warning" alternative-text="Overdue" variant="warning" size="xx-small"
                  class="slds-m-left_xx-small"></lightning-icon>
              </template>
            </div>
          </template>
        </div>

        <!-- Main Portal Content -->
        <div class="main">
          <!-- VAF Mode -->
          <template if:true={isVAF}>
            <h2>BestPrep Volunteer Agreement Form</h2>
            <p>This form must be completed once per school year...</p>

            <p><strong>Name:</strong> {mentorFullName}</p>
            <p><strong>Company:</strong> {assignedCompany}</p>
            <p><strong>Email:</strong> {connectionData.Mentor_Email__c}</p>

            <div class="form-section">
              <label>Pronouns (select all that apply):</label>
              <lightning-checkbox-group name="pronouns" options={pronounOptions} value={vafForm.pronouns}
                onchange={handleCheckboxChange}></lightning-checkbox-group>
            </div>

            <div class="form-section">
              <lightning-combobox name="ethnicity" label="Ethnicity" value={vafForm.ethnicity}
                options={ethnicityOptions} onchange={handleCheckboxChange}></lightning-combobox>
            </div>

            <div class="form-section">
              <p>BestPrep requires all volunteers to...</p>
              <a href="https://bestprep2018.wpenginepowered.com/wp-content/uploads/2023/10/BestPrep-Belief-Statements.pdf"
                target="_blank">Belief Statements</a><br>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/EDA0RFlhW6Q" frameborder="0"
                allowfullscreen></iframe>
            </div>

            <div class="form-section">
              <template for:each={vafCheckboxes} for:item="item">
                <lightning-input key={item.name} type="checkbox" name={item.name} label={item.label}
                  onchange={handleCheckboxChange}></lightning-input>
              </template>
            </div>

            <div class="form-actions">
              <lightning-button variant="brand" label="Submit" onclick={handleVafSubmit}></lightning-button>
            </div>

            <p class="error">{statusMsg}</p>
          </template>

          <!-- Survey Mode -->
          <template if:true={isSurveyWeek}>
            <h2>Survey</h2>
            <p>Survey content goes here.</p>
          </template>

          <!-- Weekly Message -->
          <template if:false={isVAF}>
            <template if:false={isSurveyWeek}>
              <div class="week-header">
                <h2>{selectedWeek} - this message is assigned for {currentGuidingQuestion.dueDate}</h2>
                <h3>{currentGuidingQuestion.title}</h3>
                <p>{currentGuidingQuestion.talkingPoints}</p>
                <p>
                  Your student's name is <strong>{studentFamiliarName}</strong> at <strong>{assignedSchool}</strong>.
                  Please contact your BestPrep Coordinator if you have questions.
                </p>
              </div>

              <div class="messages-container">
                <!-- Message Left -->
                <div class="message-left">
                  <h4>{leftMessageLabel} Message</h4>
                  <!-- Cloud Coach Left -->
                  <template if:true={isCloudCoach}>
                    <template if:true={mentorMessage}>
                      <template if:true={mentorMessageNeedsReview}>
                        <p class="info">This message is pending manual review.</p>
                      </template>
                      <template if:true={mentorFileLink}>
                        <template if:true={isMentorFileProcessing}>
                          <p><lightning-icon icon-name="utility:spinner" size="xx-small"></lightning-icon> Attachment
                            Processing...</p>
                        </template>
                        <template if:false={isMentorFileProcessing}>
                          <p><a href={mentorFileLink} target="_blank">View Attachment</a></p>
                        </template>
                      </template>
                      <div class="msg-box" lwc:dom="manual" data-id="mentorMsg"></div>
                    </template>
                    <template if:false={mentorMessage}>
                      <template if:true={mentorCanWrite}>
                        <template if:true={attachmentEnabled}>
                          <label class="slds-form-element__label">Attach a PDF file</label>
                          <input type="file" accept="application/pdf" onchange={handleFileChange} />
                        </template>
                        <lightning-textarea value={messageBody} label=" " variant="label-hidden"
                          onchange={handleChange}></lightning-textarea><br>
                        <lightning-button variant="brand" label="Submit" onclick={handleSubmit}></lightning-button>
                      </template>
                      <template if:false={mentorCanWrite}>
                        <p class="info">You can submit a message if your student hasn't written by
                          {mentorCanWriteDateText}.</p>
                      </template>
                    </template>
                  </template>

                  <!-- eMentors Left -->
                  <template if:false={isCloudCoach}>
                    <div class="msg-box">
                      <template if:true={studentFileLink}>
                        <p><a href={studentFileLink} target="_blank">View Attachment</a></p>
                      </template>
                      <lightning-formatted-rich-text value={studentMessage}></lightning-formatted-rich-text>
                    </div>
                  </template>
                </div>

                <!-- Message Right -->
                <div class="message-right">
                  <h4>{rightMessageLabel} Message</h4>

                  <!-- eMentors Right -->
                  <template if:false={isCloudCoach}>
                    <template if:true={mentorMessage}>
                      <template if:true={mentorMessageNeedsReview}>
                        <p class="info">This message is pending manual review.</p>
                      </template>
                      <template if:true={mentorFileLink}>
                        <template if:true={isMentorFileProcessing}>
                          <p><lightning-icon icon-name="utility:spinner" size="xx-small"></lightning-icon> Attachment
                            Processing...</p>
                        </template>
                        <template if:false={isMentorFileProcessing}>
                          <p><a href={mentorFileLink} target="_blank">View Attachment</a></p>
                        </template>
                      </template>
                      <div class="msg-box" lwc:dom="manual" data-id="mentorMsg"></div>
                    </template>
                    <template if:false={mentorMessage}>
                      <template if:true={mentorCanWrite}>
                        <template if:true={attachmentEnabled}>
                          <label class="slds-form-element__label">Attach a PDF file</label>
                          <input type="file" accept="application/pdf" class="slds-input" onchange={handleFileChange} />
                        </template>
                        <lightning-textarea value={messageBody} label=" " variant="label-hidden"
                          onchange={handleChange}></lightning-textarea><br>
                        <lightning-button variant="brand" label="Submit" onclick={handleSubmit}></lightning-button>
                      </template>
                      <template if:false={mentorCanWrite}>
                        <p class="info">You can submit a message if your student hasn't written by
                          {mentorCanWriteDateText}.</p>
                      </template>
                    </template>
                  </template>

                  <!-- Cloud Coach Right -->
                  <template if:true={isCloudCoach}>
                    <template if:true={studentFileLink}>
                      <p><a href={studentFileLink} target="_blank">View Attachment</a></p>
                    </template>
                    <div class="msg-box">
                      <lightning-formatted-rich-text value={studentMessage}></lightning-formatted-rich-text>
                    </div>
                  </template>

                  <p class="error">{statusMsg}</p>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
```

## mentorPortal.css

```css
:host {
  display: block;
  font-family: "Segoe UI", Tahoma, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  min-height: 100vh;
}

.container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.sidebar {
  width: 12%;
  background-color: #fff;
  padding: 0.5rem;
  border-right: 1px solid #e0e0e0;
}

.sidebar-item {
  margin: 0.25rem 0;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #333;
}

.sidebar-item:hover {
  background-color: #f0f0f0;
}

.sidebar-item.active-week {
  background-color: #0070d2;
  color: #fff;
  font-weight: bold;
}

.sidebar-item.disabled {
  color: #aaa;
  cursor: default;
}

.main {
  width: 88%;
  padding: 2rem;
}

.week-header h2 {
  margin-bottom: 0.25rem;
}

.week-header h3 {
  margin: 0.5rem 0 0.25rem;
}

.week-header p {
  margin: 0 0 1rem;
}

.messages-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.message-left,
.message-right {
  flex: 1;
  min-width: 300px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1.5rem;

}

.msg-box {
  white-space: pre-wrap;
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 6px;
  min-height: 120px;
}

.form-section {
  margin: 1.5rem 0;
}

.form-actions {
  margin-top: 2rem;
}

lightning-textarea,
lightning-checkbox-group,
lightning-combobox,
lightning-input {
  margin-top: 0.5rem;
  width: 100%;
}

lightning-button {
  margin-top: 1rem;
}

.error {
  color: #d32f2f;
  font-size: 1rem;
  padding: 1rem 0;
  text-align: center;
}

.info {
  margin-top: 1rem;
  font-style: italic;
  color: #666;
}

.spinner-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === BUTTON GROUP === */
.button-group-top {
  position: fixed;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 999;
}

.button-group-top .info-button,
.button-group-top .settings-button {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
}

/* === BACKDROP & SHARED MODAL BASE === */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 90%;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;
}

@media screen and (min-width: 768px) {
  .settings-modal {
    max-width: 50%;
  }
}

.modal-header {
  display: flex;
  justify-content: flex-end;
}

.close-icon {
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-status {
  text-align: center;
  margin-top: 1rem;
}

/* === INFO MODAL SPECIFIC === */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.info-box {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
  height: 100%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* === SETTINGS MODAL SPECIFIC === */
.modal-body {
  text-align: center;
  padding: 1rem;
}

.mentor-info {
  margin: 1rem auto;
  text-align: left;
  max-width: 400px;
}

.weeks-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin: 1rem auto;
  max-width: 600px;
}

.weeks-container.two-column {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.week-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.track-toggle-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.track-description {
  text-align: center;
  margin-top: 0.75rem;
  color: #666;
  font-style: italic;
}

.link-button {
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  background-color: #0070d2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
}

.link-button:hover {
  background-color: #005fb2;
}

.easteregg-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 50% dim */
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* disable interaction outside modal */
}

.easteregg-wrapper {
  width: 80vw;
  aspect-ratio: 16 / 9;
  background-color: black;
  border-radius: 16px;
  overflow: hidden;
  border: 8px solid;
  border-image: repeating-linear-gradient(
    45deg,
    red 0px,
    red 10px,
    black 10px,
    black 20px
  ) 8;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto; /* allow interaction inside modal */
}

.easteregg-svg {
  width: 100%;
  height: 100%;
  display: block;
}
```