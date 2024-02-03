"use client";
import { SIWESession, useSIWE } from "connectkit";

const SignIn = () => {
  const { signIn } = useSIWE({
    onSignIn: (session?: SIWESession) => {
      //TODO REDUX
      console.log("hello");
      console.log(session);
    },
  });

  return (
    <div className="mt-20">
      <p className="text-center text-[36px] tracking-wider capitalize">
        please sign in first
      </p>
      <div className="mt-10 flex justify-center">
        <button
          onClick={signIn}
          className="bg-[#f5f5f5] border-2 border-[#000] px-5 py-2 rounded-md text-[#000] font-bold"
        >
          sign in
        </button>
      </div>
    </div>
  );
};

export default SignIn;
