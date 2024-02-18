import {PropsWithChildren} from 'react';

export function PageBody({children}: PropsWithChildren) {
  return <div className="p-2">{children}</div>;
}
