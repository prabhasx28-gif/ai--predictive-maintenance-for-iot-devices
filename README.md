# EdgePulse Industrial Telemetry & Machine Automation Console

**EdgePulse** is an industrial IoT operations, high-frequency machine telemetry, and mission-critical automation infrastructure platform. Engineered with a clinical, high-performance light aesthetic, it provides field technicians, systems engineers, and operations managers with daytime legibility, low cognitive friction, and sub-millisecond precision over physical machinery.

---

## Design System: EdgePulse Light Anybody

- **Typography**: Standardized on **Anybody** across all typographical scales, activating tabular lining figures (`tabular-nums`) for real-time sensor meters, throughput monitors, and matrices.
- **Surface Architecture**: Deep slate foundations (`#0B1C30`) and pure whites (`#FFFFFF`) over a light canvas base (`#F8FAFC`), bound by 1px structural borders (`#E2E8F0`).
- **Signal System**: High-contrast ice-cyan (`#0098B3`), deep cyan (`#0E7490`), and atmospheric blue (`#0284C7`), paired with ISO safety signals: Emerald (`#059669`) for nominal equilibrium, Amber (`#D97706`) for preventative warnings, and Crimson (`#DC2626`) for immediate SCRAM interrupts.

---

## Core Screens & Features

### 1. Fleet Telemetry Monitor (`Fleet Monitor`)
- **Fleet Operational KPIs**: Fleet Equilibrium Index, total aggregated power draw (kW), mean radial vibration velocity (mm/s), and edge RTOS telemetry latency.
- **10 kHz Synchronized Live Chart**: High-velocity SVG streaming trace displaying dual-channel telemetry (Vibration Velocity mm/s & Stator Thermal Load °C) with interactive crosshairs, warning/trip thresholds, and time-range selection (30s, 2m, 10m).
- **Machine Fleet Grid**: High-density cards for gas turbines, CNC 5-axis mills, cryogenic transfer pumps, 6-axis collaborative robotic arms, induction sintering furnaces, and air compressors.
- **Multi-Channel Live Sensor Feed**: Interactive data grid with alternating row contrast and `#0098B3` left border highlight on hover.

### 2. Machine Diagnostics Inspector (`Machine Inspector`)
- **Interactive Cross-Section CAD Blueprint**: Vector module topology featuring interactive sensor hotspots (journal bearing transducers, core thermocouples, hydraulic oil manifolds, and combustor acoustic resonators).
- **Fast Fourier Transform (FFT) Harmonic Spectrum Analyzer**: Spectral breakdown of vibration frequencies (0.5X oil whirl subharmonics, 1X rotational unbalance, 2X angular misalignment, 3X coupling looseness, BPFO bearing defect, and blade pass harmonics).
- **Dynamic Threshold Sliders**: Interactive adjustments for advisory warning and emergency scram trip levels.
- **Automated RTOS Hardware Self-Test Suite**: Animated diagnostic routine verifying transducer loopback SNR, rotor dynamic eccentricity, emergency SCRAM relay latches, and sensor zero-drift tolerance.

### 3. Automation Infrastructure & Safety Interlocks (`Automation Logic`)
- **Edge RTOS Gateway Nodes**: Real-time telemetry monitoring for connected edge gateways (`GW-ALPHA-01`, `GW-BETA-02`, `GW-RACK-04`) with CPU, memory, and packet loss metrics.
- **Deterministic Safety Interlocks**: Armed hardware rules with duration hysteresis, trigger execution counters, and safety classifications (Level 1 Info, Level 2 Auto-Mitigate, Level 3 Scram Interlock).
- **Interlock Rule Builder**: Dialog for composing and arming custom safety rules with metric, operator, threshold, and target selection.
- **Manual Actuator Overrides**: Direct technician controls for dampener nitrogen purges, secondary glycol cooling boosts, and vacuum cycling.

### 4. Incident & Alarm Log (`Incident Log`)
- **Event Feed & Triage**: Critical scram alarms, preventative warnings, and diagnostic notes with peak metric values.
- **Triage Actions**: One-click incident acknowledgment with engineer signatures, technician field dispatching, and custom engineering log notes.
- **Data Export**: Full incident log export to CSV format.

### 5. Transducer Calibration & Asset Registry (`Calibration Lab`)
- **Metrology Standards**: Traceability to NIST and ISO 17025 primary references.
- **Transducer Registry**: Tracking certificates, measured drift percentages, and calibration expiration schedules.
- **Event Logging**: Modal dialog for logging certified calibration routines and zero-bias offsets.

### 6. Emergency Safety Systems
- **Emergency SCRAM Shutdown**: Global or machine-specific emergency interlock system requiring code authorization (`"SCRAM"`) to trip electrical and hydraulic breakers in <15ms.
- **Transducer Zero-Offset Calibration**: Hardware ADC bias adjustment interface.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Typography**: Google Fonts (Anybody 100–900 variable font)
- **Icons**: Lucide React
- **Animations & Interaction**: Motion

---

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
```

### Type Checking & Linting
```bash
npm run lint
```
