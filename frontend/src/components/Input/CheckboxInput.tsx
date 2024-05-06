import {ForwardedRef, forwardRef} from 'react';

export interface InputProps {
  name: string;
  id: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  defaultChecked?: boolean;
}

export const CheckboxInput = forwardRef(function CheckboxInput(
  {name, id, onChange, required, defaultChecked}: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="flex flex-row-reverse justify-end py-2 pl-1 max-w-60">
      <label
        className={`flex pl-2 items-center first-letter:capitalize text-sm font-bold ${
          required && "after:content-['*'] after:text-yellow-500"
        }`}
        htmlFor={id}
      >
        {name}
      </label>

      <input
        ref={ref}
        name={id}
        className="outline-none accent-yellow-300 w-7 h-7 ring-yellow-300 focus:ring-yellow-500 ring-2 border-none appearance-none checked:bg-yellow-500 checked:border-none"
        id={id}
        type="checkbox"
        onChange={(e) => {
          onChange?.(e);
        }}
        defaultChecked={defaultChecked}
      />
    </div>
  );
});
