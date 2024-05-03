import {ForwardedRef, forwardRef} from 'react';
import {InputProps} from './Input';

export const NumberInput = forwardRef(function NumberInput(
  {name, id, defaultValue, onChange, placeholder, required}: InputProps,
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
        type="number"
        step="any"
        placeholder={placeholder || undefined}
        onChange={onChange}
      />
    </div>
  );
});
