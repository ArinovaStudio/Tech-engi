"use client";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Calendar, User, LucideLoader, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const statusColors: Record<string, string> = {
    OPEN: "bg-red-100 text-red-600",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-600",
    CLOSED: "bg-gray-200 text-gray-700",
};

const statusOrder: Record<string, number> = {
    OPEN: 0,
    IN_PROGRESS: 1,
    RESOLVED: 2,
    CLOSED: 3,
};

const ClientReportIssue = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchTicket, setFetchTicket] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [projectClient, setProjectClient] = useState(null);
    const { data: session } = useSession();
    const role = session?.user?.role?.toUpperCase()?.trim() || "";
    const [updating, setUpdating] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const currentUserId = session?.user?.id;
    const roleTabs = role === "ADMIN" ? ["ME", "ENGINEER", "CLIENT"] : ["ME", "ENGINEER", "ADMIN"];
    const [newTicket, setNewTicket] = useState({
        issueType: "",
        target: role === "ADMIN" ? "Engineer" : "PLATFORM",
        description: "",
        images: [] as File[],
    });
    const [activeTab, setActiveTab] = useState("ME");

    // Tracks whether the tour is handing off to the next page.
    // When true, onDestroyed must NOT clear sessionStorage or set localStorage,
    // because the assets page still needs the "tour_in_progress" flag.
    const isHandingOff = useRef(false);

    const getInitialTicket = () => ({
        issueType: "",
        target: role === "ADMIN" ? "Engineer" : "PLATFORM",
        description: "",
        images: [] as File[],
    });

    const fetchTickets = async () => {
        try {
            setFetchTicket(true);
            const res = await fetch(`/api/tickets?all=true`);
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch tickets");
            }
            setTickets(data.tickets);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setFetchTicket(false);
        }
    };

    const handleCreateTicket = async ({ }: any) => {
        try {
            setCreating(true);
            const formData = new FormData();
            formData.append("projectId", selectedProjectId);
            formData.append("issueType", newTicket.issueType);
            formData.append("target", newTicket.target);
            formData.append("description", newTicket.description);
            newTicket.images.forEach((file) => {
                formData.append("images", file);
            });
            const res = await fetch("/api/tickets", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to create ticket");
            }
            toast.success("Ticket submitted successfully");
            await fetchTickets();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSelectedProjectId("");
            setNewTicket(getInitialTicket());
            setShowModal(false);
            setCreating(false);
        }
    };

    const updateTicketStatus = async ({ ticketId, status }: { ticketId: string; status: string }) => {
        try {
            setUpdating(true);
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update status");
            }
            await fetchTickets();
            toast.success("Status updated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/client/projects");
                const data = await res.json();
                if (data.success) {
                    setProjects(data.projects);
                } else {
                    toast.error(data.message || "Failed to fetch projects");
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
        fetchTickets();
    }, []);

    // Compute filtered/sorted tickets before the tour useEffect so the
    // status-badge step guard can read the correct length.
    const filteredTickets = tickets.filter((ticket) => {
        const raisedRole = ticket.raisedBy?.role?.toUpperCase()?.trim() || "";
        switch (activeTab) {
            case "ME": return ticket?.raisedById === currentUserId;
            case "ENGINEER":
                if (ticket?.raisedById === currentUserId) return false;
                return raisedRole === "ENGINEER";
            case "CLIENT":
                if (ticket?.raisedById === currentUserId) return false;
                return raisedRole === "CLIENT";
            case "ADMIN": return raisedRole === "ADMIN";
            default: return true;
        }
    });

    const sortedTickets = [...filteredTickets].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );

    // Tour useEffect
    useEffect(() => {
        if (!currentUserId) return;

        const startTour = () => {
            const timer = setTimeout(() => {
                const driverObj = driver({
                    showProgress: true,
                    animate: true,
                    smoothScroll: true,
                    popoverClass: "custom-tour-popover",
                    overlayOpacity: 0.35,
                    nextBtnText: "Next →",
                    prevBtnText: "← Prev",
                    doneBtnText: "Done ✓",
                    onPopoverRender: (popover) => {
                        const style = (el: HTMLElement) => {
                            el.style.setProperty("background", "var(--primary)", "important");
                            el.style.setProperty("color", "#ffffff", "important");
                            el.style.setProperty("opacity", "1", "important");
                            el.style.setProperty("border", "none", "important");
                        };
                        if (popover.nextButton) style(popover.nextButton);
                        if (popover.previousButton) {
                            popover.previousButton.style.setProperty("background", "transparent", "important");
                            popover.previousButton.style.setProperty("color", "var(--text-secondary)", "important");
                            popover.previousButton.style.setProperty("border", "1px solid var(--border)", "important");
                        }
                    },
                    onDestroyed: () => {
                        setShowModal(false);
                        // Only clean up if this is a genuine end, NOT a handoff to assets page.
                        if (!isHandingOff.current) {
                            sessionStorage.removeItem("tour_in_progress");
                            const tourKey = `tour_seen_report_issue_${currentUserId}`;
                            if (!localStorage.getItem(tourKey)) {
                                localStorage.setItem(tourKey, "true");
                            }
                        }
                        isHandingOff.current = false;
                    },
                    steps: [
                        {
                            element: "#report-issue-btn",
                            popover: {
                                title: "Report an Issue",
                                description: "Click this anytime you run into a payment, technical, or delivery problem. Let's walk through it.",
                                onNextClick: (_el: any, _step: any, opts: any) => {
                                    setShowModal(true);
                                    setTimeout(() => opts.driver.moveNext(), 300);
                                },
                            },
                        },
                        { element: "#ticket-issue-type", popover: { title: "Issue Type", description: "Choose the category that best matches your issue." } },
                        { element: "#ticket-select-project", popover: { title: "Select Project", description: "Pick which project this issue relates to." } },
                        { element: "#ticket-target", popover: { title: "Target", description: "Choose whether this is about the platform itself, or your assigned engineer." } },
                        { element: "#ticket-description", popover: { title: "Description", description: "Describe the issue in detail so our team can resolve it quickly." } },
                        { element: "#ticket-upload-images", popover: { title: "Upload Images", description: "Attach screenshots if helpful — PNG, JPG, JPEG supported." } },
                        {
                            element: "#ticket-actions",
                            popover: {
                                title: "Submit Your Ticket",
                                description: "Once you're done, hit Submit. You can track its status anytime from this page.",
                                onNextClick: (_el: any, _step: any, opts: any) => {
                                    setShowModal(false);
                                    opts.driver.moveNext();
                                },
                            },
                        },
                        { element: "#tab-me", popover: { title: "ME", description: "Tickets you personally raised. Track their status here and update it if you reported the issue." } },
                        { element: "#tab-engineer", popover: { title: "ENGINEER", description: "Issues raised by the engineer working on this project — useful for staying aware of any blockers on their end." } },
                        {
                            element: `#tab-${roleTabs[2].toLowerCase()}`,
                            popover: {
                                title: roleTabs[2],
                                description: roleTabs[2] === "ADMIN"
                                    ? "Tickets raised by your admin team, kept here so you have full visibility into all reported issues across the project."
                                    : "Issues raised by clients on this project — helps you track concerns coming directly from them.",
                            },
                        },
                        // Status badge step — shows with element if tickets exist, else centered popover
                        ...(sortedTickets.length > 0
                            ? [{
                                element: "#ticket-status-badge",
                                popover: {
                                    title: "Tracking Ticket Status",
                                    description: "Each ticket shows its current status as a colored badge. If you raised the ticket, click the badge to change its status — Open, In Progress, Resolved, or Closed.",
                                    onNextClick: (_el: any, _step: any, opts: any) => {
                                        // Mark as handoff BEFORE destroy so onDestroyed skips cleanup
                                        isHandingOff.current = true;
                                        opts.driver.destroy();
                                        window.dispatchEvent(new Event("go-to-assets-tour"));
                                    },
                                },
                            }]
                            : [{
                                popover: {
                                    title: "Tracking Ticket Status",
                                    description: "Each ticket shows its current status as a colored badge. Click it to update — Open, In Progress, Resolved, or Closed.",
                                    onNextClick: (_el: any, _step: any, opts: any) => {
                                        isHandingOff.current = true;
                                        opts.driver.destroy();
                                        window.dispatchEvent(new Event("go-to-assets-tour"));
                                    },
                                },
                            }]
                        ),
                    ],
                });
                driverObj.drive();
            }, 500);

            return timer;
        };

        // Case 1: Handed off from the dashboard tour via sessionStorage flag
        if (sessionStorage.getItem("tour_in_progress") === "true") {
            const timer = startTour();
            return () => clearTimeout(timer);
        }

        // Case 2: First-time visitor (new user auto-tour)
        const tourKey = `tour_seen_report_issue_${currentUserId}`;
        if (!localStorage.getItem(tourKey)) {
            const timer = startTour();
            return () => clearTimeout(timer);
        }

        // Case 3: Manual "Start Tour" button — fired via event from Sidebar
        const handleManualTour = () => startTour();
        window.addEventListener("start-report-issue-tour", handleManualTour);
        return () => window.removeEventListener("start-report-issue-tour", handleManualTour);

    }, [currentUserId, sortedTickets.length]);

    const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]";

    if (loading)
        return (
            <div className="flex items-center justify-center py-12">
                <LucideLoader className="animate-spin" style={{ color: "var(--primary)" }} size={40} />
            </div>
        );

    const targetOptions = role === "ADMIN" ? ["Engineer"] : ["PLATFORM", "ENGINEER"];
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

    return (
        <div className="h-full w-full">
            <div className="px-2">
                <div className="rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                                Report Issue
                            </h2>
                            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                                Select a project to view and create tickets.
                            </p>
                        </div>
                        <button
                            id="report-issue-btn"
                            onClick={() => setShowModal(true)}
                            className="cursor-pointer group relative overflow-hidden rounded-xl px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, #FFAE58 0%, #FF9D2E 100%)",
                                boxShadow: "0 10px 25px rgba(255, 174, 88, 0.35)",
                            }}
                        >
                            <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                            <span className="relative flex items-center gap-2">
                                <AlertCircle size={16} />
                                Report Issue
                            </span>
                        </button>
                    </div>
                </div>

                {/* Guidelines */}
                <div
                    id="issue-guidelines"
                    className="rounded-lg p-4 border"
                    style={{ background: "var(--primary-light)", borderColor: "#ffd9a8" }}
                >
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                        Issue Reporting Guidelines
                    </h3>
                    <ul className="text-xs space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                        <li><strong>Project-Wide:</strong> General problems affecting the entire project</li>
                        <li><strong>Task-Specific:</strong> Problems related to individual tasks</li>
                    </ul>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 mt-2">
                    <div className="w-full shrink-0">
                        {/* Role Tabs */}
                        <div id="role-tabs" className="bg-white rounded-xl border border-[var(--border)] p-2 mb-3">
                            <div className="flex gap-2 overflow-x-auto">
                                {roleTabs.map((tab) => {
                                    const count = tickets.filter((ticket) => {
                                        const raisedRole = ticket.raisedBy?.role?.toUpperCase()?.trim() || "";
                                        if (tab === "ME") return ticket?.raisedById === currentUserId;
                                        if (ticket?.raisedById === currentUserId) return false;
                                        return raisedRole === tab;
                                    }).length;
                                    return (
                                        <button
                                            id={`tab-${tab.toLowerCase()}`}
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? "text-white" : "hover:bg-gray-100 text-gray-700"}`}
                                            style={activeTab === tab ? { background: "var(--primary)" } : {}}
                                        >
                                            <span>{tab}</span>
                                            <span className="text-xs opacity-80 px-2">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Ticket List */}
                        <div className="flex-1">
                            {filteredTickets.length === 0 ? (
                                fetchTicket ? (
                                    <div className="min-h-full w-full flex justify-center items-center">
                                        <Loader2 className="animate-spin" color="var(--primary)" />
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <AlertCircle className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--border)" }} />
                                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                            {activeTab === "ME" ? "You haven't reported any issues yet." : `No ${activeTab.toLowerCase()} issues found.`}
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="space-y-3">
                                    {sortedTickets.map((report: any, index: number) => (
                                        <div key={report.id} className="bg-white rounded-xl border border-[var(--border)] p-5">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle size={18} className="text-red-500" style={{ marginTop: 2 }} />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-4">
                                                            <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                                                                {report.issueType}
                                                            </span>
                                                        </div>
                                                        <div className="relative">
                                                            <button
                                                                id={index === 0 ? "ticket-status-badge" : undefined}
                                                                disabled={updating}
                                                                onClick={() => {
                                                                    if (updating) return;
                                                                    setOpenDropdownId((prev) => prev === report.id ? null : report.id);
                                                                }}
                                                                className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusColors[report.status]} ${updating ? "opacity-60 cursor-not-allowed" : ""}`}
                                                            >
                                                                {updating ? "Updating..." : report.status.replace("_", " ")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{report.description}</p>
                                                    <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Project: {report.project?.title}</p>
                                                    {report.images?.length > 0 && (
                                                        <div className="flex gap-2 mt-3 flex-wrap">
                                                            {report.images.map((img: string, i: number) => (
                                                                <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                                                                    <img src={img} alt="ticket" className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                                                        <span className="flex items-center gap-1"><User size={11} /> {report.raisedBy?.name || "User"}</span>
                                                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(report.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white text-black w-full max-w-md p-6 rounded-xl border border-[var(--border)] shadow-lg">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                            Raise a Ticket
                        </h3>
                        <div className="space-y-4">
                            <div id="ticket-issue-type">
                                <label className="block text-sm font-medium mb-1.5">Issue Type *</label>
                                <select
                                    value={newTicket.issueType}
                                    onChange={(e) => setNewTicket({ ...newTicket, issueType: e.target.value })}
                                    className={inputCls}
                                    disabled={creating}
                                >
                                    <option value="">Select issue type</option>
                                    <option value="PAYMENT">Payment</option>
                                    <option value="COMMUNICATION">Communication</option>
                                    <option value="TECHNICAL">Technical</option>
                                    <option value="DELIVERY">Delivery</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div id="ticket-select-project">
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                >
                                    <option value="" disabled>Select Project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div id="ticket-target">
                                <label className="block text-sm font-medium mb-1.5">Target *</label>
                                <div className="flex gap-4">
                                    {targetOptions.map((t) => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input
                                                type="radio"
                                                value={t}
                                                checked={newTicket.target === t}
                                                onChange={(e) => setNewTicket({ ...newTicket, target: e.target.value })}
                                                disabled={creating}
                                            />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div id="ticket-description">
                                <label className="block text-sm font-medium mb-1.5">Description *</label>
                                <textarea
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    className={`${inputCls} resize-none`}
                                    rows={4}
                                    placeholder="Describe the issue..."
                                    disabled={creating}
                                />
                            </div>

                            <div id="ticket-upload-images">
                                <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                                    Upload Images
                                </label>
                                <label
                                    htmlFor="ticket-images"
                                    className="group flex flex-col items-center justify-center w-full min-h-[140px] rounded-2xl border-2 border-dashed border-[#FFD4A6] bg-gradient-to-br from-[#FFF8F1] to-[#FFF3E6] cursor-pointer transition-all duration-300 hover:border-[#FFAE58] hover:shadow-[0_8px_30px_rgba(255,174,88,0.15)]"
                                >
                                    <input
                                        id="ticket-images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        disabled={creating}
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);

                                            const oversizedFiles = files.filter(
                                                (file) => file.size > MAX_FILE_SIZE
                                            );

                                            if (oversizedFiles.length > 0) {
                                                toast.error("Each file must be less than 20 MB.");
                                                e.target.value = "";
                                                return;
                                            }

                                            setNewTicket({
                                                ...newTicket,
                                                images: files,
                                            });
                                        }}
                                    />
                                    <div className="w-12 h-12 rounded-2xl bg-[#FFAE58]/15 flex items-center justify-center mb-3">
                                        <Upload className="w-6 h-6 text-[#FFAE58]" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800">Click to upload images</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG • Multiple files supported</p>
                                    {newTicket.images.length > 0 && (
                                        <div className="mt-5 grid grid-cols-3 gap-3 w-full px-4">
                                            {newTicket.images.map((file, index) => (
                                                <div key={index} className="relative group overflow-hidden rounded-xl border border-[#FFD4A6] bg-white">
                                                    <img src={URL.createObjectURL(file)} alt={file.name} className="h-24 w-full object-cover" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                                                        <p className="text-white text-[10px] truncate">{file.name}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setNewTicket((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
                                                        }}
                                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div id="ticket-actions" className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setShowModal(false); setSelectedProjectId(""); setNewTicket(getInitialTicket()); }}
                                className="px-4 py-2 border rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTicket}
                                disabled={creating || !newTicket.issueType || !newTicket.description.trim()}
                                className="px-4 py-2 text-white rounded-lg text-sm disabled:opacity-40"
                                style={{ background: "var(--primary)" }}
                            >
                                {creating ? "Submitting..." : "Submit Ticket"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientReportIssue;
