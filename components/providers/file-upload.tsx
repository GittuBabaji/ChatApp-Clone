'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

type UploadEndpoint = 'messageFile' | 'serverImage';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: UploadEndpoint;
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
}: FileUploadProps) => {
  const [uploadedUrl, setUploadedUrl] = useState<string>(value); 

  const fileType = uploadedUrl?.split('.').pop()?.toLowerCase();
  const isValidImage = uploadedUrl?.startsWith('http') && fileType !== 'pdf';

  const handleRemove = () => {
    setUploadedUrl('');
    onChange('');
  };

  const handleUploadComplete = (res: any) => {
    const url = res?.[0]?.url;
    if (url) {
      setUploadedUrl(url);  
      onChange(url);     
      window.location.reload();    
    }
  };

  if (isValidImage) {
    return (
      <div className="relative h-20 w-20">
        <Image
          src={uploadedUrl}
          alt="Uploaded file"
          className="rounded-full object-cover"
          fill
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(error) => {
        console.error("Upload Error:", error);
      }}
    />
  );
};
