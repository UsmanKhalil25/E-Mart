import { ReactNode } from "react";
import RedirectButton from "@/components/Buttons/RedirectButton";
interface MainWrapperProps {
  children: ReactNode;
  pageName: string;
  redirectionUrl: string;
}
const MainWrapper: React.FC<MainWrapperProps> = ({
  children,
  pageName,
  redirectionUrl,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold leading-7 text-zinc-900">
          All {pageName}s
        </h3>
        <RedirectButton
          label={`Add new ${pageName.toLowerCase()}`}
          redirectionUrl={redirectionUrl}
        />
      </div>

      <hr className="h-px my-4 bg-gray-300 border-0" />
      {children}
    </div>
  );
};
export default MainWrapper;
