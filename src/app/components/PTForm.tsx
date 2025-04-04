'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import PTInfo from './form-sections/PTInfo';
import PatientInfo from './form-sections/PatientInfo';
import ObjectiveMeasurements from './form-sections/ObjectiveMeasurements';
import ProgressTracking from './form-sections/ProgressTracking';
import FaxCoverSheet from './FaxCoverSheet';

export type FormData = {
  // PT/Facility Info
  ptName: string;
  ptCredentials: string;
  ptCredentialsOther: string;
  facilityName: string;
  recipientName: string;
  recipientFax: string;
  
  // Patient Demographics
  patientName: string;
  patientDOB: string;
  claimNumber: string;

  // Initial Symptoms (kept for FaxCoverSheet)
  initialEvalDate: string;
  initialPainScale: number;
  anatomicalLocation: string;
  
  // Workers' Comp Specific Fields
  injuryDate: string;
  injuryMechanism: string;
  workStatus: string;

  // Objective Measurements
  romMeasurements: {
    description: string;
    initialValue: string;
    initialDate: string;
    currentValue: string;
    currentDate: string;
    unit?: string;
  }[];
  
  strengthTests: {
    description: string;
    initialValue: string;
    initialDate: string;
    currentValue: string;
    currentDate: string;
    unit?: string;
  }[];
  
  functionalTests: {
    description: string;
    initialValue: string;
    initialDate: string;
    currentValue: string;
    currentDate: string;
    unit?: string;
  }[];
  
  painMeasurements: {
    description: string;
    initialValue: string;
    initialDate: string;
    currentValue: string;
    currentDate: string;
    unit?: string;
  }[];

  // Progress Tracking
  currentPainScale: number;
  needMorePT: boolean;
  continuedPTGoals: string;
  additionalNotes: string;
};

export default function PTForm() {
  const [showPreview, setShowPreview] = useState(false);
  const methods = useForm<FormData>({
    defaultValues: {
      ptName: '',
      ptCredentials: '',
      ptCredentialsOther: '',
      facilityName: '',
      recipientName: '',
      recipientFax: '',
      
      patientName: '',
      patientDOB: '',
      claimNumber: '',

      initialEvalDate: '',
      initialPainScale: 0,
      anatomicalLocation: '',
      
      // Workers' Comp Fields
      injuryDate: '',
      injuryMechanism: '',
      workStatus: '',

      romMeasurements: [],
      strengthTests: [],
      functionalTests: [],
      painMeasurements: [],

      currentPainScale: 0,
      needMorePT: false,
      continuedPTGoals: '',
      additionalNotes: ''
    }
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    setShowPreview(true);
  };

  return (
    <div className="container mx-auto p-4">
      {!showPreview ? (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="text-2xl font-bold text-center mb-6">PT Progress Report Form</h1>
            
            <PTInfo />
            <PatientInfo />
            <ObjectiveMeasurements />
            <ProgressTracking />
            
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate Fax Cover Sheet
              </button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div>
          <FaxCoverSheet formData={methods.getValues()} />
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowPreview(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors mr-4"
            >
              Back to Form
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Print Cover Sheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 