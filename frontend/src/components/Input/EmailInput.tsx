import {ForwardedRef, forwardRef} from 'react';

interface EmailInputProps {
  name: string;
  id: string;
  defaultValue: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const EmailInput = forwardRef(function EmailInput(
  {name, id, defaultValue, onChange, placeholder, required}: EmailInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
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
      <input
        ref={ref}
        className="border-2 border-yellow-300 focus:border-yellow-500 px-2 py-1 outline-none"
        id={id}
        defaultValue={defaultValue}
        type="email"
        placeholder={placeholder || undefined}
        onChange={onChange}
        required={required}
      />
    </div>
  );
});
