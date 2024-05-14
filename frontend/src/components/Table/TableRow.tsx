import {PropsWithChildren} from 'react';

interface TableRowProps {
  isHead?: boolean;
  index?: number;
  hover?: boolean;
}

export function TableRow({
  children,
  isHead = false,
  index,
  hover = true,
}: PropsWithChildren<TableRowProps>) {
  const headClassName = 'bg-yellow-500';
  const className = index && index % 2 === 0 && 'bg-yellow-100';
  const hoverClassName = 'hover:bg-yellow-200';

  return (
    <tr
      className={`${isHead ? headClassName : ''} ${!isHead ? className : ''} ${
        hover ? hoverClassName : ''
      }`}
    >
      {children}
    </tr>
  );
}
