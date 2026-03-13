# Stitch App Context & History
**Author**: Robbin (AI Assistant)
**Purpose**: To maintain a running context of all changes and progress made on the Stitch Web App prototype.

## Overall Architecture
The app consists of static HTML/Tailwind CSS screens representing a 4-level hierarchy:
1. **Business Owners**: Manage trainers and view analytics.
2. **Trainers**: Manage client lists, schedules, and active dogs.
3. **Clients (Owners)**: View dog progress, activity logs, and sign documents.
4. **Dogs**: View detailed dog profiles and reports.

## Progress History

### Phase 1: Interactive Prototype Base
- **Goal**: Turn the initial set of static HTML screens into a clickable prototype.
- **Actions**:
  - Organized the directory structure.
  - Linked all initial screens together using standard HTML `href` tags.
  - Added interactivity via a custom `showToast()` JavaScript notification system to all interactive elements (buttons, toggles, form submissions).
  - Started a Ruby HTTP server on port 8080 to view the prototype locally.
- **Key Screens Updated**:
  - `dashboard_del_entrenador_updated_style`
  - `perfil_del_perro_updated_style`
  - `planificador_de_manadas`
  - `seguimiento_de_paseo_gps`
  - `registro_de_actividad_navy_theme`
  - `portal_del_due_o_updated_style`
  - `onboarding_y_consentimiento_legal`
  - `documentos_legales_updated_style`

### Phase 2: Stitch MCP Integration & 4-Level Hierarchy
- **Goal**: Integrate new designs from the Stitch design platform and implement the full 4-level user hierarchy.
- **Actions**:
  - Connected to the Stitch MCP server to list all available projects and screens.
  - Downloaded 4 new pre-existing screens from Stitch (`Inicio Entrenador`, `Notificaciones`, `Añadir Perro`, `Enviar Documentos`).
  - Used the Stitch `generate_screen_from_text` tool to design and generate **two missing screens** needed for the hierarchy:
    1. **Business Owner Dashboard** (`owner_dashboard`)
    2. **Trainer's Client Management List** (`lista_clientes`)
  - Created a master `index.html` file acting as a role selector (splash screen) for the Business Owner, Trainer, and Client personas.
  - Updated all inter-page navigation links to flow smoothly from the Business Owner down to the Dog Level (Owner -> Trainer -> Client -> Dog).

### Phase 3: GitHub Repository & Context Updating
- **Goal**: Maintain version control via GitHub and update context continuously.
- **Actions**:
  - Initialized git and pushed all project files to `https://github.com/merck522/Robbin`.
  - **CRITICAL RULE**: Set requirement to *always* update this file (`robbin_context.md`) and automatically commit and push to GitHub (`git add . && git commit -m "..." && git push origin main`) after *any* changes or additions are made to the project.

### Phase 4: Full Flow Integration
- **Goal**: Make every button and link across the app clickable and fully integrated.
- **Actions**:
  - Connected undefined/dead links to flow logically (e.g. Schedule to Planificador).
  - Linked all notification bells to `notificaciones`.
  - Replaced WhatsApp `showToast` instances with `window.open` using `https://wa.me/...`.
  - Replaced Call instances with `window.location.href='tel:...'`.
  - Created a dummy PDF and wired up PDF views/downloads and Email prompts (`mailto:`).
  - Converted unassigned tabs and settings to link to the master role selector as a fallback.
  - Automatically committed and pushed all updates to GitHub.

### Phase 5: Authentication Flow
- **Goal**: Introduce a Splash -> Login/SignUp sequence before entering the main Role Selector.
- **Actions**:
  - Downloaded the Splash, Login, and Sign-Up templates from the `Pawsitive Splash Screen` Stitch project.
  - Renamed the existing `index.html` (Role Selector) to `selector.html`.
  - Created a new redirecting `index.html` root file to immediately boot to `splash/code.html`.
  - Wired up the Splash buttons to point to Login/Signup, and linked the successful Login/Signup forms to land on `selector.html`.
  - Updated *all* fallback `<a href="../index.html">` breadcrumbs across the 18 main dashboard screens to redirect to `../selector.html`.
  - Committed and pushed the new entry flow to GitHub.

### Phase 6: Authentication Style Matching
- **Goal**: Standardize the primary colors of the Authentication screens to match the existing Stitch theme.
- **Actions**:
  - Replaced the bright green/pink `#13ec80`/`#ed13e4` Tailwind configurations with Navy Blue `#050062` across `splash`, `login`, and `signup`.
  - Corrected button text contrast by swapping `text-slate-900` to `text-white`.
  - Pushed styling updates to GitHub.

### Phase 7: Standardize Bottom Navigation Bars
- **Goal**: Make the layout, CSS wrap, text size, and grid logic of every bottom navigation bar in the app identical, while preserving original links.
- **Actions**:
  - Identified 11 primary dashboard/profile screens featuring a bottom `<nav>` or `<div>`.
  - Wrote a Python `beautifulsoup4` script to traverse the HTML, locate the `bottom-0` anchors, extract the `material-symbols-outlined` icons, labels, and URLs.
  - Replaced all non-standard navigation bars with a unified `<nav class="fixed bottom-0 ... max-w-md mx-auto ...">` template containing the parsed items.
  - Standardized the text labels to uppercase `text-[9px] font-bold` and icons to `text-[24px]` for consistency across devices.
  - Pushed the navigation UI updates to GitHub.

### Phase 8: Smart Enrollment Engine Integration
- **Goal**: Incorporate the Information Architecture and Data Schema for the Smart Enrollment module into the existing HTML screens.
- **Actions**:
  - Designed the Information Architecture and Document Lifecycle state machine to handle Medical, Behavioral, and Legal data.
  - **Walker Dashboard (`seguimiento_de_paseo_gps`)**: Added a swipe-to-stop action bar, giant one-tap events (pee/poop), an emergency FAB calling the vet protocol, red flag behavior chips, and a pack roster carousel for safe, one-handed operation.
  - **Client Portal (`portal_del_due_o_updated_style`)**: Designed UX logic for expired vaccinations: implemented a Grace Period warning banner, hard-blocked the "Book Session" action, and created a security escape hatch modal forcing a document upload.
  - **Onboarding (`onboarding_y_consentimiento_legal`)**: Formatted the legal PDF flow to explicitly capture matching schema fields, inserting sections for Medical Ceiling (max emergency spend limits), Behavioral Quirks (reactivity, prey drive, bite history), and Home Access details.
  - Committed and pushed all updates to GitHub.

### Phase 9: Role-Based Navigation Standardization
- **Goal**: Lock in the bottom `<nav>` bar across all dashboard screens based strictly on the 3-Tier user role.
- **Actions**:
  - Audited 13 distinct HTML screens and categorized them into Admin, Trainer, or Client groups.
  - Defined 3 specific navigation templates using the unified HTML/Tailwind styling from Phase 7.
    - **Owner/Admin Flow**: Home, Trainers, Add (FAB), Dogs, Analytics.
    - **Trainer/Walker Flow**: Home, Clients, Calendar, Active Ride.
    - **Client Flow**: Home, Dogs, Legal Docs, Health/Activity Logs.
  - Ran a `beautifulsoup4` python script to programmatically swap the hardcoded HTML `<nav>` block in all 13 screens with the precise Role Template.
  - Generated dynamic state formatting so that the active page receives `text-primary` while inactive icons inherit `text-slate-400`.
  - Pushed UI and file updates to GitHub.

### Phase 10: Trainer Contract Generation Flow
- **Goal**: Build the Trainer-side UI for the Smart Enrollment Engine to draft new service contracts.
- **Actions**:
  - Created a new directory and HTML file `crear_nuevo_contrato/code.html`.
  - Designed a mobile-first wizard UI with Sections for: Basic Info (Client Name, Dog Name, Program Type), Financials (Number of Sessions Stepper, Total Cost Input, Installment toggles), and Legal Clauses (Standard Waivers, Marketing permissions).
  - Linked the "Nuevo Doc" quick-action button in the `dashboard_del_entrenador_updated_style` to direct to the new contract flow.
  - Wrote success modal logic to simulate generating the PDF and "sending" it to the client.
  - Updated the Python navigation script to inject the Trainer Navigation template into the new HTML screen.

### Phase 11: 3-Role Architecture Restructure
- **Goal**: Remove the Daycare Owner tier and restructure the app around Trainer, Walker, and Client only, matching the revised Smart Enrollment flowchart.
- **Actions**:
  - **Deleted** `owner_dashboard/` directory entirely.
  - **Created** `dashboard_del_paseador/code.html` — a Walker Home Dashboard with quick stats (dogs today, walks completed, km walked), next walk card with Red Flag chips, safety alerts, and quick actions (Start Walk, New Contract, Schedule).
  - **Created** `contrato_paseo/code.html` — a Walker-specific contract wizard with Service Type (Solo/Pack/Drop-In), Frequency/Schedule (Daily, 3x/week, Weekends), Duration stepper, Rate per Walk billing, and Home Access request toggles (Lockbox, Alarm, Special Entry Notes).
  - **Updated** `selector.html` to show 3 roles: Dog Trainer, Dog Walker, Pet Parent. Removed Business Owner card. Updated hierarchy subtitle to "A 3-Role Platform".
  - **Rewrote** `update_navs.py` to maintain 3 separate navigation templates:
    - **Trainer**: Home, Clients, Calendar, Contract.
    - **Walker**: Home, Schedule, Active Walk, Clients.
    - **Client**: Home, Pets, Docs, Health.
  - Ran the script to inject the correct nav into all 15 active screens.

---
*Note: This file will be updated after any future changes to keep track of the application state.*
