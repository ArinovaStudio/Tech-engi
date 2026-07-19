"use client";
import { AlertCircle, LucideLoader, Upload, Download, Copy, Check, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const getTypeBadgeClass = (type: string) => {
    switch (type) {
        case "FILE": return "bg-slate-100 text-slate-700 border border-slate-200";
        case "IMAGE": return "bg-green-100 text-green-700 border border-green-200";
        case "LINK": return "bg-purple-100 text-purple-700 border border-purple-200";
        case "TEXT": return "bg-amber-100 text-amber-700 border border-amber-200";
        case "CREDENTIALS": return "bg-red-100 text-red-700 border border-red-200";
        default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
};

const ProjectAssets = () => {
    const { user } = useAuth() as { user: { id: string } };
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState("ALL");
    const [assetLoading, setAssetLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("ALL");
    const isHandingOff = useRef(false);
    const [resource, setResource] = useState({
        projectId: "",
        title: "",
        type: "FILE",
        content: "",
        isLocked: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [actionState, setActionState] = useState<{
        id: string | null;
        action: "copy" | "download" | null;
    }>({ id: null, action: null });

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

    const handleCreateResource = async () => {
        try {
            setAssetLoading(true);
            let content = resource.content;

            if (["IMAGE", "FILE"].includes(resource.type) && selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);
                const uploadRes = await fetch("/api/client/project-resources/upload", {
                    method: "POST",
                    body: uploadFormData,
                });
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok || !uploadData.success) {
                    return toast.error(uploadData.message || "Failed to upload file");
                }
                content = uploadData.url;
            }

            const formData = new FormData();
            formData.append("projectId", selectedProjectId);
            formData.append("title", resource.title);
            formData.append("type", resource.type);
            formData.append("content", content);
            formData.append("isLocked", resource.isLocked.toString());

            const res = await fetch("/api/client/project-resources", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok || !data.success) {
                return toast.error(data.message || "Failed to create resource");
            }

            toast.success("Resource created successfully");
            setResource({ projectId: "", title: "", type: "FILE", content: "", isLocked: false });
            setSelectedFile(null);
            setShowModal(false);
            fetchProjects();
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setAssetLoading(false);
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Tour useEffect — three cases: sessionStorage handoff, first-time visitor, manual event
    useEffect(() => {
        if (!user?.id) return;
        if (loading) return;
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

                        if (!isHandingOff.current) {
                            sessionStorage.removeItem("tour_in_progress");

                            const tourKey = `tour_seen_assets_${user.id}`;
                            if (!localStorage.getItem(tourKey)) {
                                localStorage.setItem(tourKey, "true");
                            }
                        }

                        isHandingOff.current = false;
                    },
                    steps: [
                        {
                            element: "#upload-assets-btn",
                            popover: {
                                title: "Upload Assets",
                                description: "Click here anytime to add a new file, image, link, text snippet, or credentials to a project. Let's walk through it.",
                                onNextClick: (_el: any, _step: any, opts: any) => {
                                    setShowModal(true);
                                    setTimeout(() => opts.driver.moveNext(), 300);
                                },
                            },
                        },
                        { element: "#asset-guidelines", popover: { title: "Upload Guidelines", description: "A quick reference for what kinds of files and assets you can upload, and how to keep them organized." } },
                        { element: "#asset-select-project", popover: { title: "Project", description: "Choose which project this resource belongs to." } },
                        { element: "#asset-resource-title", popover: { title: "Resource Title", description: "Give the asset a clear, descriptive name so it's easy to find later." } },
                        { element: "#asset-resource-type", popover: { title: "Resource Type", description: "Choose the kind of resource — File, Image, Link, Text, or Credentials. The form below adjusts based on your choice." } },
                        { element: "#asset-upload-input", popover: { title: "Upload File", description: "Select the actual file or image to upload from your device." } },
                        {
                            element: "#asset-actions",
                            popover: {
                                title: "Create Your Resource",
                                description: "Once everything's filled in, hit Create Resource. You'll see it appear in the table right away.",
                                onNextClick: (_el: any, _step: any, opts: any) => {
                                    setShowModal(false);
                                    opts.driver.moveNext();
                                },
                            },
                        },
                        { element: "#asset-filters", popover: { title: "Search & Filter", description: "Quickly find resources by name, project, or type using these controls." } },
                        {
                            element: "#asset-table",
                            popover: {
                                title: "All Resources",
                                description:
                                    "Every uploaded asset lives here, with quick actions to download files, copy links/text, or reveal credentials.",
                                onNextClick: (_el, _step, opts) => {
                                    isHandingOff.current = true;
                                    opts.driver.destroy();
                                    window.dispatchEvent(new Event("go-to-payout-tour"));
                                },
                            },
                        }
                    ],
                });
                driverObj.drive();
            }, 500);

            return timer;
        };

        // Case 1: Handed off from Report Issue tour via sessionStorage
        if (sessionStorage.getItem("tour_in_progress") === "true") {
            startTour();
            return;
        }

        // Case 2: First-time visitor
        const tourKey = `tour_seen_assets_${user.id}`;
        if (!localStorage.getItem(tourKey)) {
            const timer = startTour();
            return () => clearTimeout(timer);
        }

        // Case 3: Manual "Start Tour" button — fired via event from Sidebar
        const handleManualTour = () => startTour();
        window.addEventListener("start-assets-tour", handleManualTour);
        return () => window.removeEventListener("start-assets-tour", handleManualTour);

    }, [user?.id, loading]);

    const allResources = projects.flatMap((project: any) =>
        (project.resources || []).map((r: any) => ({ ...r, projectTitle: project.title }))
    );

    const truncateText = (text: string, length = 35) => {
        if (!text) return "-";
        return text.length > length ? `${text.substring(0, length)}...` : text;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        });
    };

    const triggerSuccess = (resourceId: string, action: "copy" | "download") => {
        setActionState({ id: resourceId, action });
        setTimeout(() => setActionState({ id: null, action: null }), 1000);
    };

    const projectOptions = ["ALL", ...new Set(allResources.map((r: any) => r.projectTitle))];
    const typeOptions = ["ALL", ...new Set(allResources.map((r: any) => r.type))];

    const filteredResources = allResources.filter((r: any) => {
        const searchMatch =
            (r.fileName || r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        const projectMatch = selectedProject === "ALL" || r.projectTitle === selectedProject;
        const typeMatch = selectedType === "ALL" || r.type === selectedType;
        return searchMatch && projectMatch && typeMatch;
    });

    const MAX_FILE_SIZE = 200 * 1024 * 1024;

    if (loading)
        return (
            <div className="flex items-center justify-center py-12 w-full h-screen">
                <LucideLoader className="animate-spin" style={{ color: "var(--primary)" }} size={40} />
            </div>
        );

    return (
        <div className="w-full h-full flex flex-1 flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                        Upload Assets
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                        Select a project and upload assets.
                    </p>
                </div>
                <button
                    id="upload-assets-btn"
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
                        Upload Assets
                    </span>
                </button>
            </div>

            {/* Guidelines */}
            <div id="asset-guidelines" className="rounded-lg p-4 border" style={{ background: "var(--primary-light)", borderColor: "#ffd9a8" }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Asset Upload Guidelines</h3>
                <ul className="text-xs space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                    <li><strong>Images:</strong> Upload design mockups, screenshots, references, banners, and other visual assets.</li>
                    <li><strong>Documents & Files:</strong> Upload project requirements, PDFs, spreadsheets, presentations, source files, and other supporting materials.</li>
                    <li><strong>Organization:</strong> Use clear file names to help team members quickly identify and access assets.</li>
                </ul>
            </div>

            {/* Filters */}
            <div id="asset-filters" className="mt-5 mb-4 flex flex-col lg:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-orange-400 focus:border-orange-500"
                />
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="px-4 py-3 rounded-xl border">
                    {projectOptions.map((project) => (
                        <option key={project} value={project}>{project === "ALL" ? "All Projects" : project}</option>
                    ))}
                </select>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-4 py-3 rounded-xl border">
                    {typeOptions.map((type) => (
                        <option key={type} value={type}>{type === "ALL" ? "All Types" : type}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div id="asset-table" className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-600 dark:text-gray-300">
                    <div className="col-span-4">Resource Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Project</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {filteredResources.length > 0 ? (
                    filteredResources.map((r: any) => (
                        <div key={r.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                            <div className="col-span-4 min-w-0">
                                {r.type === "CREDENTIALS" && visibleCredentials[r.id] ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2">
                                        <pre className="text-xs whitespace-pre-wrap overflow-hidden truncate font-mono text-yellow-800 dark:text-yellow-200">{r.content}</pre>
                                    </div>
                                ) : (
                                    <p className="font-medium text-sm truncate" title={r.fileName || r.title || "Untitled Resource"}>
                                        {truncateText(r.fileName || r.title || "Untitled Resource")}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClass(r.type)}`}>
                                    {r.type}
                                </span>
                            </div>
                            <div className="col-span-3 truncate text-sm text-gray-700 dark:text-gray-300" title={r.projectTitle}>{r.projectTitle}</div>
                            <div className="col-span-2 text-sm text-gray-500 dark:text-slate-400">{formatDate(r.createdAt)}</div>
                            <div className="col-span-1 flex justify-end">
                                {(r.type === "FILE" || r.type === "IMAGE") && (
                                    <a
                                        href={r.content}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => triggerSuccess(r.id, "download")}
                                        className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${actionState.id === r.id && actionState.action === "download" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600"}`}
                                    >
                                        {actionState.id === r.id && actionState.action === "download" ? <><Check size={14} />Downloading...</> : <><Download size={14} />Download</>}
                                    </a>
                                )}
                                {r.type === "LINK" && (
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(r.content); triggerSuccess(r.id, "copy"); }}
                                        className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${actionState.id === r.id && actionState.action === "copy" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600"}`}
                                    >
                                        {actionState.id === r.id && actionState.action === "copy" ? <><Check size={14} />Copied!</> : <><Copy size={14} />Copy Link</>}
                                    </button>
                                )}
                                {r.type === "TEXT" && (
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(r.content); triggerSuccess(r.id, "copy"); }}
                                        className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${actionState.id === r.id && actionState.action === "copy" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-600"}`}
                                    >
                                        {actionState.id === r.id && actionState.action === "copy" ? <><Check size={14} />Copied!</> : <><Copy size={14} />Copy Text</>}
                                    </button>
                                )}
                                {r.type === "CREDENTIALS" && (
                                    <button
                                        onClick={() => setVisibleCredentials((prev) => ({ ...prev, [r.id]: !prev[r.id] }))}
                                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        {visibleCredentials[r.id] ? <><EyeOff size={14} />Hide</> : <><Eye size={14} />View</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 dark:text-slate-400">No resources found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto dark:bg-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Create Project Resource</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100">✕</button>
                        </div>

                        <div className="space-y-5">
                            <div id="asset-select-project">
                                <label className="block text-sm font-semibold mb-2">Project</label>
                                <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full px-4 py-3 rounded-xl border">
                                    <option value="">Select Project</option>
                                    {projects.map((project: any) => (
                                        <option key={project.id} value={project.id}>{project.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div id="asset-resource-title">
                                <label className="block text-sm font-semibold mb-2">Resource Title</label>
                                <input
                                    type="text"
                                    value={resource.title}
                                    onChange={(e) => setResource({ ...resource, title: e.target.value })}
                                    placeholder="Enter title"
                                    className="w-full px-4 py-3 rounded-xl border"
                                />
                            </div>

                            <div id="asset-resource-type">
                                <label className="block text-sm font-semibold mb-2">Resource Type</label>
                                <p className="text-xs text-gray-500 mb-2 dark:text-slate-400">
                                    Maximum upload file size: <span className="font-medium">200 MB</span> (for File and Image resources).
                                </p>
                                <select
                                    value={resource.type}
                                    onChange={(e) => setResource({ ...resource, type: e.target.value, content: "" })}
                                    className="w-full px-4 py-3 rounded-xl border"
                                >
                                    <option value="FILE">File</option>
                                    <option value="IMAGE">Image</option>
                                    <option value="LINK">Link</option>
                                    <option value="TEXT">Text</option>
                                    <option value="CREDENTIALS">Credentials</option>
                                </select>
                            </div>

                            {["IMAGE", "FILE"].includes(resource.type) && (
                                <div id="asset-upload-input">
                                    <label className="block text-sm font-semibold mb-2">Upload {resource.type}</label>
                                    <input
                                        type="file"
                                        accept={resource.type === "IMAGE" ? "image/*" : "*"}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (!file) return;

                                            if (file.size > MAX_FILE_SIZE) {
                                                toast.error("File size must not exceed 200 MB.");
                                                e.target.value = ""; // Clear the input
                                                return;
                                            }

                                            setSelectedFile(file);
                                        }}
                                        className="w-full"
                                    />
                                    {selectedFile && (
                                        <div className="mt-3">
                                            {resource.type === "IMAGE" ? (
                                                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-32 rounded-lg border" />
                                            ) : (
                                                <div className="text-sm text-green-600">{selectedFile.name}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {resource.type === "LINK" && (
                                <input
                                    type="url"
                                    value={resource.content}
                                    onChange={(e) => setResource({ ...resource, content: e.target.value })}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 rounded-xl border"
                                />
                            )}

                            {resource.type === "TEXT" && (
                                <textarea
                                    rows={6}
                                    value={resource.content}
                                    onChange={(e) => setResource({ ...resource, content: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border"
                                    placeholder="Enter text..."
                                />
                            )}

                            {resource.type === "CREDENTIALS" && (
                                <textarea
                                    rows={6}
                                    value={resource.content}
                                    onChange={(e) => setResource({ ...resource, content: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border font-mono"
                                    placeholder="Email: admin@test.com Password: Test@123"
                                />
                            )}

                            <div id="asset-actions" className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border rounded-xl">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateResource}
                                    disabled={assetLoading || !selectedProjectId || !resource.title}
                                    className={`px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-300 ${assetLoading || !selectedProjectId || !resource.title ? "bg-gray-400 cursor-not-allowed opacity-70" : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-95 cursor-pointer"}`}
                                >
                                    {assetLoading ? (
                                        <span className="flex items-center gap-2">
                                            <LucideLoader size={16} className="animate-spin" />
                                            Creating...
                                        </span>
                                    ) : "Create Resource"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectAssets;
