import {PropsWithChildren} from 'react';

interface ButtonProps extends PropsWithChildren {
  type?: 'button' | 'submit';
  version?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({children, type, onClick}: ButtonProps) {
  return (
    <button
      type={type || 'button'}
      className="bg-yellow-500 border-2 border-white hover:border-yellow-500 font-bold py-2 px-4"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
