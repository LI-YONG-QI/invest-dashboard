"use client";
import { useSIWE } from "connectkit";
import AssetTable from "./components/assetsTable";
import SignIn from "./components/signIn";

export default function Home() {
  const { isSignedIn } = useSIWE();

  return (
    <main>
      <p className="mt-[20px] text-center text-[50px] font-bold">投資配置</p>

      {!isSignedIn ? <SignIn /> : <AssetTable />}
    </main>
  );
}
