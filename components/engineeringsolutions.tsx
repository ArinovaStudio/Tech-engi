import React, { useState } from "react";

type Category = "all" | "corporate" | "startup" | "product" | "drone";

interface Solution {
  category: Exclude<Category, "all">;
  featured?: boolean;
  badge?: string;
  icon: string;
  title: string;
  description: string;
  items: string[];
  price: string;
  metaTag: string;
}

const solutions: Solution[] = [
  {
    category: "corporate",
    featured: true,
    badge: "★★★★★ Most Requested",
    icon: "🏢",
    title: "Corporate Engineering Support",
    description:
      "Production issues can't wait. We provide dedicated engineers to resolve bugs, complete modules, optimize systems and help your team meet critical deadlines.",
    items: [
      "Production Bug Fixes",
      "Firmware & Embedded Debugging",
      "AI Integration",
      "PCB Issues",
      "Cloud & DevOps",
      "Emergency Engineering Support",
    ],
    price: "₹25K – ₹5L+",
    metaTag: "⚡ Fast Delivery",
  },
  {
    category: "startup",
    icon: "🚀",
    title: "Startup MVP Development",
    description:
      "Build your first product with experienced engineers. From idea validation to launch-ready software.",
    items: [
      "Mobile Apps",
      "SaaS Platforms",
      "AI Applications",
      "Backend APIs",
      "Admin Panels",
      "Cloud Deployment",
    ],
    price: "₹30K – ₹10L+",
    metaTag: "🚀 MVP Ready",
  },
  {
    category: "product",
    icon: "⚙️",
    title: "Product Design & Manufacturing",
    description:
      "Transform an idea into a manufacturable product. Complete engineering from industrial design to production.",
    items: [
      "Product Concept",
      "3D CAD Design",
      "PCB Design",
      "Prototype Development",
      "Manufacturing Support",
      "Production Documentation",
    ],
    price: "₹50K – ₹20L+",
    metaTag: "🏭 End-to-End",
  },
  {
    category: "drone",
    icon: "🚁",
    title: "Custom Drone Development",
    description:
      "Build specialized drones for industrial, agriculture, surveillance, research and autonomous applications.",
    items: [
      "Flight Controller",
      "Mission Planning",
      "Payload Integration",
      "Computer Vision",
      "Autonomous Navigation",
      "Manufacturing Support",
    ],
    price: "₹25K – ₹5L+",
    metaTag: "🚁 Custom Solutions",
  },
];

const filters: { label: string; value: Category }[] = [
  { label: "Engineering Solutions We Deliver", value: "all" },
  { label: "Corporate", value: "corporate" },
  { label: "Startup MVP", value: "startup" },
  { label: "Product", value: "product" },
  { label: "Drone", value: "drone" },
];

const EngineeringSolutions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const visibleSolutions = solutions.filter(
    (s) => activeFilter === "all" || s.category === activeFilter
  );

  return (
    <div
      className="eng-solutions-section min-h-screen"
      style={{
        background: "#0b0f19",
        color: "#f3f4f6",
        padding: "80px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/*
        All selectors below are scoped under .eng-solutions-section so they
        can never leak into or collide with sibling components rendered
        elsewhere on the page (BrowserCategory, TrustIndicator, Stats, etc).
      */}
      <style>{`
        @keyframes engFadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .eng-solutions-section .eng-solution-card {
          animation: engFadeInUp 0.6s forwards ease-out;
        }
        .eng-solutions-section .eng-solution-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        .eng-solutions-section .eng-solution-card.eng-featured:hover {
          border-color: #eab308 !important;
          box-shadow: 0 30px 60px rgba(234, 179, 8, 0.15);
        }
        .eng-solutions-section .eng-filter-btn:hover,
        .eng-solutions-section .eng-filter-btn.eng-active {
          background: #2563eb !important;
          color: #ffffff !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
        @media (max-width: 768px) {
          .eng-solutions-section .eng-section-title-h2 { font-size: 2rem !important; }
        }
      `}</style>

      <section style={{ maxWidth: 1200, width: "100%", margin: "0 auto" }}>
        {/* Filter Navigation Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 15,
            marginBottom: 50,
            flexWrap: "wrap",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              className={`eng-filter-btn${activeFilter === f.value ? " eng-active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                color: "#9ca3af",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "12px 24px",
                borderRadius: 30,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span
            style={{
              color: "#3b82f6",
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 12,
            }}
          >
            OUR EXPERTISE
          </span>
          <h2
            className="eng-section-title-h2"
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: 20,
              color: "#ffffff",
              background: "linear-gradient(to right, #ffffff, #9ca3af)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Engineering Solutions Built Around Your Business
          </h2>
          <p
            style={{
              maxWidth: 650,
              margin: "0 auto",
              color: "#9ca3af",
              lineHeight: 1.6,
              fontSize: "1.1rem",
            }}
          >
            Whether you're fixing production issues, building your startup,
            developing a hardware product, or creating autonomous systems,
            Tech Engi provides verified engineering teams from concept to
            deployment.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 30,
          }}
        >
          {visibleSolutions.map((s, i) => (
            <div
              key={s.title}
              className={`eng-solution-card${s.featured ? " eng-featured" : ""}`}
              style={{
                background: s.featured
                  ? "linear-gradient(145deg, #111827, #171e2e)"
                  : "#111827",
                border: `1px solid ${
                  s.featured ? "rgba(234, 179, 8, 0.3)" : "rgba(255, 255, 255, 0.05)"
                }`,
                borderRadius: 16,
                padding: "35px 30px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition:
                  "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.3s ease",
                animationDelay: `${0.1 * (i + 1)}s`,
              }}
            >
              {s.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 25,
                    right: 25,
                    background: "rgba(234, 179, 8, 0.1)",
                    color: "#eab308",
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    border: "1px solid rgba(234, 179, 8, 0.2)",
                  }}
                >
                  {s.badge}
                </div>
              )}

              <div
                style={{
                  fontSize: "2.2rem",
                  marginBottom: 25,
                  background: "rgba(255, 255, 255, 0.03)",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                {s.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  marginBottom: 15,
                  color: "#ffffff",
                }}
              >
                {s.title}
              </h3>

              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  marginBottom: 25,
                  flexGrow: 1,
                }}
              >
                {s.description}
              </p>

              <ul style={{ listStyle: "none", marginBottom: 30 }}>
                {s.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      color: "#d1d5db",
                      fontSize: "0.9rem",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: s.featured ? "#eab308" : "#3b82f6", fontWeight: "bold" }}>
                      ✔
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  paddingTop: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#ffffff", fontSize: "1rem" }}>{s.price}</span>
                <span
                  style={{
                    color: "#9ca3af",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "4px 10px",
                    borderRadius: 6,
                  }}
                >
                  {s.metaTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EngineeringSolutions;
