# GoSplit — Trip Planning and Expense Sharing MVP Requirements

## Overview

GoSplit (Vietnamese name: Góp Gạo) is an online application for planning trips and tracking shared expenses. A plan contains a trip itinerary, participants, expenses, and a trip summary. It supports account-owned plans and plans that can be viewed without an account. Plans are available across devices.

The MVP does not include AI or LLM-powered analysis. Community restaurant guides are planned after the MVP.

## Scope

### In scope

- Create, list, view, edit, and delete trip plans.
- Keep trip information for account-owned plans so the account owner can return to it.
- Allow a plan to be viewed by people who have its shareable plan link, without requiring sign-in or a passcode.
- Protect editing with a 6-digit passcode. Anyone with the passcode can edit the plan; no email invitations are needed. The passcode is for editing, not viewing.
- Let the account owner of an account-owned plan edit without the passcode. Only the account owner can delete an account-owned plan; a plan without an account can be deleted by anyone with its passcode.
- Allow only one person to edit a plan at a time.
- Add the account owner as a participant automatically when an account-owned plan is created.
- Ask "Who are you?" the first time someone edits a plan on a device, so the app knows which participant is using that device.
- Lock passcode entry after repeated wrong attempts, and let the plan's recovery email unlock it.
- Let a plan without an account have an optional recovery email. The passcode can be changed through a link sent to the recovery email.
- Support online storage and viewing/editing from multiple devices.
- Manage trip participants, itinerary activities, and expenses.
- Record where the group stays, with dates for each stay. A trip can have several stays when it covers several places.
- Keep a food list for each trip day, grouped into breakfast, lunch, afternoon and dinner.
- Assign an expense to an itinerary activity or its corresponding date and time.
- Split an expense among selected participants using editable ratio weights.
- Show a trip summary, including paid/spent amounts, trip total, amounts participants need to contribute, and optional contribution installments (for example, first and second installments).
- Let users with edit access mark a participant as having paid.
- Share a link that opens the trip summary, and export the summary as an image.
- Support Vietnamese and English. The app is called Góp Gạo in Vietnamese and GoSplit in English.
- Let the user choose a theme for each plan when creating it. Themes include illustrations, and everyone who views the plan sees the same theme.
- Let users with edit access replace the theme illustration with their own photo.
- Work in phone and desktop browsers, and let users install the app on their phone's home screen.
- Automatically delete plans created without an account 30 days after their last update.

### Out of scope

- AI or LLM integration.
- Multiple currencies within one plan or currency conversion.
- Payment processing or transferring money.
- Detailed debt/settlement tracking between participants. The MVP records an authorized confirmation that a participant has paid; it does not track a payment transaction between two participants.
- Map rendering or in-app navigation. Itinerary activities can store a map link.
- Real-time collaborative editing (several people editing the same plan at the same time).
- A per-user light/dark mode setting. The look of a plan comes from its theme.
- Automatic moderation of uploaded photos.
- Exporting the summary in formats other than an image (for example, PDF or spreadsheet), unless added as a later requirement.

### Planned after the MVP

- Community restaurant guides, without AI: signed-in users, mainly locals, publish a guide for an area that lists dishes together with the restaurant name and a map link to the restaurant. Anyone can search guides by destination; users with edit access can apply a whole guide or selected entries to their plan's food list. Guides can be marked as helpful or reported; a guide reported by several people is hidden until it is reviewed. Restaurant suggestions have their own section in the app, next to the plans.
- Linking food items to expenses.

Feature plan (in Vietnamese): [food-suggestions.md](food-suggestions.md).

## Data Fields

Field names below are conceptual and may be adapted to the implementation.

### Trip plan

- `planId`: unique plan identifier; a randomly generated 10-digit numeric string (for example, `0041234567`). Stored as text so leading zeros are kept and the length can grow later.
- `name`: plan name.
- `location`: trip destination; for a trip that covers several places, a short summary such as `Đà Lạt – Nha Trang`.
- `startDate`: trip start date.
- `endDate`: trip end date.
- `notes`: optional plan notes.
- `currencyUnit`: one user-entered currency unit for the plan; defaults to `$`.
- `theme`: the plan's theme, chosen when the plan is created; defaults to Gạo ấm (Warm Rice).
- `coverImage`: optional photo uploaded to replace the theme illustration, with the part of the photo chosen to be shown.
- `createdAt`: creation date and time.
- `updatedAt`: most recent update date and time; used for the 30-day expiry of plans without an account.
- `ownerType`: account-owned plan or plan without an account.
- `ownerId`: account owner identifier when account-owned.
- `ownerParticipantId`: participant created automatically for the account owner when an account-owned plan is created.
- `editPasscode`: 6-digit passcode for editing, chosen by the user when creating the plan. It is stored as a protected credential and must not be exposed to viewers.
- `recoveryEmail`: optional email used to unlock passcode entry and to request passcode changes. For account-owned plans, the account email is used. It must not be exposed to viewers.
- `roundingRecipientParticipantId`: participant who receives the rounding remainder. For a plan without an account, empty means the default (the participant who has paid the most).
- `passcodeLock`: number of consecutive wrong passcode attempts and the time until which passcode entry is locked.
- `editLock`: who currently holds the plan's edit lock and when it expires.

### Participant

- `participantId`: unique participant identifier.
- `displayName`: participant name.
- `status`: active or left the plan.
- `hasPaid`: whether a user with edit access has confirmed the participant paid.
- `paymentInstallments`: optional contribution installment records, such as installment number, amount, and paid status.

### Itinerary activity

- `activityId`: unique activity identifier.
- `name`: activity name.
- `dateTime`: activity date and time.
- `location`: activity location name.
- `mapLink`: optional map URL.
- `notes`: optional activity notes.
- `order`: position in the day's itinerary.

### Stay

- `stayId`: unique stay identifier.
- `name`: where the group stays, such as a homestay or hotel name.
- `area`: city or area, such as `Đà Lạt` or `Kyoto`.
- `country`: country code (ISO 3166-1), such as `VN` or `JP`; shown by name in the user's language.
- `address`: optional address.
- `mapLink`: optional map URL.
- `checkInDate`: date of the first night.
- `checkOutDate`: date the group leaves.

### Food item

- `foodItemId`: unique food item identifier.
- `date`: trip day.
- `mealSlot`: breakfast, lunch, afternoon, or dinner.
- `dishName`: dish or food to try.
- `placeName`: optional place to eat it.
- `mapLink`: optional map URL.
- `notes`: optional notes.
- `order`: position within the meal slot.

### Expense

- `expenseId`: unique expense identifier.
- `description`: expense title or description.
- `amount`: positive amount, entered to a maximum of three decimal places.
- `paidByParticipantId`: participant who paid; defaults to the person creating the expense and can be changed using a selector.
- `dateTime`: expense date and time.
- `notes`: optional expense notes.
- `activityId`: optional linked itinerary activity.
- `shares`: selected participants and their ratio weights.
- `hasLeftParticipantWarning`: derived warning when a participant in the expense has left the plan.

## Business Rules

1. A plan has exactly one currency unit. The unit is entered by the user and defaults to `$`. Different currency units cannot be combined in one plan.
2. A plan cannot be saved if its end date is earlier than its start date. Users may edit the dates, but the invalid range must be corrected before saving.
3. A plan can be viewed through its shareable link without authentication or a passcode.
4. `planId` is a randomly generated 10-digit number, not a sequential one. If a generated ID already exists, a new one is generated.
5. Every plan has a 6-digit edit passcode chosen by the user when the plan is created. Anyone with a valid passcode can edit the plan. The passcode is not required to view it.
6. If the chosen passcode is easy to guess (for example, `123456`, `000000`, or `111111`), the app shows a warning but still accepts it.
7. For an account-owned plan, the account owner can edit without entering the passcode and is the only person who can delete the plan. For a plan without an account, anyone with the passcode can delete it.
8. Only one person can edit a plan at a time. The first person to open edit mode holds the plan's edit lock; others see the plan as read-only with a message that it is being edited. The lock is released when the editor leaves edit mode or after 5 minutes of inactivity. A save made after the editor's lock has expired is rejected instead of silently overwriting other changes.
9. After 5 consecutive wrong passcode attempts, passcode entry for the plan is locked for 12 hours. The system sends one email per lock to the plan's recovery email with an unlock link; opening the link removes the lock immediately. Without a recovery email, the lock lasts the full 12 hours. Devices that already have edit access are not affected by the lock.
10. When creating a plan without an account, the user may enter a recovery email. If the plan has no recovery email, a user with edit access can add one later; once confirmed, it cannot be changed. The address must be confirmed through a link sent to it before it can be used for unlocking or passcode changes. For account-owned plans, the account email is used.
11. To change the passcode, a user enters the plan's recovery email. If it matches the confirmed recovery email (or the account email for an account-owned plan), the system sends a single-use link that is valid for 1 hour; opening the link lets the user set a new passcode. The app shows the same message whether or not the email matches, so the recovery email is not revealed. A plan without a recovery email cannot have its passcode changed or recovered. After a change, devices using the old passcode lose edit access, and any passcode-entry lock is removed.
12. A participant can be selected for new expenses only while active in the plan.
13. Participants with historical expenses must not be physically deleted. A user with edit access can mark them as having left the plan. Their historical expense records remain intact.
14. An expense must belong to one plan, have a positive amount, have one payer, and include at least one participant share.
15. The payer defaults to the person creating the expense (see rules 26 and 27). The payer may be changed and does not have to be included among the participants sharing the expense.
16. Expense shares are allocated by ratio. The default ratio for each selected participant is `1`; users can change it. A ratio must be greater than zero.
17. A participant's unrounded share is calculated as `expense amount × participant ratio / sum of selected participant ratios`.
18. Entered expense amounts support up to three digits after the decimal separator. Calculations retain precision and are rounded only when producing the final result.
19. Final amounts are rounded up to the next whole currency unit (for example, `52.3333` becomes `53`). For an account-owned plan, the account owner's participant receives the rounding remainder (rule 26). For a plan without an account, the participant who has paid the most for trip expenses receives it by default; users with edit access can choose a different participant. If several participants have paid the same highest amount, the one added to the plan first receives it. The remainder is not tracked as a separate amount or transaction.
20. The system recalculates expense shares, paid/spent totals, and contribution results when an expense is created, edited, or deleted.
21. If an expense includes a participant who later leaves the plan, the expense remains unchanged and displays a warning to users with edit access. Editing such an expense requires a separate, confirmed action and recalculates the affected shares.
22. Deleting a plan requires confirmation because it removes the plan and its associated itinerary, participants, and expenses.
23. A user with edit access can mark a participant as paid. This confirmation is separate from an expense and must not be counted as trip spending.
24. Plans created without an account expire and are deleted 30 days after their last update.
25. An expense may be linked to an itinerary activity. Its date and time can be shown with the corresponding itinerary entry.
26. When an account-owned plan is created, the account owner is automatically added as a participant. On the owner's signed-in devices, the app uses this participant without asking.
27. The first time someone edits a plan on a device, the app asks "Who are you?" and the user picks their name from the active participants. The choice is saved on that device and can be changed later. It is used as the default payer for new expenses. The user may skip the question (for example, an organizer who is not travelling); without a selection, the payer must be chosen for each expense.
28. The interface is available in Vietnamese and English. On first use, the app follows the browser language, and uses English for any other language. Users can switch language at any time; the choice is saved on the device and, when signed in, on the account. Shared plan links do not include the language, so each viewer sees the plan in their own language. Dates and numbers are formatted for the selected language; the plan's currency unit does not change. Emails are sent in the language the user is using when the email is requested.
29. Each plan has a theme, chosen when the plan is created (default: Gạo ấm). A theme sets the plan's colors and illustrations. Everyone who opens the plan sees it in that theme, and users with edit access can change the theme later. Screens that do not belong to a specific plan, such as the plan list, use the default theme. The exported summary image and the link preview use the plan's theme.
30. Users with edit access can replace the theme illustration with their own photo (JPG, PNG, WebP or HEIC, up to 10 MB). The app resizes and compresses the photo, removes location and other metadata, and lets the user choose which part of the photo is shown. The theme's colors stay the same. The photo stays when the theme is changed, and users with edit access can remove it to return to the theme illustration. Everyone who can view the plan can see the photo; the app reminds the uploader of this. The photo is deleted together with the plan. When a plan has a photo, the exported summary image and the link preview use it.
31. A plan can have one or more stays. Each stay's check-in and check-out dates must be within the plan dates, and the check-out date must be after the check-in date. Stays cannot overlap, except that one stay's check-out date may be the next stay's check-in date. Nights without a stay are allowed, for example an overnight bus.
32. For each trip day, the app shows where the group stays that night. On a day when the group moves, it shows both the stay they leave and the stay they arrive at. The itinerary and the food list show this for each day. This per-day area and country will later be used to suggest community restaurant guides for that area.
33. Each trip day has a food list grouped into four meal slots: breakfast, lunch, afternoon and dinner. Users with edit access can add, edit, reorder and delete food items; anyone who can view the plan can see the list. A food item needs a dish name; the place, map link and notes are optional. Food items are not linked to expenses in the MVP.

## Acceptance Criteria

### Plans and access

- A user can create, list, view, edit, and delete plans.
- A plan stores its name, location, start/end dates, notes, currency unit, and timestamps.
- A new plan receives a random 10-digit plan ID.
- A plan with an end date before its start date cannot be saved; the user receives a clear validation message.
- A viewer can open a shared plan without signing in or entering a passcode.
- A user without the correct passcode cannot edit a plan, unless they are the account owner of an account-owned plan.
- A valid passcode permits editing any plan and deleting a plan without an account.
- Only the account owner can delete an account-owned plan.
- An easy-to-guess passcode is accepted with a warning.
- After 5 consecutive wrong passcode attempts, passcode entry is locked for 12 hours and an unlock email is sent to the recovery email; the unlock link removes the lock immediately.
- The passcode and recovery email are never shown to viewers.
- A recovery email can be added later if the plan has none, and cannot be changed once confirmed.
- A user can change the passcode through a link sent to the confirmed recovery email. After the change, devices using the old passcode lose edit access.
- While one person is editing a plan, others see it as read-only with a message that it is being edited.
- The edit lock is released when the editor leaves edit mode or after 5 minutes of inactivity.
- Account-owned plans can be opened from multiple devices by the account owner.
- Updates made on one device are available on other devices.
- A plan deletion requires explicit confirmation.
- A plan without an account is eligible for deletion 30 days after its last update.

### Participants and permissions

- A user with edit access can add participants and update their display names.
- When an account-owned plan is created, the account owner appears in the participant list.
- The first time a user edits a plan on a device, the app asks them to choose who they are from the active participants; the choice is remembered on that device and can be changed or skipped.
- New expenses use the participant selected on the device as the default payer.
- A participant who has historical expenses can be marked as having left the plan without removing their historical records.
- A participant who has left the plan is unavailable for new expense shares.
- Expenses containing a participant who has left the plan display a warning to users with edit access.
- Only users with edit access can confirm that a participant has paid.
- Payment confirmations do not increase trip spending or expense totals.

### Itinerary

- A user can add, edit, and delete itinerary activities.
- An activity can store its name, date/time, location name, optional map link, notes, and order.
- A linked expense can be seen in relation to its itinerary activity or corresponding date/time.

### Stays and food list

- A user with edit access can add, edit and delete stays with a name, area, country, optional address and map link, and check-in/check-out dates.
- A stay that overlaps another stay or falls outside the plan dates cannot be saved; the user receives a clear validation message.
- Each day in the itinerary and the food list shows where the group stays that night, and both stays on a day when the group moves.
- A user with edit access can add, edit, reorder and delete food items for each day and meal slot (breakfast, lunch, afternoon, dinner).
- Anyone who can view the plan can see the food list without a passcode.

### Expenses and summary

- A user can add, edit, and delete an expense with a description, positive amount, payer, date/time, and at least one selected participant.
- The payer defaults to the expense creator and can be changed to another participant; the payer need not share the expense.
- Each selected participant starts with ratio `1`; users can enter another positive ratio.
- The system distributes an expense proportionally to the selected ratios and preserves calculation precision until the final result.
- Entered amounts with more than three decimal places or non-positive amounts are rejected with a clear validation message.
- Final displayed contribution results use the agreed upward rounding rule. The rounding remainder goes to the plan creator of an account-owned plan, or by default to the participant who has paid the most in a plan without an account, without a separate remainder record.
- Editing or deleting an expense updates the related totals and results.
- The trip summary shows amounts paid/spent, total trip expenses, and amounts participants need to contribute.
- The summary can show contribution installments, such as a first and second installment.
- A user with edit access can mark a participant as paid, and the summary reflects that status.
- Users can share a link that opens the trip summary.
- Users can export the trip summary as an image.

### Language and theme

- A user can switch between Vietnamese and English, and the choice is remembered.
- A first-time user sees the app in the browser's language, or in English if the browser language is neither Vietnamese nor English.
- Dates and numbers follow the selected language, and amounts can be entered with that language's decimal separator.
- A user can choose a theme when creating a plan, and users with edit access can change it later.
- Everyone who opens a plan sees it in the plan's theme.
- The exported summary image and the link preview use the plan's theme.
- Text keeps sufficient contrast in every theme, including text placed over illustrations or photos.
- A user with edit access can replace the theme illustration with their own photo, choose which part is shown, and remove the photo again.
- Uploaded photos no longer contain location or other metadata.

## Edge Cases

- A plan's start and end dates are equal.
- The end date is earlier than the start date during an edit.
- A plan has no participants, or an expense has no selected participants.
- An expense has a zero, negative, or more-than-three-decimal amount.
- A ratio is zero, negative, missing, or all selected ratios sum to zero.
- The payer is not included in the expense shares.
- The payer or a selected participant leaves the plan after an expense was created.
- The plan has no participants when the app asks "Who are you?"; the user can add themselves first or skip the question.
- The participant selected on a device later leaves the plan, or the device's browser data is cleared; the app asks "Who are you?" again.
- A user attempts to remove a participant who appears in historical expenses.
- A user edits an expense that includes a participant who has left the plan.
- Two people try to edit the same plan at nearly the same time; only one gets the edit lock and the other sees the plan as read-only.
- The editor closes the tab or loses connection without leaving edit mode; the edit lock is released after the inactivity timeout.
- The editor's lock expires while they still have unsaved changes; the save is rejected with a clear message instead of silently overwriting newer changes.
- A calculated share or final contribution contains a fractional currency unit and must follow the final-rounding rule.
- Several participants have paid the same highest amount, or no one has paid anything yet, when choosing the default rounding remainder recipient.
- A plan is viewed without a passcode, or a user without edit access attempts to edit or delete it.
- Someone deliberately enters wrong passcodes to lock a plan. Devices that already have edit access keep working, and the recovery email can unlock it.
- Passcode entry is locked again soon after being unlocked; the system must not send unlimited emails (at most one email per lock).
- An unlock link is opened after the lock has already ended or after the link was already used.
- A plan has no recovery email and passcode entry is locked; the lock lasts the full 12 hours.
- The passcode is lost. The user changes it through the recovery email link. Without a recovery email, the passcode cannot be recovered.
- A passcode change is requested with an email that does not match the recovery email; the app shows the same message and sends no email.
- Passcode change links are requested many times in a row; the system limits how many emails are sent.
- A passcode change link is opened after it has expired or has already been used.
- A user with edit access tries to change a confirmed recovery email; the change is not allowed.
- A generated plan ID already exists; a new ID is generated.
- A plan without an account reaches 30 days since its last update. The expiry process must use the plan's last-update timestamp.
- A user confirms a participant payment more than once; the system must avoid duplicate confirmations or make the existing confirmation state clear.
- A trip has expenses but no contribution installments, or installments do not add up to the amount due. The application must distinguish these contribution records from trip expenses.
- A user enters an amount with the other language's decimal separator (for example, `86,5` while using English). The input must be interpreted correctly or rejected with a clear message, never read as a different amount.
- Two people open the same shared plan in different languages; both see the same data, each in their own language.
- A plan uses a theme that was later removed from the app; the plan falls back to the default theme.
- Theme illustrations fail to load or load slowly on a weak connection; the plan stays readable using the theme's colors.
- An uploaded photo is too large, in an unsupported format, or fails to upload; the user sees a clear message and the current image stays.
- A plan with an uploaded photo is deleted or expires; the photo is deleted too.
- A trip covers several places and the group moves on one day; that day shows both stays.
- A night has no stay, for example an overnight bus; the day shows no stay without an error.
- The plan dates are changed so that some stays or food items fall outside the new dates; the user is warned before saving and nothing is deleted silently.
- A meal slot has no food items; it shows an empty state, with an add button for users with edit access.
- The same dish is added to several days or meal slots; this is allowed.
