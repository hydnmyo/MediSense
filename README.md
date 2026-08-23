# MediSense Health Companion

Build a small, clean, modern healthcare web application called:

MEDISENSE

Tagline:

"Understand Your Symptoms. Get Informed."

Subtitle:

"AI Health Reasoning Assistant"

==================================================

PROJECT PURPOSE

==================================================

MediSense is a small undergraduate Artificial Intelligence course project.

The application allows users to:

1. Create an account / log in

2. Enter their symptoms

3. Receive possible health conditions

4. See a symptom-match / likelihood score

5. See which symptoms contributed to each result

6. Receive basic health suggestions

7. Save and review previous assessments

IMPORTANT:

MediSense is NOT a medical diagnosis system.

Use phrases such as:

- Possible Condition

- Symptom Match

- Likelihood Score

- Preliminary Assessment

Never say:

"You have Dengue."

"You are diagnosed with Flu."

The results are for educational and health-awareness purposes only.

==================================================

IMPORTANT PROLOG PROJECT STRUCTURE

==================================================

DO NOT ADD PROLOG TO THE WEBSITE.

Do NOT create:

- Prolog code sections

- Prolog console

- Prolog query interface

- Prolog demo page

- Prolog reasoning visualization

- SWI-Prolog UI

Prolog will be tested separately outside the website using SWI-Prolog.

The project team will create a separate Prolog knowledge base using the same symptom-condition relationships used by MediSense.

Example:

Facts:

fever(patient).

headache(patient).

body_pain(patient).

Rule:

possible_condition(X, dengue) :-

    fever(X),

    headache(X),

    body_pain(X).

Query:

?- possible_condition(patient, dengue).

Result:

true.

This separate SWI-Prolog experiment is for the AI course presentation.

The website itself should remain simple.

==================================================

WEBSITE SIZE / SCOPE

==================================================

Keep the website SMALL and focused.

Do NOT create a large healthcare platform.

Do NOT add:

- Doctor appointment booking

- Hospital finder

- Medical articles

- Chatbot

- Follow-up questions

- Complex user profiles

- Notifications

- Medication management

- Community features

- Payment

- Admin dashboard

- Complicated analytics

The website should have only the essential pages and functions.

==================================================

TECHNOLOGY

==================================================

Use:

- HTML

- CSS

- Minimal JavaScript only where needed for simple interactions

Do not use a complicated technology stack.

For the prototype:

- Login / Signup can use mock frontend behavior.

- History can use mock/demo data or browser local state.

- Prediction results can use predefined prototype logic/data.

==================================================

PAGES

==================================================

Create only these pages:

1. Home

2. About

3. Health Check

4. Results

5. History

6. Login

7. Sign Up

No additional pages are necessary.

==================================================

DESIGN

==================================================

Create a clean healthcare UI.

Color palette:

Primary:

Deep teal / medical green

Secondary:

Soft mint

Background:

White / very light gray

Text:

Dark charcoal

Warning:

Soft amber

Emergency:

Soft red

Keep the colors minimal.

Do NOT use:

- Neon colors

- Rainbow gradients

- Excessive gradients

- Too many colors

- Overly complicated animations

Style:

- Clean

- Minimal

- Professional

- Modern

- Friendly

- Spacious

- Easy to understand

Use rounded cards and subtle shadows.

==================================================

NAVBAR

==================================================

Logo:

MediSense

Navigation:

Home

About

Health Check

History

Right side:

Log In

Sign Up

When logged in:

User name

Logout

Keep the navbar simple.

==================================================

HOME PAGE

==================================================

Hero:

MediSense

"Understand Your Symptoms.

Get Informed."

Supporting text:

"Enter your symptoms and explore possible health conditions with clear explanations and basic health guidance."

Primary button:

"Check My Symptoms"

Secondary button:

"Learn More"

Use a simple healthcare + AI visual.

Do not use a doctor photograph.

==================================================

HOME — FEATURES

==================================================

Show only 3 feature cards:

1. Symptom Analysis

"Enter the symptoms you are currently experiencing."

2. Possible Conditions

"Explore health conditions that may match your symptoms."

3. Health Guidance

"Receive basic suggestions and warning signs to consider."

==================================================

HOME — HOW IT WORKS

==================================================

Create a simple 4-step flow:

01

Enter Symptoms

↓

02

Analyze

↓

03

See Possible Conditions

↓

04

Get Suggestions

Keep this section visually simple.

==================================================

HOME — DISCLAIMER

==================================================

Small disclaimer:

"MediSense provides preliminary health information based on user-provided symptoms. It is not a medical diagnosis and does not replace professional medical advice."

==================================================

ABOUT PAGE

==================================================

Title:

"About MediSense"

Description:

"MediSense is an AI health reasoning assistant created as an undergraduate Artificial Intelligence project. It analyzes user-provided symptoms and identifies possible health conditions using a structured knowledge base."

Create 3 simple sections:

1. What MediSense Does

- Analyzes symptoms

- Identifies possible conditions

- Provides symptom-match scores

- Gives basic health suggestions

2. AI Approach

Explain simply:

"MediSense uses structured facts and rules to represent relationships between symptoms and health conditions. The logical reasoning component is separately tested using SWI-Prolog as part of the AI coursework."

Do NOT show Prolog code.

3. Health Conditions

Explain that the prototype covers a limited number of conditions rather than every disease.

==================================================

HEALTH CONDITIONS

==================================================

Use a controlled knowledge base.

COMMON CONDITIONS:

- Flu / Influenza

- Common Cold

- Allergy

- Gastritis

- Migraine

- Food Poisoning

- Respiratory Infection

RAINY-SEASON-RELEVANT CONDITIONS:

- Dengue

- Chikungunya

- Malaria

- Acute Diarrheal / Water-borne Illness

Do not attempt to cover hundreds of diseases.

==================================================

LOGIN PAGE

==================================================

Title:

"Welcome Back"

Fields:

Email

Password

Button:

"Log In"

Link:

"Create an account"

Use simple mock login behavior.

==================================================

SIGN UP PAGE

==================================================

Title:

"Create Your MediSense Account"

Fields:

Full Name

Email

Password

Confirm Password

Button:

"Create Account"

After signup:

"Account created successfully."

Redirect to Home.

Use mock frontend behavior.

==================================================

HEALTH CHECK PAGE

==================================================

This is the main page.

Title:

"Check Your Symptoms"

Subtitle:

"Select the symptoms you are currently experiencing."

Allow multiple selections.

==================================================

SYMPTOMS

==================================================

GENERAL:

- Fever

- Fatigue

- Weakness

- Chills

- Loss of appetite

HEAD & BODY:

- Headache

- Dizziness

- Body aches

- Joint pain

- Muscle pain

RESPIRATORY:

- Cough

- Sore throat

- Runny nose

- Shortness of breath

- Chest discomfort

DIGESTIVE:

- Nausea

- Vomiting

- Diarrhea

- Abdominal pain

SKIN:

- Rash

- Itching

OTHER:

- Eye pain

- Dehydration

Use simple selectable symptom chips/cards.

==================================================

ADDITIONAL INFORMATION

==================================================

Ask only these basic questions:

1. How long have you had these symptoms?

Options:

Less than 1 day

1–3 days

4–7 days

More than 7 days

2. How severe are your symptoms?

Mild

Moderate

Severe

3. Is it currently rainy season where you are?

Yes

No

Not sure

Rainy season should only provide contextual information.

It must NOT automatically mean the user has a rainy-season disease.

==================================================

ANALYZE BUTTON

==================================================

Large button:

"Analyze Symptoms"

After clicking:

Show a short loading state:

"Analyzing your symptoms..."

Then display Results.

==================================================

RESULTS PAGE

==================================================

Title:

"Your Health Assessment"

Subtitle:

"Possible conditions based on your reported symptoms."

Show:

Reported Symptoms

Duration

Severity

Then display ranked results.

Example:

--------------------------------

Dengue

High Symptom Match

72%

Matched Symptoms:

✓ Fever

✓ Headache

✓ Body pain

✓ Fatigue

Why it appears:

"Several of your reported symptoms match patterns associated with this condition."

--------------------------------

Flu

Moderate Symptom Match

58%

Matched Symptoms:

✓ Fever

✓ Headache

✓ Fatigue

--------------------------------

Chikungunya

Moderate Symptom Match

43%

--------------------------------

IMPORTANT:

Do not call the percentage a confirmed medical probability.

Label it:

"Symptom Match"

Add:

"This score represents how closely your reported symptoms match the prototype knowledge patterns. It is not a confirmed medical diagnosis."

==================================================

HEALTH SUGGESTIONS

==================================================

Below the results, show:

"What You Can Do"

Examples:

- Get enough rest

- Stay hydrated

- Monitor your symptoms

- Monitor your temperature

- Seek professional medical advice if symptoms persist or worsen

Make suggestions relevant to the possible conditions.

Do not prescribe medication.

Do not provide prescription dosage.

==================================================

WARNING SIGNS

==================================================

Show a small warning card:

"When to Seek Medical Care"

Examples:

- Severe difficulty breathing

- Severe chest pain

- Fainting

- Confusion

- Severe dehydration

- Severe or rapidly worsening symptoms

If the user selected "Severe", make this section more noticeable.

==================================================

SAVE ASSESSMENT

==================================================

At the bottom of Results:

Button:

"Save Assessment"

After clicking:

"Assessment saved."

Secondary button:

"View History"

==================================================

HISTORY PAGE

==================================================

Title:

"Assessment History"

Show previous assessments as simple cards.

Each card contains:

Date

Symptoms

Top Possible Condition

Symptom Match Score

Example:

August 22, 2026

Fever, Headache, Body pain

Dengue

72% Symptom Match

Button:

"View"

==================================================

HISTORY DETAILS

==================================================

When clicking View, display:

Date

Symptoms

Duration

Severity

Possible Conditions

Symptom Match Scores

Matched Symptoms

Health Suggestions

Warning Signs

Keep it simple.

No additional complicated functionality.

==================================================

DEMO DATA

==================================================

Include a few realistic demo assessments.

DEMO 1:

Symptoms:

Fever

Headache

Body pain

Fatigue

Duration:

1–3 days

Severity:

Moderate

Rainy season:

Yes

Results:

Dengue — 72%

Flu — 58%

Chikungunya — 43%

DEMO 2:

Symptoms:

Cough

Sore throat

Runny nose

Fatigue

Duration:

1–3 days

Severity:

Mild

Results:

Flu — 78%

Respiratory Infection — 69%

Common Cold — 63%

DEMO 3:

Symptoms:

Diarrhea

Vomiting

Abdominal pain

Weakness

Duration:

Less than 1 day

Severity:

Moderate

Results:

Food Poisoning — 81%

Acute Diarrheal Illness — 73%

==================================================

FOOTER

==================================================

MediSense

"Understand Your Symptoms. Get Informed."

Links:

Home

About

Health Check

History

Disclaimer:

"MediSense provides preliminary health information based on user-provided symptoms. It is not a medical diagnosis and does not replace professional medical advice."

==================================================

FINAL USER FLOW

==================================================

LOGIN / SIGN UP

        ↓

HOME

        ↓

HEALTH CHECK

        ↓

SELECT SYMPTOMS

        ↓

ADD BASIC INFORMATION

        ↓

ANALYZE

        ↓

RESULTS

        ↓

POSSIBLE CONDITIONS

        ↓

SYMPTOM MATCH SCORES

        ↓

HEALTH SUGGESTIONS

        ↓

WARNING SIGNS

        ↓

SAVE

        ↓

HISTORY

==================================================

FINAL DESIGN GOAL

==================================================

Keep MediSense SMALL.

Do not turn it into a large healthcare platform.

The main purpose is:

"User enters symptoms → MediSense identifies possible conditions → shows symptom-match scores → gives basic suggestions → saves the assessment."

The separate SWI-Prolog experiment will demonstrate that the symptom-condition reasoning used by the project can be represented using Prolog facts, rules, and queries.

The website should be polished, simple, presentation-ready, and easy for an undergraduate team to explain.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://medisense-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/21460dd5-460a-4c19-941d-de2ceb9305b4).

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
