import { ReactNode } from "react";
interface DetailWrapperProps {
  children?: ReactNode;
  title: string;
  description: string;
}

const DetailWrapper: React.FC<DetailWrapperProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <fieldset className="space-y-12">
        <legend className="text-lg font-semibold leading-7 text-gray-900 border-b border-gray-900/10 pb-4">
          {title}
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      </fieldset>
      <div className="w-100">{children}</div>
    </div>
  );
};
export default DetailWrapper;
