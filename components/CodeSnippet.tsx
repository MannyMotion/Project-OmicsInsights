
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#282c34] rounded-lg overflow-hidden relative group">
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="p-2 bg-white/10 rounded-md text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre className="p-4 text-sm text-[#abb2bf] overflow-x-auto">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};
