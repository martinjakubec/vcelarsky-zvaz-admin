import {ActiveLinkOptions, Link, LinkProps} from '@tanstack/react-router';


// TODO: Try to find a way to make this work without any type casting
export function CellLink(props: LinkProps) {
  return (
    <Link
      className="p-2 flex items-center w-full h-full hover:underline"
      to={(props as any).to} // eslint-disable-line
      params={(props as any).params} // eslint-disable-line
    >
      {props.children}
    </Link>
  );
}
