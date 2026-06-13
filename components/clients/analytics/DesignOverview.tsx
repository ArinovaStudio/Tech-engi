// 'use client';

// import { useState } from 'react';
// import { ArrowRight } from 'lucide-react';

// const DesignOverview = ({ data }: { data: any }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   if (!data) return (
//     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-500 mt-4">
//       No Design System uploaded yet.
//     </div>
//   );

//   const val = (v: any) => Array.isArray(v) ? v.join(', ') : (typeof v === 'object' && v ? Object.keys(v).join(', ') : v) || 'Not set';

//   const slides = [
//     [{ label: 'Brand Name', value: val(data.brandName) }, { label: 'Design Type', value: val(data.designType) }, { label: 'Brand Feel', value: val(data.brandFeel) }],
//     [{ label: 'Content Tone', value: val(data.contentTone) }, { label: 'Theme', value: val(data.theme) }, { label: 'Key Pages', value: val(data.keyPages) }],
//     [{ label: 'Fonts', value: val(data.fonts) }, { label: 'Layout Style', value: val(data.layoutStyle) }, { label: 'Visual Guidelines', value: val(data.visualGuidelines) }],
//     [{ label: 'Uniqueness', value: val(data.uniqueness) }],
//   ];

//   return (
//     <div className="dark:bg-gray-900 mt-6">
//       <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 relative">
//         <div className="absolute -top-3 left-6">
//           <span className="bg-blue-500 text-white px-4 py-1 rounded-sm text-sm font-medium">Design System</span>
//         </div>

//         <div className="mt-4 space-y-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Colors</h3>
//             <div className="flex gap-2">
//               {(data.colors ?? []).map((color: string, i: number) => (
//                 <div
//                   key={i}
//                   className="group flex items-center h-8 w-8 hover:w-24 px-2 rounded-full border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
//                   style={{ backgroundColor: color }}
//                 >
//                   <span className="ml-2 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
//                     {color.toUpperCase()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="overflow-hidden relative h-32">
//             <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
//               {slides.map((slide, i) => (
//                 <div key={i} className="min-w-full space-y-4 pr-4">
//                   {slide.map((item, j) => (
//                     <div key={j} className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
//                       <span className="text-sm font-medium text-gray-900 dark:text-white max-w-sm truncate" title={item.value}>{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               onClick={() => setCurrentSlide(p => (p + 1) % slides.length)}
//               className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 py-1 px-4 rounded-full flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
//             >
//               <span className="font-medium">Next Attributes</span>
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DesignOverview;

'use client';

import { useState } from "react";
import { ArrowRight, LucideEdit3 } from "lucide-react";
import { T, inputCls, selectCls, labelStyle, getApiBase } from "@/components/project/OverviewUI";
import toast from "react-hot-toast";

const staticDesignData = {
  brandName: "Tech Engi",
  designType: "Modern SaaS Platform",
  brandFeel: "Premium, Futuristic, Clean",

  contentTone: "Professional & Technical",
  theme: "Dark Minimal",
  keyPages: ["Home", "Projects", "Dashboard", "Analytics"],

  fonts: ["Inter", "ID Grotesk", "DM Serif"],
  layoutStyle: "Grid Based",
  visualGuidelines: "Soft shadows, rounded cards, clean spacing",

  uniqueness: "Engineering focused collaboration platform",

  colors: [
    "#2563EB",
    "#0F172A",
    "#F59E0B",
    "#14B8A6",
    "#FFFFFF",
  ],
};

const DesignOverview = ({ data }: { data: any }) => {
  const project = data?.[0];
  const designSystem = project?.designSystem || {};
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editModel, setEditModel] = useState(false);
  const [techArea, setTechArea] = useState("");
  const [techName, setTechName] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [designSystems, setDesignSystems] = useState({
    brandName: "",
    colors: [] as string[],

    fonts: {
      primary: "",
      secondary: "",
    },

    designType: [] as string[],

    layoutStyle: {} as Record<string, string>,

    contentTone: [] as string[],

    visualGuidelines: {} as Record<string, string>,

    theme: [] as string[],

    brandFeel: "",

    keyPages: [] as string[],

    uniqueness: {
      differentiator: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [technology, setTechnology] = useState<
    { area: string; tech: string }[]
  >([]);
  const [layoutKey, setLayoutKey] = useState("");
  const [layoutValue, setLayoutValue] = useState("");
  const [visualKey, setVisualKey] = useState("");
  const [visualValue, setVisualValue] = useState("");
  const [keyPagesInput, setKeyPagesInput] = useState("");

  // console.log( technology, "technology", designSystems, "designsystes");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiBase = "/api/client/desingsystem";
    const action = "UPDATE_PROGRESS"

    try {
      const payload: any = { projectId: project.id, techArea, techName, colorInput, technology, designSystem: designSystems, action };

      const res = await fetch(`${apiBase}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload,),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Project updated successfully");
        setEditModel(false);
        window.location.reload();
      } else { toast.error(data.message || "Failed to update project"); }
    } catch { toast.error("Failed to update project"); }
    finally { setLoading(false); }
  };

  const val = (v: any) =>
    Array.isArray(v)
      ? v.join(", ")
      : typeof v === "object" && v
        ? Object.keys(v).join(", ")
        : v || "Not set";

  const slides = [
    [
      { label: "Brand Name", value: designSystem?.brandName || "" },
      { label: "Brand Feel", value: designSystem?.brandFeel || "" },
      { label: "Theme", value: designSystem?.theme?.[0] || "" },
    ],
    [
      { label: "Primary Font", value: designSystem?.fonts?.primary || "" },
      { label: "Secondary Font", value: designSystem?.fonts?.secondary || "" },
    ],
    [
      { label: "Design Type", value: designSystem?.designType?.[0] || "" },
      { label: "Content Tone", value: designSystem?.contentTone?.[0] || "" },
    ],
    [
      { label: "Key Pages", value: designSystem?.keyPages?.join(", ") || "" },
      {
        label: "Uniqueness",
        value: designSystem?.uniqueness?.differentiator || "",
      },
    ],
  ];

  const projectsData = data?.[0]

  const remainingDays = data?.[0]?.endDate
    ? Math.max(
      0,
      Math.ceil(
        (new Date(data[0].endDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
      )
    )
    : null;

  const daysDifference = data?.[0]?.endDate
    ? Math.ceil(
      (new Date(data[0].endDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    )
    : null;

  // Create filtered slides first
  const validSlides = slides
    .map((slide) =>
      slide.filter(
        (item) =>
          item.value !== null &&
          item.value !== undefined &&
          String(item.value).trim() !== ""
      )
    )
    .filter((slide) => slide.length > 0);

  const daysText =
    daysDifference === null
      ? "No deadline"
      : daysDifference >= 0
        ? `${daysDifference} days left`
        : `${Math.abs(daysDifference)} days delayed`;

  const hasAnyData =
    (project?.technology?.length ?? 0) > 0 ||
    (validSlides?.length ?? 0) > 0 ||
    (designSystem?.colors?.length ?? 0) > 0;

  return (
    <div className="dark:bg-gray-900 mt-10 flex gap-6 items-stretch">
      <div className="w-[35%] h-[380px] bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 relative">

        <div className="absolute top-0 left-6 -translate-y-1/2 z-20">
          <span className="bg-blue-500 text-white px-5 py-2 leading-none rounded-md text-sm font-medium whitespace-nowrap">
            Design System
          </span>
        </div>

        <div className="mt-4 space-y-6">

          {/* Colors */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Colors
              </h3>
              {!hasAnyData && (
                <button
                  onClick={() => setEditModel(true)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <LucideEdit3 size={16} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {designSystem?.colors?.length ? (
                designSystem.colors.map((color: string, i: number) => (
                  <div
                    key={i}
                    className="group flex items-center h-8 w-8 hover:w-24 px-2 rounded-full border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
                    style={{ backgroundColor: color }}
                  >
                    <span className="ml-2 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
                      {color.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400">No colors</span>
              )}
            </div>
          </div>

          {/* Slides */}
          {validSlides.length === 0 ? (
            <div className="h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No Design System
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden relative h-32">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {validSlides.map((slide, i) => (
                    <div key={i} className="min-w-full space-y-4 pr-4">
                      {slide.map((item, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.label}
                          </span>

                          <span
                            className="text-sm font-medium text-gray-900 dark:text-white max-w-sm truncate"
                            title={String(item.value)}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Show button only when there are multiple slides */}
              {validSlides.length > 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      setCurrentSlide((p) => (p + 1) % validSlides.length)
                    }
                    className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 py-1 px-4 rounded-full flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <span className="font-medium">Next Attributes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <div className="w-[65%] h-[370px] rounded-[24px] border border-[#d6d6d6] bg-[#f5f5f5] overflow-hidden">

        <div className="grid grid-cols-3 h-full">

          {/* LEFT SECTION */}
          <div className="p-5 border-r border-[#d6d6d6] flex flex-col gap-30">

            {/* Status */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#18d10f] bg-[#dfffdc]">
                <div className="w-2 h-2 rounded-full bg-[#18d10f]" />

                <span className="text-[#18d10f] text-[14px] font-semibold font-id">
                  On Time
                </span>
              </div>
            </div>

            {/* Days */}
            <div>
              <h2 className="text-[30px] leading-none font-black text-black font-id">
                <p
                  className={
                    daysDifference === null
                      ? "text-gray-500"
                      : daysDifference >= 0 ||
                        ["COMPLETED", "CLOSED"].includes(data?.[0]?.status?.toUpperCase())
                        ? "text-green-600"
                        : "text-red-600"
                  }
                >
                  {daysDifference === null
                    ? "No deadline"
                    : daysDifference >= 0
                      ? `${daysDifference} days left`
                      : ["COMPLETED", "CLOSED"].includes(
                        data?.[0]?.status?.toUpperCase()
                      )
                        ? "Completed"
                        : `${Math.abs(daysDifference)} days delayed`}
                </p>
              </h2>

              <div className="w-full h-[4px] bg-[#8A16D8] mt-4" />

              <p className="text-right text-[14px] text-[#7d7d7d] mt-2 font-id">
                Days Remaining
              </p>
            </div>

          </div>

          {/* CENTER SECTION */}
          <div className="p-5 border-r border-[#d6d6d6]">

            <div>
              <h3 className="text-[18px] font-medium text-[#7d7d7d] font-id">
                Current Phase
              </h3>

              <div className="w-full h-0.5 bg-[#d6d6d6] mt-2 mb-5" />

              <div className="bg-gradient-to-r from-[#B14FFF] to-[#A34CF3] rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-white text-[18px]">✎</span>

                <span className="text-white text-[18px] font-semibold font-id">
                  {project?.currentPhase?.length
                    ? project.currentPhase[0]
                    : "Not Started"}
                </span>
              </div>
            </div>

            <div className="w-full h-0.5 bg-[#d6d6d6] mt-2 mb-5" />
          </div>

          {/* RIGHT SECTION */}
          <div className="p-5">

            <h3 className="text-[18px] font-medium text-[#7d7d7d] font-id">
              Technology Used
            </h3>

            <div className="w-full h-0.5 bg-[#d6d6d6] mt-2 mb-5" />

            <div className="space-y-4">

              {project?.technology?.length ? (
                Object.entries(
                  project.technology.reduce((acc: any, item: any) => {
                    if (!item?.area) return acc;

                    if (!acc[item.area]) {
                      acc[item.area] = [];
                    }

                    acc[item.area].push(item.tech);

                    return acc;
                  }, {})
                ).map(([area, techs]: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-3">

                    <span className="text-[15px] text-[#8a8a8a] font-id">
                      {area}
                    </span>

                    <span className="text-[15px] text-black font-semibold font-id text-right capitalize">
                      {techs.join(", ")}
                    </span>

                  </div>
                ))
              ) : (
                <span className="text-[15px] text-[#8a8a8a] font-id">
                  No technologies specified
                </span>
              )}

            </div>
          </div>

        </div>
      </div>

      {editModel && (
        <div>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className=" w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Design System
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Configure technology stack and design system
                </p>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div>

                  <label style={labelStyle}>Technology Used</label>

                  <div

                    style={{

                      display: "grid",

                      gridTemplateColumns: "180px 1fr auto",

                      gap: 8,

                      marginBottom: 12,

                    }}

                  >

                    <select

                      value={techArea}

                      onChange={(e) => setTechArea(e.target.value)}

                      className={selectCls}

                    >

                      <option value="">Select Area</option>

                      <option value="Frontend">Frontend</option>

                      <option value="Backend">Backend</option>

                      <option value="Database">Database</option>

                      <option value="DevOps">DevOps</option>

                      <option value="Cloud">Cloud</option>

                      <option value="Mobile">Mobile</option>

                      <option value="Desktop">Desktop</option>

                      <option value="Testing">Testing</option>

                      <option value="AI/ML">AI/ML</option>

                      <option value="Other">Other</option>

                    </select>



                    <input

                      type="text"

                      placeholder="React.js, Next.js, PostgreSQL..."

                      value={techName}

                      onChange={(e) => setTechName(e.target.value)}

                      className={inputCls}

                      onKeyDown={(e) => {

                        if (

                          e.key === "Enter" &&

                          techArea &&

                          techName.trim()

                        ) {

                          e.preventDefault();



                          setTechnology([

                            ...technology,

                            {

                              area: techArea,

                              tech: techName.trim(),

                            },

                          ]);



                          setTechArea("");

                          setTechName("");

                        }

                      }}

                    />



                    <button

                      type="button"

                      disabled={!techArea || !techName.trim()}

                      onClick={() => {

                        setTechnology([

                          ...technology,

                          {

                            area: techArea,

                            tech: techName.trim(),

                          },

                        ]);



                        setTechArea("");

                        setTechName("");

                      }}

                      style={{

                        padding: "8px 14px",

                        background:

                          !techArea || !techName.trim()

                            ? "#cbd5e1"

                            : T.primary,

                        border: "none",

                        borderRadius: 8,

                        color: "#fff",

                        fontWeight: 600,

                        cursor:

                          !techArea || !techName.trim()

                            ? "not-allowed"

                            : "pointer",

                        opacity:

                          !techArea || !techName.trim()

                            ? 0.7

                            : 1,

                      }}

                    >

                      Add

                    </button>

                  </div>



                  <div

                    style={{

                      display: "flex",

                      flexDirection: "column",

                      gap: 8,

                    }}

                  >

                    {technology.map((item, index) => (

                      <div

                        key={index}

                        style={{

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "space-between",

                          padding: "10px 12px",

                          border: `1px solid ${T.border}`,

                          borderRadius: 10,

                          background: T.bg,

                        }}

                      >

                        <div>

                          <div

                            style={{

                              fontSize: 11,

                              fontWeight: 700,

                              color: T.primary,

                              textTransform: "uppercase",

                            }}

                          >

                            {item.area}

                          </div>



                          <div

                            style={{

                              fontSize: 14,

                              fontWeight: 500,

                              color: T.text,

                            }}

                          >

                            {item.tech}

                          </div>

                        </div>



                        <button

                          type="button"

                          onClick={() =>

                            setTechnology(

                              technology.filter(

                                (_, i) => i !== index

                              )

                            )

                          }

                          style={{

                            border: "none",

                            background: "transparent",

                            color: T.danger,

                            cursor: "pointer",

                            fontSize: 18,

                          }}

                        >

                          ×

                        </button>

                      </div>

                    ))}

                  </div>

                </div>

                <div className="space-y-5 border rounded-xl p-5 bg-white">

                  <div className="flex justify-between px-1">

                    {/* Brand Name */}

                    <div>

                      <label className="block text-sm font-semibold mb-2">

                        Brand Name

                      </label>



                      <input

                        value={designSystems.brandName}



                        onChange={(e) =>

                          setDesignSystems({

                            ...designSystems,

                            brandName: e.target.value,

                          })

                        }

                        type="text"

                        placeholder="Enter brand name"

                        className="w-full px-4 py-3 rounded-xl border"

                      />

                    </div>



                    {/* Brand Feel */}

                    <div className="w-[38%]">

                      <label className="block text-sm font-semibold mb-2">

                        Brand Feel

                      </label>



                      <select value={designSystems.brandFeel} onChange={(e) =>

                        setDesignSystems({

                          ...designSystems,

                          brandFeel: e.target.value,

                        })

                      } className="w-full px-4 py-3 rounded-xl border">

                        <option>Default</option>

                        <option>Classic</option>

                        <option>Modern</option>

                        <option>Luxury</option>

                        <option>Minimal</option>

                        <option>Corporate</option>

                        <option>Futuristic</option>

                        <option>Playful</option>

                      </select>

                    </div>

                  </div>

                  {/* Colors */}

                  <div>

                    <label style={labelStyle}>Brand Colors</label>



                    <div

                      style={{

                        display: "grid",

                        gridTemplateColumns: "1fr auto",

                        gap: 8,

                        marginBottom: 12,

                      }}

                    >

                      <input

                        type="text"

                        placeholder="#FF6B35 or Primary Orange"

                        value={colorInput}

                        onChange={(e) => setColorInput(e.target.value)}

                        className={inputCls}

                        onKeyDown={(e) => {

                          if (e.key === "Enter" && colorInput.trim()) {

                            e.preventDefault();



                            setDesignSystems({

                              ...designSystems,

                              colors: [

                                ...designSystems.colors,

                                colorInput.trim(),

                              ],

                            });



                            setColorInput("");

                          }

                        }}

                      />



                      <button

                        type="button"

                        disabled={!colorInput.trim()}

                        onClick={() => {

                          setDesignSystems({

                            ...designSystems,

                            colors: [

                              ...designSystems.colors,

                              colorInput.trim(),

                            ],

                          });



                          setColorInput("");

                        }}

                        style={{

                          padding: "8px 14px",

                          background: !colorInput.trim()

                            ? "#cbd5e1"

                            : T.primary,

                          border: "none",

                          borderRadius: 8,

                          color: "#fff",

                          fontWeight: 600,

                          cursor: !colorInput.trim()

                            ? "not-allowed"

                            : "pointer",

                        }}

                      >

                        Add

                      </button>

                    </div>



                    <div

                      style={{

                        display: "flex",

                        flexWrap: "wrap",

                        gap: 8,

                      }}

                    >

                      {designSystems.colors.map((color: any, index: any) => (

                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            border: `1px solid ${T.border}`,
                            borderRadius: 999,
                            background: T.bg,
                          }}

                        >

                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: color.startsWith("#")
                                ? color
                                : "#e5e7eb",
                              border: "1px solid #d1d5db",
                            }}
                          />



                          <span
                            style={{
                              fontSize: 13,
                              color: T.text,
                            }}

                          >

                            {color}

                          </span>



                          <button
                            type="button"
                            onClick={() =>
                              setDesignSystems({
                                ...designSystems,
                                colors: designSystems.colors.filter(
                                  (_: any, i: any) => i !== index

                                ),

                              })

                            }

                            style={{
                              border: "none",
                              background: "transparent",
                              color: T.danger,
                              cursor: "pointer",
                              fontSize: 16,
                              padding: 0,

                            }}

                          >

                            ×

                          </button>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* Fonts */}

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <label className="block text-sm font-semibold mb-2">

                        Primary Font

                      </label>



                      <input

                        value={designSystems.fonts.primary}



                        onChange={(e) =>

                          setDesignSystems({

                            ...designSystems,

                            fonts: {

                              ...designSystems.fonts,

                              primary: e.target.value,

                            },

                          })

                        }

                        type="text"

                        placeholder="Inter"

                        className="w-full px-4 py-3 rounded-xl border"

                      />

                    </div>



                    <div>

                      <label className="block text-sm font-semibold mb-2">

                        Secondary Font

                      </label>



                      <input

                        value={designSystems.fonts.secondary}



                        onChange={(e) =>

                          setDesignSystems({

                            ...designSystems,

                            fonts: {

                              ...designSystems.fonts,

                              secondary: e.target.value,

                            },

                          })

                        }

                        type="text"

                        placeholder="Roboto"

                        className="w-full px-4 py-3 rounded-xl border"

                      />

                    </div>

                  </div>

                  {/* Design Type */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">

                      Design Type

                    </label>



                    <input

                      value={designSystems.designType.join(", ")}

                      onChange={(e) =>

                        setDesignSystems({

                          ...designSystems,

                          designType: [e.target.value],

                        })}

                      type="text"

                      placeholder="Dashboard, SaaS, Ecommerce, Portfolio"

                      className="w-full px-4 py-3 rounded-xl border"

                    />

                  </div>

                  <div className="flex gap-3">

                    {/* Theme */}

                    <div>

                      <label className="block text-sm font-semibold mb-2">

                        Theme

                      </label>



                      <input

                        value={designSystems.theme.join(", ")}

                        onChange={(e) =>

                          setDesignSystems({

                            ...designSystems,

                            theme: [e.target.value],

                          })

                        }

                        type="text"

                        placeholder="Light, Dark, Glassmorphism"

                        className="w-full px-4 py-3 rounded-xl border"

                      />

                    </div>



                    {/* Content Tone */}

                    <div>

                      <label className="block text-sm font-semibold mb-2">

                        Content Tone

                      </label>



                      <input

                        value={designSystems.contentTone.join(", ")}

                        onChange={(e) =>

                          setDesignSystems({

                            ...designSystems,

                            contentTone: [e.target.value],

                          })

                        }

                        type="text"

                        placeholder="Professional, Friendly, Technical"

                        className="w-full px-4 py-3 rounded-xl border"

                      />

                    </div>



                  </div>

                  {/* Layout Style */}

                  <div>

                    <label style={labelStyle}>Layout Style</label>

                    {/* Existing Layout Properties */}

                    <div

                      style={{

                        display: "flex",

                        flexDirection: "column",

                        gap: 8,

                        marginBottom: 12,

                      }}

                    >

                      {Object.entries(designSystems.layoutStyle).map(

                        ([key, value]) => (

                          <div

                            key={key}

                            style={{

                              display: "flex",

                              alignItems: "center",

                              justifyContent: "space-between",

                              padding: "10px 12px",

                              border: `1px solid ${T.border}`,

                              borderRadius: 10,

                              background: T.bg,

                            }}

                          >

                            <div>

                              <div

                                style={{

                                  fontSize: 11,

                                  fontWeight: 700,

                                  color: T.primary,

                                  textTransform: "uppercase",

                                }}

                              >

                                {key}

                              </div>



                              <div

                                style={{

                                  fontSize: 14,

                                  color: T.text,

                                }}

                              >

                                {String(value)}

                              </div>

                            </div>



                            <button

                              type="button"

                              onClick={() => {

                                setDesignSystems((prev) => {

                                  const updated = { ...prev.layoutStyle };

                                  delete updated[key];



                                  return {

                                    ...prev,

                                    layoutStyle: updated,

                                  };

                                });

                              }}

                              style={{

                                border: "none",

                                background: "transparent",

                                color: T.danger,

                                cursor: "pointer",

                                fontSize: 18,

                              }}

                            >

                              ×

                            </button>

                          </div>

                        )

                      )}

                    </div>



                    {/* Add New Property */}

                    <div

                      style={{

                        display: "grid",

                        gridTemplateColumns: "180px 1fr auto",

                        gap: 8,

                      }}

                    >

                      <input

                        type="text"

                        placeholder="Property (e.g. navigation)"

                        value={layoutKey}

                        onChange={(e) => setLayoutKey(e.target.value)}

                        className={inputCls}

                      />



                      <input

                        type="text"

                        placeholder="Value (e.g. Sticky top navbar)"

                        value={layoutValue}

                        onChange={(e) => setLayoutValue(e.target.value)}

                        className={inputCls}

                        onKeyDown={(e) => {

                          if (

                            e.key === "Enter" &&

                            layoutKey.trim() &&

                            layoutValue.trim()

                          ) {

                            e.preventDefault();



                            setDesignSystems((prev) => ({

                              ...prev,

                              layoutStyle: {

                                ...prev.layoutStyle,

                                [layoutKey.trim()]: layoutValue.trim(),

                              },

                            }));



                            setLayoutKey("");

                            setLayoutValue("");

                          }

                        }}

                      />



                      <button

                        type="button"

                        disabled={!layoutKey.trim() || !layoutValue.trim()}

                        onClick={() => {

                          setDesignSystems((prev) => ({

                            ...prev,

                            layoutStyle: {

                              ...prev.layoutStyle,

                              [layoutKey.trim()]: layoutValue.trim(),

                            },

                          }));



                          setLayoutKey("");

                          setLayoutValue("");

                        }}

                        style={{

                          padding: "8px 14px",

                          background:

                            !layoutKey.trim() || !layoutValue.trim()

                              ? "#cbd5e1"

                              : T.primary,

                          border: "none",

                          borderRadius: 8,

                          color: "#fff",

                          fontWeight: 600,

                          cursor:

                            !layoutKey.trim() || !layoutValue.trim()

                              ? "not-allowed"

                              : "pointer",

                        }}

                      >

                        Add

                      </button>

                    </div>

                  </div>

                  {/* Visual Guidelines */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">

                      Visual Guidelines

                    </label>



                    {/* Add New Guideline */}

                    <div className="grid grid-cols-[180px_1fr_auto] gap-2">

                      <input

                        type="text"

                        placeholder="Property (e.g. borderRadius)"

                        value={visualKey}

                        onChange={(e) => setVisualKey(e.target.value)}

                        className="px-4 py-3 rounded-xl border"

                      />



                      <input

                        type="text"

                        placeholder="Value (e.g. 16px rounded corners)"

                        value={visualValue}

                        onChange={(e) => setVisualValue(e.target.value)}

                        className="px-4 py-3 rounded-xl border w-75"

                        onKeyDown={(e) => {

                          if (

                            e.key === "Enter" &&

                            visualKey.trim() &&

                            visualValue.trim()

                          ) {

                            e.preventDefault();



                            setDesignSystems((prev) => ({

                              ...prev,

                              visualGuidelines: {

                                ...prev.visualGuidelines,

                                [visualKey.trim()]: visualValue.trim(),

                              },

                            }));



                            setVisualKey("");

                            setVisualValue("");

                          }

                        }}

                      />



                      <button

                        type="button"

                        disabled={!visualKey.trim() || !visualValue.trim()}

                        onClick={() => {

                          setDesignSystems((prev) => ({

                            ...prev,

                            visualGuidelines: {

                              ...prev.visualGuidelines,

                              [visualKey.trim()]: visualValue.trim(),

                            },

                          }));



                          setVisualKey("");

                          setVisualValue("");

                        }}

                        className="px-6 bg-[#FFAE58] text-white rounded-xl disabled:opacity-50"

                      >

                        Add

                      </button>

                    </div>



                    {/* Existing Guidelines */}

                    <div className="flex flex-col gap-2 mb-3">

                      {Object.entries(designSystems.visualGuidelines).map(

                        ([key, value]) => (

                          <div

                            key={key}

                            className="flex items-center justify-between p-3 border rounded-xl"

                          >

                            <div>

                              <div className="text-xs font-bold uppercase text-[#FFAE58]">

                                {key}

                              </div>



                              <div className="text-sm">

                                {String(value)}

                              </div>

                            </div>



                            <button

                              type="button"

                              onClick={() => {

                                setDesignSystems((prev) => {

                                  const updated = {

                                    ...prev.visualGuidelines,

                                  };



                                  delete updated[key];



                                  return {

                                    ...prev,

                                    visualGuidelines: updated,

                                  };

                                });

                              }}

                              className="text-red-500 text-lg"

                            >

                              ×

                            </button>

                          </div>

                        )

                      )}

                    </div>

                  </div>

                  {/* Key Pages */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">

                      Key Pages

                    </label>



                    <input

                      type="text"

                      placeholder="Home, About, Pricing..."

                      className="w-full px-4 py-3 rounded-xl border"

                      value={keyPagesInput}

                      onChange={(e) => {

                        const value = e.target.value;

                        setKeyPagesInput(value);



                        setDesignSystems((prev) => ({

                          ...prev,

                          keyPages: value

                            .split(",")

                            .map((x) => x.trim())

                            .filter(Boolean),

                        }));

                      }}

                    />

                  </div>

                  {/* Uniqueness */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">

                      What Makes This Design Unique?

                    </label>



                    <textarea

                      value={designSystems.uniqueness.differentiator}

                      onChange={(e) =>

                        setDesignSystems((prev) => ({

                          ...prev,

                          uniqueness: {

                            ...prev.uniqueness,

                            differentiator: e.target.value,

                          },

                        }))

                      }

                      rows={4}

                      placeholder="Describe the unique visual style, inspiration, differentiators..."

                      className="w-full px-4 py-3 rounded-xl border"

                    />

                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setEditModel(false)}
                  type="button"
                  className=" px-5 py-2.5 rounded-lg border hover:bg-gray-50">
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors ${loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                    }`}
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignOverview;