import { Navbar } from "@/components/Navbar";
import { ApplyWizard } from "@/components/ApplyWizard";

export const metadata = { title: "Start your application — MyVisa" };

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 67px)", background: "#F5F7FA" }}>
        <ApplyWizard />
      </main>
    </>
  );
}
