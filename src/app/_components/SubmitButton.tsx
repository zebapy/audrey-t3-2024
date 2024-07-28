import { useFormStatus } from "react-dom";

export const PendingSubmitButton = ({
  children,
  loadingText,
}: {
  children: React.ReactNode;
  loadingText: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn">
      {pending ? loadingText : children}
    </button>
  );
};
