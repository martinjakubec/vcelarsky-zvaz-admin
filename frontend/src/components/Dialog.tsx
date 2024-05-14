import {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

export const Dialog = forwardRef(function Dialog(
  {children}: PropsWithChildren,
  ref: React.Ref<HTMLDialogElement>
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

  return (
    <dialog
      className="p-4 bg-white rounded-md relative border-red-500"
      ref={dialogRef}
    >
      <button
        className="absolute top-5 right-5 text-sm"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Zatvoriť
      </button>
      {children}
    </dialog>
  );
});
