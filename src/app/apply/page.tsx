import { Navbar } from "@/components/Navbar";
import { ApplyWizard } from "@/components/ApplyWizard";

export const metadata = { title: "Start your application — MyVisa" };

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; visaCenter?: string; visaType?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 67px)", background: "#F5F7FA" }}>
        <ApplyWizard
          initialDestination={sp.destination ?? ""}
          initialVisaCenter={sp.visaCenter ?? ""}
          initialVisaType={sp.visaType ?? ""}
        />
      </main>
    </>
  );
}
