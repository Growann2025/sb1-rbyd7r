import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import FileUploadStep from './steps/FileUploadStep';
import MatchFieldsStep from './steps/MatchFieldsStep';
import PreviewStep from './steps/PreviewStep';

export type UploadStep = 'upload' | 'match' | 'preview';

interface Props {
  onClose: () => void;
}

const UploadWizard: React.FC<Props> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadedData, setUploadedData] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});

  const steps = [
    { key: 'upload', label: 'Upload File', icon: Upload },
    { key: 'match', label: 'Match Fields', icon: FileText },
    { key: 'preview', label: 'Preview & Import', icon: CheckCircle }
  ];

  const handleFileProcessed = (result: { success: boolean; message: string; data?: any }) => {
    if (result.success) {
      if (result.data) {
        setUploadedData(result.data);
      }
      setCurrentStep('match');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Import Affiliate Profiles</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center">
                    <div className={`flex items-center ${
                      index !== steps.length - 1 ? 'w-full' : ''
                    }`}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep === step.key
                          ? 'bg-blue-500 text-white'
                          : steps.findIndex(s => s.key === currentStep) > index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{step.label}</p>
                      </div>
                      {index !== steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                          steps.findIndex(s => s.key === currentStep) > index
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {currentStep === 'upload' && (
            <FileUploadStep 
              onFileData={(data, fileName) => {
                setUploadedData(data);
                setCurrentStep('match');
              }} 
            />
          )}
          {currentStep === 'match' && (
            <MatchFieldsStep
              data={uploadedData}
              onFieldsMatched={(mapping) => {
                setFieldMapping(mapping);
                setCurrentStep('preview');
              }}
              onBack={() => setCurrentStep('upload')}
            />
          )}
          {currentStep === 'preview' && (
            <PreviewStep
              data={uploadedData}
              fieldMapping={fieldMapping}
              onBack={() => setCurrentStep('match')}
              onComplete={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadWizard;