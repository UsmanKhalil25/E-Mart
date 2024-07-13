import Link from "next/link";
import { LinkObj } from "@/lib/type";

interface RedirectButtonProps {
  redirectionUrl: LinkObj;
  label: string;
}
const RedirectButton: React.FC<RedirectButtonProps> = ({
  redirectionUrl,
  label,
}) => {
  return (
    <Link
      href={redirectionUrl}
      className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
    >
      {label}
    </Link>
  );
};

export default RedirectButton;
