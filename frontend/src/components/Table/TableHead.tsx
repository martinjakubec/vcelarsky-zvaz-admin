import {PropsWithChildren} from 'react';
import {TableRow} from './TableRow';

export function TableHead({children}: PropsWithChildren) {
  return (
    <thead>
      <TableRow hover={false} isHead={true}>{children}</TableRow>
    </thead>
  );
}
