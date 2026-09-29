import Image from "next/image";
import network from "@/public/saas/tech-engi-network.png"
const BOARD = [
  { col: "To do", items: [["Motor driver layout", "Electronics"], ["Enclosure v2", "Mechanical"]] },
  {
    col: "In progress",
    items: [
      ["Sensor hub firmware", "Embedded"],
      ["Gripper CAD", "Mechanical"],
      ["Test plan", "Software"],
    ],
  },
  { col: "Done", items: [["Requirements", "Planning"], ["Parts list", "Planning"]] },
];

const MILESTONES = [
  { label: "Requirements", value: "Done" },
  { label: "Prototype", value: "In review" },
  { label: "Final build", value: "Next" },
];

const CHAT = [
  "Can you review the PCB layout?",
  "Done. Two notes on power routing.",
  "Thanks, updating today.",
];

const FILES = [
  { name: "gripper_v3.step", updated: "Updated 2h ago" },
  { name: "motor_driver.kicad_pcb", updated: "Updated yesterday" },
  { name: "sensor_hub_fw.zip", updated: "Updated 3 days ago" },
];

export default function WorkspaceSection() {
  return (
    <section id="space" className="relative dot-grid">
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <h2 className="reveal max-w-[820px]">
          Inside the workspace, <span className="text-saas-mut">everything moves together.</span>
        </h2>
        <p className="reveal">
          One place for tasks, files, milestones and conversations, so a handover never loses
          context.
        </p>

        <div className="bento">
          <div className="card reveal tile-top bento-4 bento-row-2">
            <h3>Project board</h3>
            <p>See what is planned, in progress and done at a glance.</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {BOARD.map((col) => (
                <div key={col.col} className="grid content-start gap-2 rounded-2xl bg-[#F3F6FC] p-3">
                  <b className="text-[0.8rem] font-medium text-saas-mut">{col.col}</b>
                  {col.items.map(([title, tag]) => (
                    <i
                      key={title}
                      className="block rounded-xl border border-saas-line bg-white px-3 py-2.5 not-italic text-[0.85rem] text-saas-ink"
                    >
                      {title}
                      <small className="mt-1.5 block text-[0.75rem] text-saas-accent-2">{tag}</small>
                    </i>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="card reveal tile-top bento-2">
            <h3>Milestones</h3>
            <div className="mock-panel">
              {MILESTONES.map((m) => (
                <div key={m.label} className="mock-row">
                  <span>{m.label}</span>
                  <b>{m.value}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="card reveal tile-top bento-2">
            <h3>Team chat</h3>
            <div className="mt-5 grid gap-2.5">
              {CHAT.map((msg, i) => (
                <span
                  key={msg}
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[0.9rem] ${
                    i % 2 === 1 ? "justify-self-end bg-saas-accent text-white" : "bg-[#F3F6FC] text-saas-ink"
                  }`}
                >
                  {msg}
                </span>
              ))}
            </div>
          </div>

          <div className="card reveal tile-top bento-3">
            <h3>Files and versions</h3>
            <div className="mt-3.5">
              {FILES.map((f) => (
                <div key={f.name} className="flex justify-between gap-3 border-b border-saas-line py-3.5 text-saas-ink last:border-0">
                  <span>{f.name}</span>
                  <small className="text-saas-mut">{f.updated}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card reveal tile-top bento-3 relative [&>*]:max-w-[46%]">
            <h3>Reviews on demand</h3>
            <p>Invite a second engineer to check any file before you sign off.</p>
            <Image
              src={network}
              alt="Glass robotic gripper"
              className="bento-image right-[-2%] bottom-[-14%] w-[46%] max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
