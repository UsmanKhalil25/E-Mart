import Link from "next/link";
import { capitalizeWord } from "@/utils/string-utils";
interface DetailsNotFoundProps {
  pageName: string;
  callbackUrl: string;
}
const DetailsNotFound: React.FC<DetailsNotFoundProps> = ({
  pageName,
  callbackUrl,
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-10 py-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {capitalizeWord(pageName)} Not Found
        </h2>
        <p className="mt-4 text-gray-600">
          The {pageName} you are looking for does not exist or has been removed.
        </p>
        <Link href={callbackUrl}>
          <span className="mt-6 inline-block bg-zinc-900 text-white py-2 px-4 rounded-md hover:bg-zinc-800">
            Go to {pageName}s
          </span>
        </Link>
      </div>
    </div>
  );
};
export default DetailsNotFound;
