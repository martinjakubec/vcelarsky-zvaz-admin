import {ForwardedRef, forwardRef} from 'react';

interface TextInputProps {
  name: string;
  id: string;
  defaultValue: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const TextInput = forwardRef(function TextInput(
  {name, id, defaultValue, onChange, placeholder, required}: TextInputProps,
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
        type="text"
        placeholder={placeholder || undefined}
        onChange={onChange}
        required={required}
      />
    </div>
  );
});
