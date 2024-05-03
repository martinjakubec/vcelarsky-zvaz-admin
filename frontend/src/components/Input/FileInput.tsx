import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {InputProps} from './Input';

interface FileInputProps extends InputProps {
  accept?: string;
  uploadText?: string;
}

export const FileInput = forwardRef(function FileInput(
  {
    defaultValue,
    id,
    name,
    onChange,
    required,
    accept,
    uploadText,
  }: FileInputProps,
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
        ref={internalRef}
        className="hidden"
        id={id}
        defaultValue={defaultValue}
        type="file"
        accept={accept}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e);
          console.log(e.target.files?.[0]);
          setFileName(
            e.target.files?.[0].name ||
              uploadText ||
              'Click here to upload a file'
          );
        }}
      />
    </div>
  );
});
