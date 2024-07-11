import Link from "next/link";
interface RedirectButtonProps {
  redirectionUrl: string;
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
