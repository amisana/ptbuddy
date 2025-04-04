'use client';

import { useFormContext } from 'react-hook-form';
import { FormData } from '../PTForm';

// Common PT credential options
const ptCredentialOptions = [
  { value: '', label: 'Select Credentials' },
  { value: 'PT', label: 'PT - Physical Therapist' },
  { value: 'DPT', label: 'DPT - Doctor of Physical Therapy' },
  { value: 'MPT', label: 'MPT - Master of Physical Therapy' },
  { value: 'PT, DPT', label: 'PT, DPT' },
  { value: 'PT, DPT, OCS', label: 'PT, DPT, OCS - Orthopedic Clinical Specialist' },
  { value: 'PT, DPT, SCS', label: 'PT, DPT, SCS - Sports Clinical Specialist' },
  { value: 'PT, DPT, NCS', label: 'PT, DPT, NCS - Neurologic Clinical Specialist' },
  { value: 'PT, DPT, GCS', label: 'PT, DPT, GCS - Geriatric Clinical Specialist' },
  { value: 'PT, DPT, PCS', label: 'PT, DPT, PCS - Pediatric Clinical Specialist' },
  { value: 'PTA', label: 'PTA - Physical Therapist Assistant' },
  { value: 'Other', label: 'Other' }
];

export default function PTInfo() {
  const { register, watch } = useFormContext<FormData>();
  const selectedCredential = watch('ptCredentials');
  const showOtherCredential = selectedCredential === 'Other';
  
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Physical Therapist & Facility Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ptName" className="block text-sm font-medium text-gray-700 mb-1">
            PT Name
          </label>
          <input
            id="ptName"
            {...register('ptName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="ptCredentials" className="block text-sm font-medium text-gray-700 mb-1">
            PT Credentials
          </label>
          <select
            id="ptCredentials"
            {...register('ptCredentials')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {ptCredentialOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {showOtherCredential && (
            <div className="mt-2">
              <label htmlFor="ptCredentialsOther" className="block text-sm font-medium text-gray-700 mb-1">
                Specify Other Credentials
              </label>
              <input
                id="ptCredentialsOther"
                {...register('ptCredentialsOther')}
                placeholder="Enter your credentials"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700 mb-1">
            Facility Name
          </label>
          <input
            id="facilityName"
            {...register('facilityName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name/Facility
          </label>
          <input
            id="recipientName"
            {...register('recipientName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="recipientFax" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Fax Number
          </label>
          <input
            id="recipientFax"
            {...register('recipientFax')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>
  );
} 