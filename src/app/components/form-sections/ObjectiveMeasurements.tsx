'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormData } from '../PTForm';
import { useState, useEffect } from 'react';
import MeasurementCard from './MeasurementCard';
import { format } from 'date-fns';

// Template definitions with proper typing
type MeasurementType = 'rom' | 'strength' | 'functional' | 'pain';

interface TemplateItem {
  type: MeasurementType;
  description: string;
  unit: string;
}

interface Templates {
  [key: string]: TemplateItem[];
}

const templates: Templates = {
  shoulder: [
    { type: 'rom', description: 'Shoulder Flexion', unit: 'degrees' },
    { type: 'rom', description: 'Shoulder Abduction', unit: 'degrees' },
    { type: 'rom', description: 'Shoulder External Rotation', unit: 'degrees' },
    { type: 'rom', description: 'Shoulder Internal Rotation', unit: 'degrees' }
  ],
  knee: [
    { type: 'rom', description: 'Knee Flexion', unit: 'degrees' },
    { type: 'rom', description: 'Knee Extension', unit: 'degrees' }
  ],
  back: [
    { type: 'rom', description: 'Lumbar Flexion', unit: 'degrees' },
    { type: 'rom', description: 'Lumbar Extension', unit: 'degrees' },
    { type: 'rom', description: 'Lateral Flexion (L)', unit: 'degrees' },
    { type: 'rom', description: 'Lateral Flexion (R)', unit: 'degrees' }
  ],
  strength: [
    { type: 'strength', description: 'Deltoid Strength', unit: 'MMT' },
    { type: 'strength', description: 'Biceps Strength', unit: 'MMT' },
    { type: 'strength', description: 'Triceps Strength', unit: 'MMT' }
  ],
  functional: [
    { type: 'functional', description: 'Standing Tolerance', unit: 'minutes' },
    { type: 'functional', description: 'Walking Tolerance', unit: 'minutes' },
    { type: 'functional', description: 'Stair Climbing', unit: 'steps' }
  ],
  pain: [
    { type: 'pain', description: 'Pain with Walking', unit: 'pain scale (0-10)' },
    { type: 'pain', description: 'Pain with Standing', unit: 'pain scale (0-10)' },
    { type: 'pain', description: 'Pain with Lifting', unit: 'pain scale (0-10)' },
    { type: 'pain', description: 'Pain at Rest', unit: 'pain scale (0-10)' },
    { type: 'pain', description: 'Pain at Night', unit: 'pain scale (0-10)' }
  ]
};

export default function ObjectiveMeasurements() {
  const { control, watch, setValue } = useFormContext<FormData>();
  const [initialDate, setInitialDate] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  // Watch for initialEvalDate changes
  const initialEvalDate = watch('initialEvalDate');

  // Field arrays for different measurement types with proper typing
  const { 
    fields: romFields, 
    append: romAppend, 
    remove: romRemove 
  } = useFieldArray({
    control,
    name: 'romMeasurements',
  });
  
  const { 
    fields: strengthFields, 
    append: strengthAppend, 
    remove: strengthRemove 
  } = useFieldArray({
    control,
    name: 'strengthTests',
  });
  
  const { 
    fields: functionalFields, 
    append: functionalAppend, 
    remove: functionalRemove 
  } = useFieldArray({
    control,
    name: 'functionalTests',
  });
  
  const { 
    fields: painFields, 
    append: painAppend, 
    remove: painRemove 
  } = useFieldArray({
    control,
    name: 'painMeasurements',
  });

  // Apply date to all fields of a specific type
  const applyDateToFields = (
    fieldType: 'romMeasurements' | 'strengthTests' | 'functionalTests' | 'painMeasurements', 
    dateType: 'initialDate' | 'currentDate', 
    date: string
  ) => {
    if (!date) return;
    
    const fields = fieldType === 'romMeasurements' 
      ? romFields 
      : fieldType === 'strengthTests' 
        ? strengthFields 
        : fieldType === 'painMeasurements'
          ? painFields
          : functionalFields;
    
    fields.forEach((_, index) => {
      setValue(`${fieldType}.${index}.${dateType}`, date, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  // Handle initial date changes
  const handleInitialDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setInitialDate(date);
    
    applyDateToFields('romMeasurements', 'initialDate', date);
    applyDateToFields('strengthTests', 'initialDate', date);
    applyDateToFields('functionalTests', 'initialDate', date);
    applyDateToFields('painMeasurements', 'initialDate', date);
  };
  
  // Handle current date changes
  const handleCurrentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setCurrentDate(date);
    
    applyDateToFields('romMeasurements', 'currentDate', date);
    applyDateToFields('strengthTests', 'currentDate', date);
    applyDateToFields('functionalTests', 'currentDate', date);
    applyDateToFields('painMeasurements', 'currentDate', date);
  };
  
  // Add a new measurement with proper field initialization
  const addMeasurement = (type: MeasurementType) => {
    const defaultUnit = type === 'rom' 
      ? 'degrees' 
      : type === 'strength' 
        ? 'MMT' 
        : type === 'pain'
          ? 'pain scale (0-10)'
          : 'minutes';
    
    const newItem = { 
      description: '', 
      initialValue: '', 
      initialDate: initialDate || initialEvalDate || '', 
      currentValue: '', 
      currentDate: currentDate || format(new Date(), 'yyyy-MM-dd'),
      unit: defaultUnit
    };
    
    if (type === 'rom') {
      romAppend(newItem);
    } else if (type === 'strength') {
      strengthAppend(newItem);
    } else if (type === 'pain') {
      painAppend(newItem);
    } else {
      functionalAppend(newItem);
    }
  };
  
  // Apply a template of measurements
  const applyTemplate = (templateKey: string) => {
    const templateItems = templates[templateKey];
    if (!templateItems || !templateItems.length) return;
    
    templateItems.forEach(item => {
      const newItem = {
        description: item.description,
        initialValue: '',
        initialDate: initialDate || initialEvalDate || '',
        currentValue: '',
        currentDate: currentDate || format(new Date(), 'yyyy-MM-dd'),
        unit: item.unit
      };
      
      if (item.type === 'rom') {
        romAppend(newItem);
      } else if (item.type === 'strength') {
        strengthAppend(newItem);
      } else if (item.type === 'pain') {
        painAppend(newItem);
      } else {
        functionalAppend(newItem);
      }
    });
  };

  // Initialize with initialEvalDate when it's first available
  useEffect(() => {
    if (initialEvalDate && !initialDate) {
      setInitialDate(initialEvalDate);
      
      applyDateToFields('romMeasurements', 'initialDate', initialEvalDate);
      applyDateToFields('strengthTests', 'initialDate', initialEvalDate);
      applyDateToFields('functionalTests', 'initialDate', initialEvalDate);
      applyDateToFields('painMeasurements', 'initialDate', initialEvalDate);
    }
  }, [initialEvalDate, initialDate, applyDateToFields]);
  
  // Initialize with current date if not already set
  useEffect(() => {
    if (!currentDate) {
      const today = format(new Date(), 'yyyy-MM-dd');
      setCurrentDate(today);
    }
  }, [currentDate]);
  
  const hasNoMeasurements = 
    romFields.length === 0 && 
    strengthFields.length === 0 && 
    functionalFields.length === 0 &&
    painFields.length === 0;
  
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Objective Measurements</h2>
      
      {/* Global Date Controls */}
      <div className="mb-6 p-5 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-4">Measurement Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Evaluation Date
            </label>
            <input
              type="date"
              value={initialDate}
              onChange={handleInitialDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Will be applied to all measurements
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Evaluation Date
            </label>
            <input
              type="date"
              value={currentDate}
              onChange={handleCurrentDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Will be applied to all measurements
            </p>
          </div>
        </div>
      </div>
      
      {/* Measurement Controls */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h3 className="text-lg font-medium text-blue-700">Add Objective Measurements</h3>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    applyTemplate(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-md appearance-none pr-8"
              >
                <option value="">Add Template</option>
                <option value="shoulder">Shoulder Set</option>
                <option value="knee">Knee Set</option>
                <option value="back">Back Set</option>
                <option value="strength">Strength Set</option>
                <option value="functional">Functional Set</option>
                <option value="pain">Pain Set</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => addMeasurement('rom')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              ROM
            </button>
            
            <button
              type="button"
              onClick={() => addMeasurement('strength')}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Strength
            </button>
            
            <button
              type="button"
              onClick={() => addMeasurement('functional')}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Functional
            </button>
            
            <button
              type="button"
              onClick={() => addMeasurement('pain')}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Pain
            </button>
          </div>
        </div>
        
        {/* Empty state prompt */}
        {hasNoMeasurements && (
          <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-gray-500 mb-4">No measurements added yet</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => addMeasurement('rom')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Your First Measurement
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* All Measurements */}
      <div className="space-y-4">
        {romFields.map((field, index) => (
          <MeasurementCard
            key={field.id}
            fieldPrefix="romMeasurements"
            index={index}
            type="rom"
            onRemove={() => romRemove(index)}
          />
        ))}
        
        {strengthFields.map((field, index) => (
          <MeasurementCard
            key={field.id}
            fieldPrefix="strengthTests"
            index={index}
            type="strength"
            onRemove={() => strengthRemove(index)}
          />
        ))}
        
        {functionalFields.map((field, index) => (
          <MeasurementCard
            key={field.id}
            fieldPrefix="functionalTests"
            index={index}
            type="functional"
            onRemove={() => functionalRemove(index)}
          />
        ))}
        
        {painFields.map((field, index) => (
          <MeasurementCard
            key={field.id}
            fieldPrefix="painMeasurements"
            index={index}
            type="pain"
            onRemove={() => painRemove(index)}
          />
        ))}
      </div>
    </section>
  );
} 