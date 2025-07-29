'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface SubmissionFormProps {
  onSubmission: (script: string) => void;
  isLoading: boolean;
}

export default function SubmissionForm({
  onSubmission,
  isLoading,
}: SubmissionFormProps) {
  const [script, setScript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!script.trim()) return;
    onSubmission(script);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Enter your script here..."
        className="w-full p-2 border rounded"
        rows={5}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Video'}
      </Button>
    </form>
  );
}
