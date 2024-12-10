import React from 'react';

interface DateOfWritingSectionProps {
  dateOfWriting: string; // Expecting a date string
}

const DateOfWritingSection: React.FC<DateOfWritingSectionProps> = ({ dateOfWriting }) => {
  return (
    <div className="mb-8 text-center">
      <p className="text-sm">Date of Writing: {dateOfWriting}</p>
    </div>
  );
};

export default DateOfWritingSection; 