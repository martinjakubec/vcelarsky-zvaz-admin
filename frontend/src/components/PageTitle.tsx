import {PropsWithChildren} from 'react';

export function PageTitle({children}: PropsWithChildren) {
  return <h1 className="text-2xl font-bold text-gray-900 pb-2">{children}</h1>;
}
