import {PropsWithChildren} from 'react';

interface CellProps {
  colspan?: number;
}

export function Cell({children, colspan}: PropsWithChildren<CellProps>) {
  return (
    <td
      colSpan={colspan}
      className="h-1 has-[a]:p-0 p-2 border border-transparent text-left" // has-[a] removes the padding, since the padding is then added by CellLink component
    >
      {children}
    </td>
  );
}

export function HeadCell({children}: PropsWithChildren) {
  return <th className="p-2 border border-transparent text-left">{children}</th>;
}
