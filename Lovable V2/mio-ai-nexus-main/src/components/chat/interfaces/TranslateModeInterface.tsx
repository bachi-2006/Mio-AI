
import React from 'react';
import BaseChatInterface from './BaseChatInterface';

interface TranslateModeInterfaceProps {
  mode: 'translate';
}

const TranslateModeInterface: React.FC<TranslateModeInterfaceProps> = (props) => {
  return (
    <div className="h-full">
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold">Translation Assistant</h1>
        <p className="text-muted-foreground">Translate text between languages or get help with language learning.</p>
      </div>
      <BaseChatInterface {...props} />
    </div>
  );
};

export default TranslateModeInterface;
