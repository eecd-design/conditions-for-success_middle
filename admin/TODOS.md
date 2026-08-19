# TODOS

## Types

### 🚨 Fix

_Correcting broken or malfunctioning code. Includes regressions, bugs, security vulnerabilities, or errors that block users or developers._

#### Phase 2

- Double check if there are any comma separated misses in the css nesting refactors
- Report vibrancy data attrs not being paired properly with data-theme
- Closing assessment not working if you click skip
- Mark Complete and Open button wrapping
    - Maybe this step should be revised, so that if you click open it opens a confirmation dialog Are you sure you want to make this assesment complete?
    - Alternatively, in the manage assessment dialog, there is a view report button that is only available when the assessment is complete (could be there and disabled, hovering or clicking with send a toast)
- Open assessment button change label to 'Manage'

#### Backburner

- Should callout headings be 1.375rem? We don't have a font-size variable for that.
- Email protected issue.

---

### 🧱 Core

_Implementing or maintaining functionality and design required for all users to access the website’s essential information and complete critical actions. Without this, the product fails its basic purpose._

- Update Continuum Version
- Continuum Version - Data Updater
- Add training and support to site search? Yes! Both
- Add tooltips to icon buttons inside of dialogs and report toolbar
- Add numbers to the indicator nav links

---

### ✨ Enhancements

_Adding or refining features or design that improve the user experience but are not strictly required for users to access core information or complete critical actions._

#### Phase 2

- Download Dialog on the Report page. Shows both file options with explanatory text as to when to use which.
- Dialog on reopenin of assessment
    - Clarify the language (include active assessment year);
- Search -> Media Dialog -> Search, is there a way to resume position as well?

#### Backburner

- (A11y) Provide high contrast setting to convert subtle backgrounds to bold or outline.
- (A11y) Provide accessible font setting to convert serif fonts to sans-serif and all caps to title cap (Reflection Question Heading, Currently Chart Label)
- (UX) Create a simple landing page at middle.nbed.ca that links off to the Conditions for Success website
- (UX) Create a custom 404 page that includes a link to the to the middle.nbed.ca
- (UX) Investigate more robust file validation on assessment imports for detailed failure toasts (or even an error line under the button like we do for inputs)
- (Visual) Investigate the use of Astro's transition persist
- (Visual) Set up smooth transitions for accordions and tabs (use UDL as a template)
- (UX) Create a (...) button the assessment toolbar to enable assessment mode on smaller devices

### ⚙️ Optimization

_Improving non-functional aspects of the codebase or product, such as performance, maintainability, consistency, documentation, and developer workflow. These tasks improve longevity and efficiency but don’t change user-visible features directly._

#### Phase 2

- Report generation, get the base64 for the fonts once and cache it on init

#### Backburner

- TODO (Performance): Consolidate multiple consecutive 'set' calls into 'setUserData'
- TODO (Consistency): Move css restrictions styles into relevant areas?
- Create a list control module and move individual modules inside of it.
- Make use of the \_options method in list control for other modules to store options and controls.
- Convert setAttributes to dataset. Better performance.
- Convert all css declaration into nesting

---

High Priority

- Review and adjust the self-assessment/report workflow, including:
    - Investigate whether the "Report" nav link should be removed (toolbar-only access)
    - Provide guidance on who owns a report and how ownership transfers
    - Should the active assessment be the same as the active report
    - Hide duplicate option and view report from manage assessment dialog on report page
    - Should we remove the create button on report page? Yes!
    - Should the complete status dialog then offer a link to the report page "Your report is ready, view it!"
    - Change the title of manage assessment on the report page
- Investigate coded URL saves for streamlined collaboration
- Clarify where the report code is located and how it's used
- Review and adjust the iconography of the assessment toolbar (Download/Share buttons, Report button or section)
- Investigate whether to restrict the "Save" function to a single method (file or code)
- Change "Change Status" dialog language to clarify a completed assessment can be reopened
- Clarify how multiple assessors can contribute to the same assessment
- Explore a clearer "Share" flow between users
- Change the "Add Assessor" dialog language to clarify purpose and limitations

Medium-High Priority

- Investigate preserving Big Seven navigation on smaller screens (drawer vs. combined nav)
- Change the Search dialog language to clarify resources are also searchable
- Add a "Glossary" dialog and paired link style for definitions
- Dedicated Change History dialog and launch button? (would require a two row toolbar)

Medium Priority

- Investigate opening resources in their own tab (all resources vs. non-video only)
- Include screen-reader language indicating a new tab/window will open

---

2026-08-18

## Required

- Assessment Save Data Continuum Conversion (1.0 -> 2.0)
- Continuum CMS Changes (Component reordering)
- Create Continuum v2.0 Change Log Page

## High Priority

- Add Numbers to the Indicator Page Links
- Add Training to Search Dialog
- Rename ASD-X to Test District
- Move Summary Charts to Front of Report
- Preserve Big Seven navigation on small screens (combine with on page nav)

- Report Workflow Redesign
    - Review Assessment Toolbar Iconography
    - Preserve Assessment Toolbar on Report Page (conditionally showing appropriate buttons)
    - Create a Download Dialog for the Report Page (including explanatory text on which filetype to download)
    - Merge Active Assessment and Active Report Assessment

## Medium Priority

- Open pdfs, images, and external websites in new tabs (including screen reader text)

- Collaboration Workflow Redesign
    - Restrict save function to one type?
    - Instructional language on How Multiple Assessors Contribute to the Same Assessment

- URL Sharing instead of Code/File

- Update Language for UX Clarity
    - Change Status Dialog
    - Add assessor clarify purpose and limitations
    - Search dialog, clarify that resources/training are searchable as well
    - Switching assessment from complete to in progress, draw attention to the reporting year and ask whether they want to duplicate instead

## Low Priority

- Create a Glossary popup for glossary term definitions
- Add a new chart to the report that shows how many components out of 30 are in each phase (possibly a stacked bar chart?)
- Investigate returning user to exact list position in search dialog after closing a media dialog
