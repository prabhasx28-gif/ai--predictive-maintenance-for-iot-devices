---
name: EdgePulse Light Anybody
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d494c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d797d'
  outline-variant: '#bdc8cd'
  surface-tint: '#00687b'
  primary: '#006578'
  on-primary: '#ffffff'
  primary-container: '#008097'
  on-primary-container: '#f9fdff'
  inverse-primary: '#65d5f2'
  secondary: '#006781'
  on-secondary: '#ffffff'
  secondary-container: '#8fdfff'
  on-secondary-container: '#00647d'
  tertiary: '#006194'
  on-tertiary: '#ffffff'
  tertiary-container: '#007bb9'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aeecff'
  primary-fixed-dim: '#65d5f2'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5d'
  secondary-fixed: '#b9eaff'
  secondary-fixed-dim: '#81d1f0'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#004d62'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Anybody
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Anybody
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Anybody
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Anybody
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Anybody
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Anybody
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Anybody
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Anybody
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Anybody
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Anybody
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is engineered for industrial IoT operations, high-frequency machine telemetry, and mission-critical automation infrastructure. The visual language merges technical precision with an airy, clinical high-performance light aesthetic. It deliberately steers away from dark console cliches, offering field technicians, systems engineers, and operations managers unmatched daytime legibility and cognitive calm amidst torrential data streams.

The aesthetic philosophy is **Precision Minimalism with Technical Architecture**:
- **Pristine Atmospheric Clarity:** Deep slate and crystalline whites replace muddy corporate grays, simulating cleanroom instrumentation.
- **Electric Cyan Accents:** High-potency cyan and ice-blue serve strictly as operational beacons, directional data streams, and active mechanical states.
- **Micro-Engineered Surfaces:** Surfaces use razor-thin structural borders and subtle cool shifts rather than heavy skeuomorphism or muddy drop shadows.
- **High-Velocity Typography:** Expressive yet rigid monospace-adjacent proportions via Anybody give telemetry streams immediate machine-grade authority.

## Colors

The palette establishes an ultra-clean, clinical operating environment driven by crisp ice-blue and cyan signatures over cool slate foundations.

### Surface System
- **Canvas Base (`#F8FAFC`):** The primary canvas viewport; light slate with a cool crisp undertone.
- **Surface Level 1 (`#FFFFFF`):** High-clarity white for cards, diagnostic panels, and data grids.
- **Surface Level 2 (`#F1F5F9`):** Recessed containers, telemetry data rows, and inactive switch wells.
- **Surface Level 3 (`#E2E8F0`):** Outlines, subtle structural borders, and segmented rail tracks.

### Signal & Operational System
- **Primary Ice-Cyan (`#0098B3`):** High-contrast cyan tuned for WCAG AAA compliance on light surfaces; used for primary actions, active telemetry streams, and critical state nodes.
- **Deep Cyan (`#0E7490`):** Secondary structural accent for secondary buttons, interactive graphs, and focused outlines.
- **Atmospheric Blue (`#0284C7`):** Tertiary operational hue for machine-to-machine sync signals, informational chips, and streaming telemetry vectors.
- **Status Warnings & Criticals:** Amber-Orange (`#D97706`) for preventative warnings; Crimson (`#DC2626`) for immediate machine interrupts; Emerald (`#059669`) for nominal system equilibrium.

## Typography

The design system standardizes exclusively on **Anybody** across all typographical scales. Originally engineered with versatile grotesque width and weight parameters, Anybody provides an assertive industrial presence that retains clinical clarity under dense numerical configurations.

### Usage Standards
- **Numerical Telemetry:** Always activate tabular lining figures (`font-variant-numeric: tabular-nums lining-nums`) for real-time sensor meters, throughput monitors, and table matrices.
- **Labels & System Tags:** Render `label-sm` and `label-md` in uppercase with expanded tracking (`0.05em` - `0.08em`) to mimic stamped industrial hardware tags.
- **Headlines & Metric Readouts:** Use tight letter spacing with bold and extra-bold weights to anchor visual hierarchy within real-time streaming dashboards.

## Layout & Spacing

Telemetry dashboards demand an uncompromising spatial rhythm that balances high information density with rapid incident triage.

### Spatial Model
- **Grid Architecture:** A 12-column dynamic responsive grid for desktop (minimum 1280px viewport), switching to an 8-column configuration on tablet devices, and a 4-column stack on rugged mobile devices.
- **Base Rhythm:** Anchored to a strict 4px / 8px sub-grid. Internal component padding scales directly along `space-xs` (4px), `space-sm` (8px), `space-md` (16px), and `space-lg` (24px).
- **Density Controls:** In low-density management views, panels utilize `space-lg` padding; in live telemetry monitoring mode, card containers compress to `space-md` to expose concurrent sensor graphs above the fold.

## Elevation & Depth

Industrial operations reject muddy blurred shadows that degrade contrast under daylight glare. Depth is defined through **Tonal Micro-Layering** and **Ghost Outlines**.

### Elevation Stack
- **Base Ground (Level 0):** Pure Light Slate (`#F8FAFC`), 0px offset, zero shadow.
- **Card Tier (Level 1):** Solid White surface (`#FFFFFF`) with a structural 1px border (`#E2E8F0`) and an ambient, whisper-light cool contact shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`.
- **Active Telemetry / Hover (Level 2):** Elevated interactive components add a 1px border colored with subtle cyan (`#CFFAFE`) and an ultra-diffused atmospheric shadow: `0 4px 12px rgba(0, 152, 179, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)`.
- **Flyouts & Diagnostic Modals (Level 3):** Fixed-surface White backdrop, 1px border (`#CBD5E1`), complemented by deep clinical focus: `0 12px 28px rgba(15, 23, 42, 0.08), 0 4px 8px rgba(15, 23, 42, 0.04)`.

## Shapes

The shape architecture uses a **Rounded (Level 2)** profile, softening harsh machine telemetry into an approachable, modern SaaS experience without losing structural discipline.

- **Cards & Data Panels:** Default to `0.5rem` (`8px`) corner radius (`rounded-md`), scaling up to `1rem` (`16px`) (`rounded-lg`) for major canvas blocks.
- **Buttons, Field Inputs, & Select Triggers:** Standardized at `0.5rem` (`8px`).
- **Telemetry Chips & Machine Status Badges:** Use full pill contours (`9999px`) or `0.25rem` (`4px`) depending on whether they represent qualitative tags or discrete binary states.

## Components

### Buttons
- **Primary:** Background `#0098B3`, text `#FFFFFF`, font weight 600, border radius `0.5rem`. Hover state transitions to `#0E7490` with a subtle cyan glow (`0 0 12px rgba(0, 152, 179, 0.25)`). Active state applies a scale transform of `0.98`.
- **Secondary:** Surface `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`. On hover, background shifts to `#F8FAFC` with border `#0098B3`.
- **Ghost/Icon Action:** Transparent surface, text `#64748B`, hover background `#F1F5F9`, active color `#0098B3`.

### Telemetry Status Chips
- Height of 24px, uppercase `label-sm` font, letter spacing `0.08em`.
- **Nominal State:** Background `#ECFDF5`, text `#065F46`, border `1px solid #A7F3D0`, leading with a 6px pulsing emerald dot.
- **Alert State:** Background `#FEF2F2`, text `#991B1B`, border `1px solid #FECACA`.
- **Telemetry Active State:** Background `#ECFEFF`, text `#0E7490`, border `1px solid #A5F3FC`.

### Telemetry Cards & Metric Blocks
- Card body uses `#FFFFFF` over `#F8FAFC` base, bounded by a 1px `#E2E8F0` border and `0.5rem` to `1rem` corner radius.
- Header row contains metric classification in uppercase `label-md` (`#64748B`), with contextual icon action pinned right.
- Numerical value presented in bold `headline-xl` or `display-lg`, with unit labels rendered in `body-sm` (`#94A3B8`).

### Data Grids & Sensor Feeds
- Header row uses `#F1F5F9` background, 36px height, uppercase `label-xs` typography, with a bottom border `1px solid #E2E8F0`.
- Data rows alternate subtly with `#FFFFFF` and `#FAFAFA`, interactive row hover transitions to `#F0FDFA` (subtle cyan wash) and highlights left border with 3px `#0098B3`.

### Input Fields & Controls
- **Inputs:** Height 40px, surface `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`, placeholder `#94A3B8`. Focus state applies border `1.5px solid #0098B3` with a focused ring of `rgba(0, 152, 179, 0.15)`.
- **Checkboxes & Radios:** 18x18px box, border `1.5px solid #94A3B8`, radius `4px` (checkbox) / circular (radio). Checked state triggers solid `#0098B3` fill with high-contrast white glyph.