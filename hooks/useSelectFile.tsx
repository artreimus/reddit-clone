import React, { useState } from 'react';

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // reader to process the file
    const reader = new FileReader();

    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    // event listener that will trigger when readAsDataUrl completes
    reader.onload = (readerEvent) => {
      // extract the result from the read file
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  return { selectedFile, onSelectFile, setSelectedFile };
};
export default useSelectFile;
