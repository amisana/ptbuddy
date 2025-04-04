'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { FormData } from '../PTForm';
import { useEffect } from 'react';

type MeasurementCardProps = {
  fieldPrefix: 'romMeasurements' | 'strengthTests' | 'functionalTests' | 'painMeasurements';
  index: number;
  type: 'rom' | 'strength' | 'functional' | 'pain';
  onRemove: () => void;
};

export default function MeasurementCard({ 
  fieldPrefix, 
  index, 
  type, 
  onRemove 
}: MeasurementCardProps) {
  const { register, control, watch, setValue } = useFormContext<FormData>();
  
  // Use watch to properly trigger re-renders when values change
  const description = watch(`${fieldPrefix}.${index}.description`);
  const initialValue = watch(`${fieldPrefix}.${index}.initialValue`);
  const currentValue = watch(`${fieldPrefix}.${index}.currentValue`);
  const unit = watch(`${fieldPrefix}.${index}.unit`);

  // Configuration based on measurement type
  const typeConfig = {
    rom: { 
      label: 'ROM Measurement',
      className: 'bg-blue-100 text-blue-800',
      defaultUnit: 'degrees',
      placeholder: 'Knee Flexion'
    },
    strength: { 
      label: 'Strength Test',
      className: 'bg-purple-100 text-purple-800',
      defaultUnit: 'MMT',
      placeholder: 'Quadriceps Strength'
    },
    functional: { 
      label: 'Functional Test',
      className: 'bg-green-100 text-green-800',
      defaultUnit: 'minutes',
      placeholder: 'Standing Tolerance'
    },
    pain: {
      label: 'Pain Measurement',
      className: 'bg-red-100 text-red-800',
      defaultUnit: 'pain scale (0-10)',
      placeholder: 'Pain with Walking'
    }
  };
  
  const config = typeConfig[type];
  
  // Set default unit if not already set
  useEffect(() => {
    if (!unit && config.defaultUnit) {
      setValue(`${fieldPrefix}.${index}.unit`, config.defaultUnit);
    }
  }, [setValue, fieldPrefix, index, unit, config.defaultUnit]);
  
  // Calculate improvement
  const calculateImprovement = () => {
    if (!initialValue || !currentValue) return null;

    // Special handling for MMT format (e.g. "3/5")
    if (type === 'strength' && unit === 'MMT') {
      const isMMTFormat = (val: string) => /^\d+\/\d+$/.test(val);
      
      if (isMMTFormat(initialValue) && isMMTFormat(currentValue)) {
        const initialMMT = parseInt(initialValue.split('/')[0]);
        const currentMMT = parseInt(currentValue.split('/')[0]);
        
        if (!isNaN(initialMMT) && !isNaN(currentMMT)) {
          return {
            value: currentMMT - initialMMT,
            positive: currentMMT > initialMMT,
            isMMT: true
          };
        }
      }
    }
    
    // Special handling for pain scale (lower is better)
    if (type === 'pain') {
      try {
        const initial = parseFloat(initialValue);
        const current = parseFloat(currentValue);
        
        if (isNaN(initial) || isNaN(current)) return null;
        
        // For pain, reduction (negative change) is positive improvement
        const percentChange = ((initial - current) / (initial || 1)) * 100;
        return {
          value: Math.round(percentChange),
          positive: percentChange > 0,
          isPain: true
        };
      } catch (_) {
        return null;
      }
    }
    
    // Standard numeric improvement calculation
    try {
      const initial = parseFloat(initialValue);
      const current = parseFloat(currentValue);
      
      if (isNaN(initial) || isNaN(current) || initial === 0) return null;
      
      const percentChange = ((current - initial) / Math.abs(initial)) * 100;
      return {
        value: Math.round(percentChange),
        positive: percentChange > 0,
        isMMT: false,
        isPain: false
      };
    } catch (_) {
      return null;
    }
  };
  
  const improvement = calculateImprovement();

  // MMT scale options for strength measurements
  const mmtOptions = [
    { value: '', label: 'Select MMT' },
    { value: '0/5', label: '0/5 - No contraction' },
    { value: '1/5', label: '1/5 - Trace contraction' },
    { value: '2/5', label: '2/5 - Poor, some movement' },
    { value: '3/5', label: '3/5 - Fair, full ROM against gravity' },
    { value: '4/5', label: '4/5 - Good, full ROM against resistance' },
    { value: '5/5', label: '5/5 - Normal strength' }
  ];
  
  // Pain scale options (0-10)
  const painScaleOptions = [
    { value: '', label: 'Select Pain Level' },
    { value: '0', label: '0 - No Pain' },
    { value: '1', label: '1 - Minimal' },
    { value: '2', label: '2 - Mild' },
    { value: '3', label: '3 - Uncomfortable' },
    { value: '4', label: '4 - Moderate' },
    { value: '5', label: '5 - Distracting' },
    { value: '6', label: '6 - Distressing' },
    { value: '7', label: '7 - Severe' },
    { value: '8', label: '8 - Intense' },
    { value: '9', label: '9 - Excruciating' },
    { value: '10', label: '10 - Worst Possible' }
  ];

  // Show appropriate input based on type
  const renderValueInput = (field: 'initialValue' | 'currentValue') => {
    if (type === 'strength' && unit === 'MMT') {
      return (
        <Controller
          control={control}
          name={`${fieldPrefix}.${index}.${field}`}
          render={({ field: { onChange, value, ref } }) => (
            <select
              onChange={onChange}
              value={value || ''}
              ref={ref}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {mmtOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      );
    }
    
    if (type === 'pain' && unit && unit.includes('pain scale')) {
      return (
        <Controller
          control={control}
          name={`${fieldPrefix}.${index}.${field}`}
          render={({ field: { onChange, value, ref } }) => (
            <select
              onChange={onChange}
              value={value || ''}
              ref={ref}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {painScaleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      );
    }
    
    return (
      <div className="flex">
        <input
          {...register(`${fieldPrefix}.${index}.${field}`)}
          placeholder={`e.g., ${field === 'initialValue' ? '90' : '120'}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm w-24 justify-center">
          {unit || config.defaultUnit}
        </span>
      </div>
    );
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className={`text-sm px-2 py-1 rounded-md ${config.className} mr-2`}>
            {config.label}
          </span>
          {description && <span className="text-sm text-gray-700 font-medium">{description}</span>}
        </div>
        <button 
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            {...register(`${fieldPrefix}.${index}.description`)}
            placeholder={`e.g., ${config.placeholder}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Value
          </label>
          {renderValueInput('initialValue')}
          <input type="hidden" {...register(`${fieldPrefix}.${index}.initialDate`)} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Value
          </label>
          {renderValueInput('currentValue')}
          <input type="hidden" {...register(`${fieldPrefix}.${index}.currentDate`)} />
        </div>
      </div>
      
      {improvement && (
        <div className="mt-3 flex items-center">
          <div className={`px-3 py-1 rounded-md text-sm ${improvement.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-medium`}>
            {improvement.positive ? '↑' : '↓'} 
            {improvement.isMMT 
              ? `${Math.abs(improvement.value)} MMT level${Math.abs(improvement.value) !== 1 ? 's' : ''}` 
              : improvement.isPain
                ? `${Math.abs(improvement.value)}% pain reduction`
                : `${Math.abs(improvement.value)}%`} 
            {improvement.isPain ? '' : (improvement.positive ? 'improvement' : 'decrease')}
          </div>
        </div>
      )}
    </div>
  );
} 