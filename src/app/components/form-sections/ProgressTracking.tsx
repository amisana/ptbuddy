'use client';

import { useFormContext } from 'react-hook-form';
import { FormData } from '../PTForm';

export default function ProgressTracking() {
  const { register, watch } = useFormContext<FormData>();
  const needMorePT = watch('needMorePT');
  
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Progress Tracking</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div>
          <label htmlFor="currentPainScale" className="block text-sm font-medium text-gray-700 mb-1">
            Current Pain Scale (0-10)
          </label>
          <div className="flex items-center">
            <input
              id="currentPainScale"
              type="range"
              min="0"
              max="10"
              step="1"
              {...register('currentPainScale', { valueAsNumber: true })}
              className="w-full"
            />
            <span className="ml-2 w-8 text-center">{watch('currentPainScale')}</span>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <input
              id="needMorePT"
              type="checkbox"
              {...register('needMorePT')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="needMorePT" className="text-sm font-medium text-gray-700">
              Continued PT Recommended
            </label>
          </div>
          
          {needMorePT && (
            <div>
              <label htmlFor="continuedPTGoals" className="block text-sm font-medium text-gray-700 mb-1">
                Goals for Continued PT
              </label>
              <textarea
                id="continuedPTGoals"
                rows={3}
                {...register('continuedPTGoals')}
                placeholder="e.g., Return to full work duties, improve gait pattern, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            {...register('additionalNotes')}
            placeholder="Any additional information that may be relevant"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>
  );
} 