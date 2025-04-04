'use client';

import { useFormContext } from 'react-hook-form';
import { FormData } from '../PTForm';

const painDescriptors = [
  'Sharp', 'Dull', 'Aching', 'Throbbing', 'Burning', 'Stabbing', 
  'Shooting', 'Tingling', 'Numbness', 'Pressure', 'Stiffness'
];

export default function InitialSymptoms() {
  const { register, watch } = useFormContext<FormData>();
  const watchPainDescriptors = watch('painDescriptors') || [];
  
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Initial Symptoms</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workers' Comp Specific Fields */}
        <div>
          <label htmlFor="injuryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Injury <span className="text-blue-600 font-bold">*</span>
          </label>
          <input
            id="injuryDate"
            type="date"
            {...register('injuryDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="injuryMechanism" className="block text-sm font-medium text-gray-700 mb-1">
            Mechanism of Injury <span className="text-blue-600 font-bold">*</span>
          </label>
          <input
            id="injuryMechanism"
            {...register('injuryMechanism')}
            placeholder="e.g., Slip and fall, lifting heavy object"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="initialEvalDate" className="block text-sm font-medium text-gray-700 mb-1">
            Initial Evaluation Date
          </label>
          <input
            id="initialEvalDate"
            type="date"
            {...register('initialEvalDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="initialPainScale" className="block text-sm font-medium text-gray-700 mb-1">
            Initial Pain Scale (0-10)
          </label>
          <div className="flex items-center">
            <input
              id="initialPainScale"
              type="range"
              min="0"
              max="10"
              step="1"
              {...register('initialPainScale', { valueAsNumber: true })}
              className="w-full"
            />
            <span className="ml-2 w-8 text-center">{watch('initialPainScale')}</span>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="anatomicalLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Anatomical Location <span className="text-blue-600 font-bold">*</span>
          </label>
          <input
            id="anatomicalLocation"
            {...register('anatomicalLocation')}
            placeholder="e.g., Left lower back, Right knee"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="initialPainTriggers" className="block text-sm font-medium text-gray-700 mb-1">
            Pain Triggers/Activities
          </label>
          <input
            id="initialPainTriggers"
            {...register('initialPainTriggers')}
            placeholder="e.g., standing >5min, walking upstairs"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pain Descriptors
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {painDescriptors.map(descriptor => (
              <div key={descriptor} className="flex items-center">
                <input
                  id={`descriptor-${descriptor}`}
                  type="checkbox"
                  value={descriptor}
                  {...register('painDescriptors')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`descriptor-${descriptor}`} className="ml-2 text-sm text-gray-700">
                  {descriptor}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="associatedSymptoms" className="block text-sm font-medium text-gray-700 mb-1">
            Associated Symptoms
          </label>
          <input
            id="associatedSymptoms"
            {...register('associatedSymptoms')}
            placeholder="e.g., Numbness in toes, Weakness"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="workStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Work Status at Initial Evaluation
          </label>
          <select
            id="workStatus"
            {...register('workStatus')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select work status</option>
            <option value="Full Duty">Full Duty</option>
            <option value="Modified Duty">Modified Duty</option>
            <option value="Off Work">Off Work</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="functionalLimitations" className="block text-sm font-medium text-gray-700 mb-1">
            Functional Limitations
          </label>
          <textarea
            id="functionalLimitations"
            rows={3}
            {...register('functionalLimitations')}
            placeholder="e.g., Unable to stand >5 minutes, Difficulty climbing stairs"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>
  );
} 