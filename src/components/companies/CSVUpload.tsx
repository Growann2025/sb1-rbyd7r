import React from 'react';
import UploadWizard from '../uploads/UploadWizard';

interface Props {
  onClose: () => void;
}

const CSVUpload: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <UploadWizard onClose={onClose} />
      </div>
    </div>
  );
};

export default CSVUpload;