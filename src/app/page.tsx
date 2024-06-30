import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
export default function Home() {
  return (
    <>
      <div className="flex justify-start w-full pt-14 flex-col items-center">
        <h1 className="text-4xl">Home page</h1>
        <div className="flex flex-row gap-2 mt-8">
          <LoginLink className="px-3 py-2 bg-neutral-950 rounded text-white">
            Login
          </LoginLink>
          <RegisterLink className="px-3 py-2 bg-neutral-950 rounded text-white">
            Register
          </RegisterLink>
        </div>
      </div>
    </>
  );
}
