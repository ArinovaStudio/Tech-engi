"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileArchive, FileText, Plus, Loader2, Download, Eye, Trash2,
  Image as ImageIcon, Link as LinkIcon, ExternalLink, Copy, CopyCheck,
  Paperclip,
  X,
  EyeOff,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

// driver.js's default overlay can read as quite heavy, and the cutout
// around the active element sometimes looks "dulled" rather than crisp.
// This keeps the highlighted element at full brightness with a clean ring.
// Plain <style> (not styled-jsx) so it works regardless of project setup.
function TourStyleOverrides() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          .driver-active-element {
            filter: none !important;
            opacity: 1 !important;
            box-shadow: 0 0 0 3px var(--primary, #f97316) !important;
          }
          .driver-popover {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18) !important;
          }
          .driver-popover-footer button {
            border: none !important;
            color: #ffffff !important;
            text-shadow: none !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            padding: 6px 16px !important;
          }
          .driver-popover-prev-btn {
            background: var(--primary, #f97316) !important;
            opacity: 0.85;
          }
          .driver-popover-next-btn {
            background: var(--primary, #f97316) !important;
          }
          .driver-popover-prev-btn:hover,
          .driver-popover-next-btn:hover {
            background: var(--primary, #f97316) !important;
            opacity: 1 !important;
          }
          .driver-popover-prev-btn.driver-popover-btn-disabled {
            background: #e5e7eb !important;
            color: #9ca3af !important;
            opacity: 1 !important;
            cursor: not-allowed !important;
          }
        `,
      }}
    />
  );
}

interface Resource {
  id: string;
  title: string;
  type: "FILE" | "CREDENTIALS" | "IMAGE" | "LINK" | "TEXT";
  content: string;
  createdAt: string;
  addedBy: {
    name: string;
    image?: string;
  };
  isLocked?: boolean;
}


function AssetsCard({ resource, onDelete, isAdmin }: {
  resource: Resource;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const isFileType = resource.type === "FILE" || resource.type === "IMAGE";
  const isLink = resource.type === "LINK";

  const displayUrl = resource.content;
  const previewImage = resource.type === "IMAGE"
    ? resource.content
    : resource.type === "LINK"
      ? "/globe.svg"
      : "/placeholder-file.jpg";

  const handleDownload = async () => {
    if (!isFileType) return;

    try {
      const response = await fetch(resource.content);
      if (!response.ok) throw new Error("Failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resource.title.replace(/\s+/g, "_") +
        (resource.type === "IMAGE" ? ".jpg" : ".zip");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Downloaded successfully");
    } catch {
      toast.error("Download failed");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resource.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getIcon = () => {
    switch (resource.type) {
      case "IMAGE": return <ImageIcon size={14} style={{ color: "var(--text-muted)" }} />;
      case "FILE": return <FileArchive size={14} style={{ color: "var(--text-muted)" }} />;
      case "LINK": return <LinkIcon size={14} style={{ color: "var(--text-muted)" }} />;
      default: return <FileText size={14} style={{ color: "var(--text-muted)" }} />;
    }
  };

  const handleAction = () => {
    if (isLink) {
      try {
        let url = resource.content.trim();
        if (url && !url.startsWith("http")) url = "https://" + url;
        window.open(url, "_blank");
      } catch {
        window.open(resource.content, "_blank");
      }
    } else {
      handleDownload();
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-[var(--border)] overflow-hidden bg-white" style={{ height: "320px" }}>
      <Image
        src={previewImage}
        alt={resource.title}
        className="w-full h-full object-cover"
        width={320}
        height={320}
      />

      <div className="absolute bottom-0 w-full"
        style={{ background: "linear-gradient(to top, rgba(5,10,48,0.95) 60%, transparent)" }}>
        <div className="px-5 py-4">
          <p className="flex items-center gap-1.5 text-xs  mb-1" style={{ color: "var(--text-muted)" }}>
            {getIcon()} {resource.type}
          </p>

          <p className="text-white font-semibold  text-base line-clamp-2">
            {resource.title}
          </p>

          <p className="text-xs  mt-0.5" style={{ color: "var(--text-muted)" }}>
            Uploaded: {new Date(resource.createdAt).toLocaleDateString()}
          </p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border"
                style={{ background: "var(--primary-light)", borderColor: "#ffd9a8" }}>
                {resource.addedBy.image ? (
                  <Image
                    src={resource.addedBy.image}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>
                    {resource.addedBy.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <p className="text-xs  text-white">{resource.addedBy.name}</p>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => onDelete(resource.id)}
                  className="w-7 h-7 text-white hover:text-red-400 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <button
                onClick={resource.type === "LINK" ? copyToClipboard : () => window.open(displayUrl, "_blank")}
                className="w-7 h-7 text-white hover:text-[var(--primary)] flex items-center justify-center transition-colors"
              >
                {resource.type === "LINK" ?
                  (isCopied ? <CopyCheck size={16} /> : <Copy size={16} />) :
                  <Eye size={16} />
                }
              </button>

              <button
                onClick={handleAction}
                className="w-7 h-7 bg-white hover:scale-90 hover:bg-[var(--primary)] transition-all flex items-center justify-center rounded-full"
                style={{ color: "var(--text-primary)" }}
              >
                {isLink ? <ExternalLink size={12} /> : <Download size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssetsTab({ projectId }: { projectId: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"FILE" | "IMAGE" | "LINK" | "TEXT" | "CREDENTIALS">("IMAGE");
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Holds the active driver.js instance so the "open modal -> continue tour"
  // handoff can call .moveNext() / .destroy() on it from outside the effect.
  const tourRef = useRef<Driver | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    resourceId: string | null;
  }>({
    open: false,
    resourceId: null,
  });

  const [visibleCredentials, setVisibleCredentials] = useState<Record<string, boolean>>({});

  const [actionState, setActionState] = useState<{
    id: string | null;
    action: "copy" | "download" | null;
  }>({
    id: null,
    action: null,
  });

  const triggerSuccess = (
    resourceId: string,
    action: "copy" | "download"
  ) => {
    setActionState({
      id: resourceId,
      action,
    });

    setTimeout(() => {
      setActionState({
        id: null,
        action: null,
      });
    }, 1000);
  };

  const { data: session } = useSession();
  const role = session?.user?.role?.toUpperCase()?.trim() || "";
  const isAdmin = role === "ADMIN";
  const isEngineer = role === "ENGINEER";

  // Only Admin & Engineer can upload resources
  const canUpload = isAdmin || isEngineer;

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/resources?projectId=${projectId}&tab=assets`);
      const data = await res.json();

      if (data.success) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [projectId]);

  // ---------------------------------------------------------------------
  // TOUR
  // ---------------------------------------------------------------------
  // Flow: page steps (Resources heading -> table header -> a row -> Upload
  // Resource button) -> clicking "Next" on the Upload button step opens the
  // modal -> tour continues inside the modal (Title -> Type -> Dropzone ->
  // Upload button) -> destroy + mark as seen on close/finish.
  useEffect(() => {
    if (loading) return;
    if (!session?.user?.id) return;

    const tourKey = `tour_seen_assets_${session.user.id}`;

    const isHandoff =
      sessionStorage.getItem("start_assets_tour") === "true";

    const forced =
      sessionStorage.getItem("force_tour") === "true";

    if (
      !isHandoff &&
      !forced &&
      localStorage.getItem(tourKey)
    ) {
      return;
    }

    const hasRow = resources.length > 0;

    const steps: DriveStep[] = [
      {
        element: '[data-tour="assets-heading"]',
        popover: {
          title: "Resources",
          description:
            "This is where every file, image, link, note, and credential shared on this project lives.",
        },
      },

      ...(hasRow
        ? [
          {
            element:
              '[data-tour="assets-table-header"]',
            popover: {
              title: "Resource List",
              description:
                "Each resource shows its type, who added it, and when it was created.",
            },
          },
          {
            element:
              '[data-tour="assets-row-0"]',
            popover: {
              title: "Take an Action",
              description:
                "View, download, copy, or reveal a resource right from this row.",
            },
          },
        ]
        : []),

      ...(canUpload
        ? [
          {
            element:
              '[data-tour="upload-resource-btn"]',
            popover: {
              title: "Add a New Resource",
              description:
                "Click here to upload an image, file, link, note, or credentials.",

              onNextClick: (_el: Element | undefined, _step: DriveStep, opts: { driver: Driver }) => {
                setOpen(true);

                setTimeout(() => {
                  opts.driver.moveNext();
                }, 300);
              },
            },
          },
          {
            element:
              '[data-tour="upload-title-input"]',
            popover: {
              title: "Name Your Resource",
              description:
                "Give it a clear title.",
            },
          },
          {
            element:
              '[data-tour="upload-type-select"]',
            popover: {
              title: "Choose a Type",
              description:
                "Select Image, File, Link, Text Note, or Credentials.",
            },
          },
          {
            element:
              '[data-tour="upload-dropzone-or-content"]',
            popover: {
              title: "Add the Content",
              description:
                "Upload the file or paste the content.",
            },
          },
          {
            element:
              '[data-tour="upload-submit-btn"]',
            popover: {
              title: "Upload Resource",
              description:
                "Click Upload to save the resource.",
            },
          },
        ]
        : []),
    ];

    if (steps.length === 0) return;

    const tour = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.35,
      stagePadding: 6,
      stageRadius: 10,

      onDestroyed: () => {
        sessionStorage.removeItem(
          "start_assets_tour"
        );

        localStorage.setItem(
          tourKey,
          "true"
        );

        setOpen(false);

        window.dispatchEvent(
          new CustomEvent(
            "tour-go-to-tab",
            {
              detail: "Report Issue",
            }
          )
        );

        tourRef.current = null;
      },

      steps,
    });

    tourRef.current = tour;

    const timer = setTimeout(
      () => tour.drive(),
      isHandoff ? 0 : 600
    );

    return () => {
      clearTimeout(timer);
      tour.destroy();
      tourRef.current = null;
    };
  }, [
    loading,
    canUpload,
    resources.length,
    session?.user?.id,
  ]);

  const uploadResource = async () => {
    if (!title) return toast.error("Title is required");

    if ((type === "FILE" || type === "IMAGE") && !file) {
      return toast.error("File is required");
    }

    if ((type === "LINK" || type === "TEXT" || type === "CREDENTIALS") && !content) {
      return toast.error("Content is required");
    }

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("title", title);
    formData.append("type", type);

    if (type === "FILE" || type === "IMAGE") {
      formData.append("file", file!);
    } else {
      formData.append("content", content);
    }

    try {
      setUploading(true);
      const res = await fetch("/api/resources", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setOpen(false);
        setTitle(""); setFile(null); setContent("");
        await fetchResources();
        toast.success("Resource uploaded successfully!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const openDeleteModal = (resourceId: string) => {
    setDeleteModal({
      open: true,
      resourceId,
    });
  };

  const deleteResource = async (resourceId: string) => {
    try {
      const res = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        await fetchResources();
        toast.success("Resource deleted");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.resourceId) return;

    try {
      setDeleting(true);

      await deleteResource(deleteModal.resourceId);

      setDeleteModal({
        open: false,
        resourceId: null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  // If the user closes/cancels the modal mid-tour, kill the tour gracefully
  // instead of leaving it pointed at a now-unmounted element.
  const closeUploadModal = () => {
    setOpen(false);
    if (tourRef.current) {
      tourRef.current.destroy();
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-[var(--border)]  text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]";
  const labelCls = "block text-sm font-medium  mb-1.5";

  return (
    <div className="space-y-6">
      <TourStyleOverrides />
      <div className="flex justify-between items-center">
        <h2 data-tour="assets-heading" className="text-2xl font-bold " style={{ color: "var(--text-primary)" }}>Resources</h2>

        {canUpload && (
          <button
            data-tour="upload-resource-btn"
            onClick={() => setOpen(true)}
            className="px-4 py-2 text-white rounded-lg flex items-center gap-2  text-sm"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={16} /> Upload Resource
          </button>
        )}
      </div>

      {loading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <Loader2
            className="animate-spin"
            style={{ color: "var(--primary)" }}
            size={40}
          />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500">
          No resources uploaded yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

          {/* HEADER */}
          <div data-tour="assets-table-header" className="grid grid-cols-12 gap-4 px-5 py-4 border-b bg-gray-50 font-semibold text-sm text-gray-600">
            <div className="col-span-4">Resource</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Added By</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* ROWS */}
          {resources.map((resource, index) => (
            <div
              key={resource.id}
              data-tour={index === 0 ? "assets-row-0" : undefined}
              className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition"
            >

              {/* RESOURCE */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">

                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  {resource.type === "IMAGE" ? (
                    <ImageIcon size={18} />
                  ) : resource.type === "FILE" ? (
                    <FileArchive size={18} />
                  ) : resource.type === "LINK" ? (
                    <LinkIcon size={18} />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  {resource.type === "CREDENTIALS" &&
                    visibleCredentials[resource.id] ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-yellow-800">
                        {resource.content}
                      </pre>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium truncate">
                        {resource.title}
                      </p>

                      {(resource.type === "LINK" ||
                        resource.type === "TEXT") && (
                          <p className="text-xs text-gray-500 truncate">
                            {resource.content}
                          </p>
                        )}
                    </>
                  )}
                </div>
              </div>

              {/* TYPE */}
              <div className="col-span-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
          ${resource.type === "IMAGE"
                      ? "bg-green-100 text-green-700"
                      : resource.type === "FILE"
                        ? "bg-blue-100 text-blue-700"
                        : resource.type === "LINK"
                          ? "bg-purple-100 text-purple-700"
                          : resource.type === "CREDENTIALS"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {resource.type}
                </span>
              </div>

              {/* USER */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border">
                  {resource.addedBy?.image ? (
                    <Image
                      src={resource.addedBy.image}
                      alt={resource.addedBy.name}
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 text-xs font-bold">
                      {resource.addedBy?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <span className="text-sm truncate">
                  {resource.addedBy?.name}
                </span>
              </div>

              {/* DATE */}
              <div className="col-span-2 text-sm text-gray-500">
                {new Date(resource.createdAt).toLocaleDateString()}
              </div>

              {/* ACTIONS */}
              <div className="col-span-2 flex justify-end gap-2">

                {/* FILE / IMAGE */}
                {(resource.type === "FILE" ||
                  resource.type === "IMAGE") && (
                    <>
                      <button
                        onClick={() =>
                          window.open(resource.content, "_blank")
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Eye size={16} />
                      </button>

                      <a
                        href={resource.content}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          triggerSuccess(resource.id, "download")
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        {actionState.id === resource.id &&
                          actionState.action === "download" ? (
                          <Check
                            size={16}
                            className="text-green-600"
                          />
                        ) : (
                          <Download size={16} />
                        )}
                      </a>
                    </>
                  )}

                {/* LINK */}
                {resource.type === "LINK" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        resource.content
                      );

                      triggerSuccess(resource.id, "copy");
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    {actionState.id === resource.id &&
                      actionState.action === "copy" ? (
                      <Check
                        size={16}
                        className="text-green-600"
                      />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}

                {/* TEXT */}
                {resource.type === "TEXT" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        resource.content
                      );

                      triggerSuccess(resource.id, "copy");
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    {actionState.id === resource.id &&
                      actionState.action === "copy" ? (
                      <Check
                        size={16}
                        className="text-green-600"
                      />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}

                {/* CREDENTIALS */}
                {resource.type === "CREDENTIALS" && (
                  <button
                    onClick={() =>
                      setVisibleCredentials((prev) => ({
                        ...prev,
                        [resource.id]:
                          !prev[resource.id],
                      }))
                    }
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    {visibleCredentials[resource.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                )}

                {/* DELETE */}
                {isAdmin && (
                  <button
                    onClick={() =>
                      openDeleteModal(resource.id)
                    }
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {resources.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No resources found
            </div>
          )}
        </div>
      )}

      {/* Upload Modal - Only show CREDENTIALS option to Admin & Engineer */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-black">
          <div className="bg-white p-6 rounded-xl max-w-md w-full border border-[var(--border)] shadow-lg">
            <h2 className="text-lg font-semibold  mb-4">Upload Resource</h2>

            <input
              data-tour="upload-title-input"
              type="text"
              placeholder="Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputCls} mb-4`}
            />

            <label className={labelCls}>Type</label>
            <select
              data-tour="upload-type-select"
              className={`${inputCls} mb-4`}
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="IMAGE">Image</option>
              <option value="FILE">File (ZIP, PDF, etc.)</option>
              <option value="LINK">Link</option>
              <option value="TEXT">Text Note</option>
              {/* Hide Credentials option from Clients (though they shouldn't reach here) */}
              {(isAdmin || isEngineer) && (
                <option value="CREDENTIALS">Credentials</option>
              )}
            </select>

            {(type === "FILE" || type === "IMAGE") ? (
              <div
                data-tour="upload-dropzone-or-content"
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setDragActive(false);

                  const droppedFile = e.dataTransfer.files?.[0];

                  if (droppedFile) {
                    setFile(droppedFile);
                  }
                }}
                className={`relative mb-4 rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${dragActive
                  ? "border-[var(--primary)] bg-orange-50"
                  : "border-gray-300 bg-gray-50"
                  }`}
              >
                {/* HIDDEN INPUT */}
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Paperclip
                    size={28}
                    className="text-[var(--primary)]"
                  />

                  <div>
                    <p className="text-sm font-medium text-black">
                      Drag & drop file here
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      or click to browse
                    </p>
                  </div>

                  {/* FILE PREVIEW */}
                  {file && (
                    <div className="relative mt-4 w-full rounded-xl border bg-white p-3">

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="absolute top-2 right-2 rounded-full bg-gray-100 p-1 hover:bg-red-100 transition"
                      >
                        <X
                          size={14}
                          className="text-gray-600 hover:text-red-600"
                        />
                      </button>

                      {file.type.startsWith("image/") ? (
                        <div className="space-y-3">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="max-h-52 w-full object-cover rounded-lg border"
                          />

                          <div className="text-xs text-gray-600 break-all">
                            {file.name}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Paperclip
                              size={18}
                              className="text-gray-600"
                            />
                          </div>

                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-black truncate">
                              {file.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                data-tour="upload-dropzone-or-content"
                placeholder={
                  type === "LINK" ? "Paste URL..." :
                    type === "CREDENTIALS" ? "Username / Password / Notes..." :
                      "Enter content..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`${inputCls} mb-4 min-h-[100px] resize-y`}
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeUploadModal}
                className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg  text-sm"
              >
                Cancel
              </button>
              <button
                data-tour="upload-submit-btn"
                disabled={uploading}
                onClick={uploadResource}
                className="px-4 py-2 text-white rounded-lg flex items-center gap-2  text-sm disabled:opacity-40"
                style={{ background: "var(--primary)" }}
              >
                {uploading && <Loader2 className="animate-spin" size={14} />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">

            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-black">
                  Delete Resource
                </h2>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Are you sure you want to delete this resource?
                  This action cannot be undone.
                </p>
              </div>

              <button
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    resourceId: null,
                  })
                }
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    resourceId: null,
                  })
                }
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
