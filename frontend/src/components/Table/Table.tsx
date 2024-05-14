import {PropsWithChildren} from 'react';

export function Table({children}: PropsWithChildren) {
  return <table className="w-full border-collapse border text-sm mb-5 mt-2">{children}</table>;
}
