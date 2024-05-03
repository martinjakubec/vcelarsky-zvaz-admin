import {ForwardedRef, PropsWithChildren, PropsWithRef, forwardRef} from 'react';

export interface SelectProps {
  name: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  required?: boolean;
}

export const SelectInput = forwardRef(function SelectInput(
  {
    name,
    id,
    onChange,
    placeholder,
    required,
    children,
  }: PropsWithChildren<SelectProps>,
  ref: ForwardedRef<HTMLSelectElement>
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
      <select
        ref={ref}
        className="border-2 border-yellow-300 focus:border-yellow-500 px-2 py-1 outline-none"
        id={id}
        defaultValue=""
        required={required}
        onChange={onChange}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
});
