import DashboardShell from "@/components/layout/DashboardShell";
import DirectMessageUI from "@/components/chat/DirectMessageUI";

export default function MessagePage() {
  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto w-full">
        <DirectMessageUI />
      </div>
    </DashboardShell>
  );
}