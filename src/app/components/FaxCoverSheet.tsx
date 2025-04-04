'use client';

import { FormData } from './PTForm';
import { format } from 'date-fns';

interface FaxCoverSheetProps {
  formData: FormData;
}

export default function FaxCoverSheet({ formData }: FaxCoverSheetProps) {
  // Function to format date from ISO string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'M/d/yy');
    } catch (_) {
      return dateString;
    }
  };

  // Calculate percentage improvement for display
  const calculateImprovement = (initial: string, current: string) => {
    if (!initial || !current) return null;
    
    // Remove any non-numeric characters except decimal points
    const initialValue = parseFloat(initial.replace(/[^\d.-]/g, ''));
    const currentValue = parseFloat(current.replace(/[^\d.-]/g, ''));
    
    if (isNaN(initialValue) || isNaN(currentValue) || initialValue === 0) return null;
    
    const percentChange = ((currentValue - initialValue) / Math.abs(initialValue)) * 100;
    return {
      value: Math.round(percentChange),
      positive: percentChange > 0
    };
  };

  // Format MMT improvement
  const formatMMTImprovement = (initial: string, current: string) => {
    if (!initial || !current) return null;
    if (initial.includes('/') && current.includes('/')) {
      const initialMMT = parseInt(initial.split('/')[0]);
      const currentMMT = parseInt(current.split('/')[0]);
      if (!isNaN(initialMMT) && !isNaN(currentMMT) && initialMMT !== currentMMT) {
        return {
          value: currentMMT - initialMMT,
          positive: currentMMT > initialMMT
        };
      }
    }
    return null;
  };

  // Get current date
  const currentDate = format(new Date(), 'M/d/yyyy');
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md print:shadow-none">
      <div className="print:text-black">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase">Fax Cover Sheet [Draft Report]</h1>
        </div>
        
        {/* Recipient Info */}
        <div className="mb-6">
          <div className="flex">
            <div className="w-16 font-bold">TO:</div>
            <div>{formData.recipientName || 'Mount Sinai Selikoff Centers'}</div>
          </div>
          <div className="flex">
            <div className="w-16"></div>
            <div>{formData.recipientFax || 'Manhattan Fax: 212-987-0889'}</div>
          </div>
        </div>
        
        {/* Sender Info */}
        <div className="mb-6">
          <div className="flex">
            <div className="w-16 font-bold">FROM:</div>
            <div>
              {formData.ptName || ''}
              {formData.ptCredentials ? 
                (formData.ptCredentials === 'Other' ? 
                  `, ${formData.ptCredentialsOther}` : 
                  `, ${formData.ptCredentials}`
                ) : 
                ''
              }
            </div>
          </div>
          <div className="flex">
            <div className="w-16"></div>
            <div>{formData.facilityName || ''}</div>
          </div>
          <div className="flex mt-2">
            <div className="w-16 font-bold">Pages:</div>
            <div>1</div>
          </div>
          <div className="flex">
            <div className="w-16 font-bold">Date:</div>
            <div>{currentDate}</div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-b-2 border-gray-800 my-4"></div>
        
        {/* Report Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">PHYSICAL THERAPY PROGRESS REPORT</h2>
        </div>
        
        {/* Patient Info */}
        <div className="mb-6">
          <div className="mb-1">
            <span className="font-bold">Patient: </span>
            <span>{formData.patientName || ''}</span>
          </div>
          <div className="mb-1 flex">
            <div className="w-1/2">
              <span className="font-bold">DOB: </span>
              <span>{formatDate(formData.patientDOB) || ''}</span>
            </div>
            <div className="w-1/2">
              <span className="font-bold">Claim #: </span>
              <span>{formData.claimNumber || ''}</span>
            </div>
          </div>
          {/* Workers' Comp Info */}
          {formData.injuryDate && (
            <div className="mb-1 flex">
              <div className="w-1/2">
                <span className="font-bold">Date of Injury: </span>
                <span>{formatDate(formData.injuryDate) || ''}</span>
              </div>
              {formData.workStatus && (
                <div className="w-1/2">
                  <span className="font-bold">Work Status: </span>
                  <span>{formData.workStatus}</span>
                </div>
              )}
            </div>
          )}
          {formData.injuryMechanism && (
            <div className="mb-1">
              <span className="font-bold">Mechanism of Injury: </span>
              <span>{formData.injuryMechanism}</span>
            </div>
          )}
        </div>
        
        {/* Initial Evaluation */}
        <div className="mb-6">
          <div className="font-bold mb-1">Initial Evaluation ({formatDate(formData.initialEvalDate)}):</div>
          <ul className="list-disc pl-6 space-y-1">
            <li>Pain {formData.initialPainScale || '0'}/10</li>
            <li>{formData.anatomicalLocation || ''}</li>
          </ul>
        </div>
        
        {/* Current Status */}
        <div className="mb-6">
          <div className="font-bold mb-1">Current Status ({currentDate}):</div>
          <div className="pl-6">
            <ul className="list-disc space-y-1">
              <li>Pain {formData.currentPainScale || '0'}/10</li>
            </ul>
          </div>
        </div>

        {/* Summary of Objective Improvements - New Section */}
        {(formData.romMeasurements?.some(m => m.initialValue && m.currentValue) ||
          formData.strengthTests?.some(t => t.initialValue && t.currentValue) ||
          formData.functionalTests?.some(t => t.initialValue && t.currentValue) ||
          formData.painMeasurements?.some(p => p.initialValue && p.currentValue)) && (
          <div className="mb-6 border-2 border-gray-200 p-4 bg-gray-50">
            <div className="font-bold mb-2 text-center">Summary of Objective Improvements:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ROM Summary */}
              {formData.romMeasurements?.filter(m => m.initialValue && m.currentValue && m.description)
                .map((measurement, index) => {
                  const improvement = calculateImprovement(measurement.initialValue, measurement.currentValue);
                  if (!improvement || !improvement.positive) return null;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-green-100 text-green-800">
                        ↑
                      </div>
                      <div>
                        <strong>{measurement.description}:</strong> {improvement.value}% improvement
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              
              {/* Strength Summary */}
              {formData.strengthTests?.filter(t => t.initialValue && t.currentValue && t.description)
                .map((test, index) => {
                  const mmtImprovement = formatMMTImprovement(test.initialValue, test.currentValue);
                  const improvement = mmtImprovement || calculateImprovement(test.initialValue, test.currentValue);
                  if (!improvement || !improvement.positive) return null;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-green-100 text-green-800">
                        ↑
                      </div>
                      <div>
                        <strong>{test.description}:</strong> {mmtImprovement ? `${Math.abs(mmtImprovement.value)} level(s)` : `${improvement.value}%`} improvement
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
                
              {/* Functional Summary */}
              {formData.functionalTests?.filter(t => t.initialValue && t.currentValue && t.description)
                .map((test, index) => {
                  const improvement = calculateImprovement(test.initialValue, test.currentValue);
                  if (!improvement || !improvement.positive) return null;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-green-100 text-green-800">
                        ↑
                      </div>
                      <div>
                        <strong>{test.description}:</strong> {improvement.value}% improvement
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
                
              {/* Pain Summary - special handling since decrease in pain is positive */}
              {formData.painMeasurements?.filter(p => p.initialValue && p.currentValue && p.description)
                .map((pain, index) => {
                  // For pain, a decrease is an improvement
                  const initial = parseFloat(pain.initialValue);
                  const current = parseFloat(pain.currentValue);
                  
                  if (isNaN(initial) || isNaN(current) || initial === 0 || current >= initial) return null;
                  
                  const percentChange = Math.round(((initial - current) / initial) * 100);
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-green-100 text-green-800">
                        ↓
                      </div>
                      <div>
                        <strong>{pain.description}:</strong> {percentChange}% pain reduction
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
            </div>
          </div>
        )}
        
        {/* Objective Improvements */}
        <div className="mb-6">
          <div className="font-bold mb-2">Objective Measurements:</div>
          <div className="space-y-2 pl-4">
            {formData.romMeasurements?.filter(m => m.description && (m.initialValue || m.currentValue)).length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm uppercase font-semibold text-gray-600 mb-2">Range of Motion</h3>
                {formData.romMeasurements.filter(m => m.description && (m.initialValue || m.currentValue)).map((measurement, index) => {
                  const improvement = calculateImprovement(measurement.initialValue, measurement.currentValue);
                  
                  return (
                    <div key={index} className="flex items-start mb-2">
                      <div className="mr-2">□</div>
                      <div>
                        <strong>{measurement.description}:</strong> 
                        <span className="font-semibold text-gray-700">{measurement.initialValue}</span> 
                        {measurement.unit ? ` ${measurement.unit}` : '°'} → 
                        <span className={`font-semibold ${improvement?.positive ? 'text-green-700' : improvement ? 'text-red-700' : 'text-gray-700'}`}>
                          {measurement.currentValue}
                        </span> 
                        {measurement.unit ? ` ${measurement.unit}` : '°'}
                        {improvement && (
                          <span className={`ml-2 text-sm ${improvement.positive ? 'text-green-700' : 'text-red-700'}`}>
                            ({improvement.positive ? '+' : ''}{improvement.value}%)
                          </span>
                        )}
                        <br />
                        <span className="text-sm">Initial: {formatDate(measurement.initialDate)}  Current: {formatDate(measurement.currentDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {formData.strengthTests?.filter(t => t.description && (t.initialValue || t.currentValue)).length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm uppercase font-semibold text-gray-600 mb-2">Strength Tests</h3>
                {formData.strengthTests.filter(t => t.description && (t.initialValue || t.currentValue)).map((test, index) => {
                  const mmtImprovement = formatMMTImprovement(test.initialValue, test.currentValue);
                  const improvement = mmtImprovement || calculateImprovement(test.initialValue, test.currentValue);
                  
                  return (
                    <div key={index} className="flex items-start mb-2">
                      <div className="mr-2">□</div>
                      <div>
                        <strong>{test.description}:</strong> 
                        <span className="font-semibold text-gray-700">{test.initialValue}</span> → 
                        <span className={`font-semibold ${improvement?.positive ? 'text-green-700' : improvement ? 'text-red-700' : 'text-gray-700'}`}>
                          {test.currentValue}
                        </span>
                        {improvement && (
                          <span className={`ml-2 text-sm ${improvement.positive ? 'text-green-700' : 'text-red-700'}`}>
                            ({improvement.positive ? '+' : ''}{mmtImprovement ? `${Math.abs(mmtImprovement.value)} level(s)` : `${improvement.value}%`})
                          </span>
                        )}
                        <br />
                        <span className="text-sm">Initial: {formatDate(test.initialDate)}  Current: {formatDate(test.currentDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {formData.functionalTests?.filter(t => t.description && (t.initialValue || t.currentValue)).length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm uppercase font-semibold text-gray-600 mb-2">Functional Tests</h3>
                {formData.functionalTests.filter(t => t.description && (t.initialValue || t.currentValue)).map((test, index) => {
                  const improvement = calculateImprovement(test.initialValue, test.currentValue);
                  
                  return (
                    <div key={index} className="flex items-start mb-2">
                      <div className="mr-2">□</div>
                      <div>
                        <strong>{test.description}:</strong> 
                        <span className="font-semibold text-gray-700">{test.initialValue}</span> 
                        {test.unit ? ` ${test.unit}` : ''} → 
                        <span className={`font-semibold ${improvement?.positive ? 'text-green-700' : improvement ? 'text-red-700' : 'text-gray-700'}`}>
                          {test.currentValue}
                        </span> 
                        {test.unit ? ` ${test.unit}` : ''}
                        {improvement && (
                          <span className={`ml-2 text-sm ${improvement.positive ? 'text-green-700' : 'text-red-700'}`}>
                            ({improvement.positive ? '+' : ''}{improvement.value}%)
                          </span>
                        )}
                        <br />
                        <span className="text-sm">Initial: {formatDate(test.initialDate)}  Current: {formatDate(test.currentDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {formData.painMeasurements?.filter(p => p.description && (p.initialValue || p.currentValue)).length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm uppercase font-semibold text-gray-600 mb-2">Pain Measurements</h3>
                {formData.painMeasurements.filter(p => p.description && (p.initialValue || p.currentValue)).map((pain, index) => {
                  // For pain, a decrease is an improvement
                  const initial = parseFloat(pain.initialValue);
                  const current = parseFloat(pain.currentValue);
                  let improvement = null;
                  
                  if (!isNaN(initial) && !isNaN(current) && initial !== 0) {
                    const percentChange = Math.round(((initial - current) / initial) * 100);
                    improvement = {
                      value: percentChange,
                      positive: percentChange > 0
                    };
                  }
                  
                  return (
                    <div key={index} className="flex items-start mb-2">
                      <div className="mr-2">□</div>
                      <div>
                        <strong>{pain.description}:</strong> 
                        <span className="font-semibold text-gray-700">{pain.initialValue}</span> → 
                        <span className={`font-semibold ${improvement?.positive ? 'text-green-700' : improvement ? 'text-red-700' : 'text-gray-700'}`}>
                          {pain.currentValue}
                        </span> 
                        {pain.unit && ` ${pain.unit}`}
                        {improvement && (
                          <span className={`ml-2 text-sm ${improvement.positive ? 'text-green-700' : 'text-red-700'}`}>
                            ({improvement.positive ? '-' : '+'}{Math.abs(improvement.value)}%)
                          </span>
                        )}
                        <br />
                        <span className="text-sm">Initial: {formatDate(pain.initialDate)}  Current: {formatDate(pain.currentDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Need More PT */}
        <div className="mb-6">
          <div className="font-bold mb-1">Need More PT?</div>
          <div className="flex space-x-4 pl-4">
            <div className="flex items-center">
              <div className={`w-4 h-4 border border-black ${formData.needMorePT ? 'bg-black' : ''} mr-2`}>
                {formData.needMorePT && <span className="text-white">✓</span>}
              </div>
              <span>Yes</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 border border-black ${!formData.needMorePT ? 'bg-black' : ''} mr-2`}>
                {!formData.needMorePT && <span className="text-white">✓</span>}
              </div>
              <span>No</span>
            </div>
          </div>
        </div>
        
        {/* Goals if Continued */}
        {formData.needMorePT && formData.continuedPTGoals && (
          <div className="mb-6">
            <div className="font-bold mb-1">Goals if Continued (4 weeks):</div>
            <div className="pl-6">
              <p>{formData.continuedPTGoals}</p>
            </div>
          </div>
        )}
        
        {/* Additional Notes */}
        {formData.additionalNotes && (
          <div className="mb-6">
            <div className="font-bold mb-1">Additional Notes:</div>
            <div className="pl-6">
              <p>{formData.additionalNotes}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Print-only styling */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
} 