# PT Buddy - Physical Therapy Progress Documentation Tool

PT Buddy is a web-based form application for physical therapists to quickly document patient progress and generate standardized fax cover sheets for workers' compensation doctors to approve continued PT care.

## Project Overview

This application provides a comprehensive form interface with multiple sections for documenting physical therapy evaluations, measurements, and progress tracking. The final output is a professional, standardized fax cover sheet that can be printed directly from the browser.

More info:

```markdown

Yes, I completely understand the purpose now. This application elegantly solves a real workflow problem in the NY Workers' Comp system:

1. After 12-15 PT sessions, demonstrating objective improvement is required for additional sessions
2. Currently PTs send excessive documentation (hundreds of notes)
3. This streamlines the process with a single, focused cover sheet showing:
   - Initial evaluation data
   - Clear objective measurements of improvement
   - Current status
   - Justification for continued care

The form efficiently captures and presents the key data points needed to demonstrate medical necessity in a standardized format. This helps both the PT (by simplifying documentation) and the physician (by making it easy to quickly assess progress and write necessary orders).

The structure directly supports this workflow with components that track before/after measurements and clearly display improvement metrics.
```

## Directory Structure

```
pt_buddy/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app router
│   │   ├── components/   # React components
│   │   │   ├── form-sections/
│   │   │   │   ├── PTInfo.tsx             # PT/Facility information component
│   │   │   │   ├── PatientInfo.tsx        # Patient demographics component
│   │   │   │   ├── InitialSymptoms.tsx    # Initial symptoms component
│   │   │   │   ├── ObjectiveMeasurements.tsx  # Measurements component
│   │   │   │   └── ProgressTracking.tsx   # Progress tracking component
│   │   │   ├── PTForm.tsx                 # Main form component
│   │   │   └── FaxCoverSheet.tsx          # Output component
│   │   ├── page.tsx      # Main application page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   └── ...
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── ...
```

## Component Architecture

The application follows a modular component structure:

- `PTForm`: The main container component that manages form state using React Hook Form
- Form Section Components:
  - `PTInfo`: Physical therapist and facility information
  - `PatientInfo`: Patient demographics 
  - `InitialSymptoms`: Initial evaluation data and pain assessment
  - `ObjectiveMeasurements`: Tracks ROM, strength, and functional improvements
  - `ProgressTracking`: Documents current status and recommendations
- `FaxCoverSheet`: Renders the formatted output for printing

## Data Flow

1. The main `PTForm` component uses React Hook Form's `FormProvider` to share form context with all child components
2. Each form section accesses the shared context using `useFormContext()`
3. Dynamic fields (measurements, tests) are managed with React Hook Form's `useFieldArray()`
4. When the form is submitted, the data is passed to the `FaxCoverSheet` component for display
5. The application features a toggle between edit mode and preview mode

## Features

- **PT/Facility Information**: Store and autofill information for returning users
- **Patient Demographics**: Document patient name, DOB, and claim numbers 
- **Initial Symptoms Documentation**: Record pain scale, descriptors, anatomical location and functional limitations
- **Objective Measurements**: 
  - ROM measurements with before/after comparison
  - Strength testing with improvement tracking
  - Functional testing metrics
- **Progress Tracking**: Document current status and recommend continued PT
- **Standardized Fax Cover Sheet**: Generate professional, print-ready documents
- **Dynamic Field Management**: Add/remove measurement fields as needed

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/pt_buddy.git
cd pt_buddy
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Workflow

1. Fill out the PT and facility information
2. Add patient demographics 
3. Document initial symptoms and evaluations
4. Add objective measurements with before/after values
5. Document current status and progress
6. Click "Generate Fax Cover Sheet" to preview the report
7. Print the cover sheet directly from the browser or go back to edit

## Technologies Used

- **Next.js**: React framework with app router
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form state management
- **date-fns**: Date formatting utilities

## License

This project is licensed under the MIT License.

## Acknowledgments

- Created for physical therapists working with workers' compensation cases
- Designed to streamline documentation and improve communication with doctors
