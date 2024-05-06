import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface FileInputProps {
  accept?: string;
  uploadText?: string;
  id: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const FileInput = forwardRef(function FileInput(
  {id, name, onChange, required, accept, uploadText}: FileInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [fileName, setFileName] = useState<string>(
    uploadText || 'Click here to upload a file'
  );

  const internalRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

  return (
    <div className="flex flex-col py-2 max-w-60">
      <label
        className={`pl-2 first-letter:capitalize text-sm font-bold ${
          required && "after:content-['*'] after:text-yellow-500"
        }`}
        htmlFor={id}
      >
        {name}
      </label>
      <label
        className="border-2 border-yellow-300 focus:border-yellow-500 px-2 py-1 outline-none"
        htmlFor={id}
        tabIndex={0}
        onKeyDownCapture={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            internalRef.current?.click();
          }
        }}
      >
        {fileName}
      </label>

      <input
        formNoValidate
        ref={internalRef}
        required={required}
        className="w-[1px] h-[1px] relative left-24"
        id={id}
        name={id}
        type="file"
        accept={accept}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e);
          setFileName(
            e.target.files?.[0]?.name ||
              uploadText ||
              'Click here to upload a file'
          );
        }}
      />
    </div>
  );
});
