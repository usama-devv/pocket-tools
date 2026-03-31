import { Info } from 'lucide-react';

const DecryptionInfoMessage = ({ toolName }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-4 px-2">
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-6 flex gap-4 shadow-sm">
        {/* Icon Section */}
        <div className="flex items-center justify-center shrink-0 mt-1">
          <Info className="text-[#3B82F6]" size={22} />
        </div>

        {/* Text Section */}
        <div className="text-[#1E3A8A] text-[15px] leading-relaxed">
          <p className="mb-3">
            {toolName} is a one-way hashing algorithm. There is no direct method for {toolName} decryption. 
            <span className="font-bold text-[#2563EB]"> {toolName} is decrypted by using Trial & Error methodology. </span> 
            It may take some time if either the text that will be decrypted or the character set that will be used for decryption is long.
          </p>
          
          <p className="text-[#3B82F6]">
            <span className="font-bold text-[#2563EB]">Note:</span> This service is used for educational purposes or in security research to demonstrate the importance of strong encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DecryptionInfoMessage;