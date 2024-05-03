import {
  ForwardedRef,
  HTMLInputTypeAttribute,
  RefObject,
  forwardRef,
} from 'react';
import {TextInput} from './TextInput';
import {NumberInput} from './NumberInput';
import {DateInput} from './DateInputs';
import {FileInput} from './FileInput';

export interface InputProps {
  name: string;
  type: HTMLInputTypeAttribute | 'select';
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  defaultValue: string | number;
  required?: boolean;
}
export const Input = forwardRef(function Input(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  switch (props.type) {
    case 'text':
      return <TextInput {...props} ref={ref} />;
    case 'number':
      return <NumberInput {...props} ref={ref} />;
    case 'date':
      return <DateInput {...props} ref={ref} />;
    case 'file':
      return (
        <FileInput
          {...props}
          accept="text/csv"
          uploadText="Vybrať súbor..."
          ref={ref}
        />
      );
    case 'checkbox':
      return 'checkbox';
    default:
      return <div>{props.type} input not implemented</div>;
  }
});
