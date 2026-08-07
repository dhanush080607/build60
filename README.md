# Momentum Builder

================================================

FUNCTIONAL REQUIREMENTS:

This must be a fully working interactive application, not a static prototype.

Every feature shown in the UI must work.

================================================

APPLICATION STATE:

Use React state management.

Use localStorage for persistence.

The user should not lose progress after refreshing.

================================================

ROUTING:

Implement working routes:

/

Landing page

/dashboard

Student dashboard

/day/12

Challenge day page

Navigation between pages must work correctly.

================================================

LANDING PAGE FUNCTIONALITY:

Start My Challenge button:

When clicked:

Navigate to /dashboard

Explore Tracks button:

Scroll smoothly to challenge tracks section.

Track cards:

Should have hover and click interactions.

When clicked:

Show selected track state.

AI Coding Coach:

Create an interactive floating assistant.

When clicked:

Open a chat-style popup.

Show sample AI responses:

"Your streak is strong. Complete today's commit to stay ahead."

"Your next goal should be deploying your project."

================================================

DASHBOARD FUNCTIONALITY:

Profile data:

Load from mock JSON.

Streak system:

Create dynamic streak calculation.

States:

New user:

streak = 0

Show:

"Your first commit starts your journey."

Active user:

Show current streak.

Missed day:

Show recovery message.

================================================

TODAY TASK:

Start Building button:

Navigate to:

/day/12

Submit Proof button:

Navigate to challenge submission section.

================================================

PROGRESS TRACKER:

Create interactive 60 day tracker.

Completed days:

User can click completed days.

Current day:

Animated.

Future days:

Locked.

When a day is completed:

Update:

- Completion percentage

- Momentum score

- Badge progress

Save changes in localStorage.

================================================

MOMENTUM SCORE:

Make it dynamic.

Calculate based on:

GitHub submission completed:

+40 points

LinkedIn submission completed:

+30 points

Daily checklist completed:

+20 points

Reflection completed:

+10 points

Maximum:

100 points

Animate score changes.

================================================

ACHIEVEMENT SYSTEM:

Create working badges.

Examples:

First Commit:

Unlocked after first submission.

7 Day Warrior:

Unlocked after 7 completed days.

Project Builder:

Unlocked after completing a project.

Locked badges should show progress.

================================================

CHALLENGE DAY PAGE:

Task checklist:

Each checkbox must work.

When checked:

- Update progress

- Animate completion

- Save state

================================================

GITHUB SUBMISSION:

Create form:

Repository URL

Commit URL

Validation:

Empty:

Show error message.

Invalid URL:

Show validation error.

Valid:

Show:

"GitHub proof verified ✓"

================================================

LINKEDIN SUBMISSION:

Create form:

LinkedIn Post URL

Validation:

Empty:

Show error.

Valid:

Show:

"LinkedIn proof verified ✓"

================================================

DAY COMPLETION:

Create:

"Complete Day 12"

button.

Only enable when:

✓ Checklist completed

✓ GitHub proof added

✓ LinkedIn proof added

✓ Reflection completed

When completed:

Show celebration animation.

Update:

Day progress

Streak

Momentum score

Achievements

================================================

REFLECTION JOURNAL:

Create working text inputs:

"What did you learn today?"

"What challenge did you overcome?"

Save responses locally.

Show previous reflections as timeline cards.

================================================

MOCK DATA:

Create realistic JSON:

student.json

challenge.json

achievements.json

Use this data throughout the application.

================================================

ERROR HANDLING:

Handle:

Empty profile

No streak

Missed day

Incomplete submission

Invalid URLs

Loading states

================================================

QUALITY REQUIREMENTS:

The final application should behave like a real SaaS product.

No dead buttons.

No fake interactions.

No placeholder actions.

All UI elements must have functionality.

Before finishing:

Test every route:

/

dashboard

/day/12

Test:

Buttons

Forms

Navigation

State updates

Local storage

Deliver a complete working hackathon-ready application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://build60.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/722bd680-9884-47f1-b232-61a25a477314).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
