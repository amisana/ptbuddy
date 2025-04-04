'use client';

import { useFormContext } from 'react-hook-form';
import { FormData } from '../PTForm';

export default function PTInfo() {
  const { register } = useFormContext<FormData>();
  
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
          <input
            id="ptCredentials"
            {...register('ptCredentials')}
            placeholder="PT, DPT, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
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