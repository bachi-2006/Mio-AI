
import React from 'react';
import BaseChatInterface from './BaseChatInterface';

interface CodeModeInterfaceProps {
  mode: 'code';
}

const CodeModeInterface: React.FC<CodeModeInterfaceProps> = (props) => {
  return (
    <div className="h-full">
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold">Code Assistant</h1>
        <p className="text-muted-foreground">Get help with coding problems, debugging, and programming concepts.</p>
      </div>
      <BaseChatInterface {...props} />
    </div>
  );
};

export default CodeModeInterface;
