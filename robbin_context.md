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

---
*Note: This file will be updated after any future changes to keep track of the application state.*
