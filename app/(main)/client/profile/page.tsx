"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ClientInfoCard from "@/components/clients/profile/ClientInfoCard";
import ClientDetailsCard from "@/components/clients/profile/ClientDetailsCard";
import EngineerAccountCard from "@/components/engineer/profile/EngineerAccountCard";
import ClientMetaCard from "@/components/clients/profile/ClientMetaCard";
import ClientProjectsCarousel from "@/components/clients/profile/ClientProjectsCarousel";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function ClientProfile() {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR("/api/client/profile", fetcher);
  useEffect(() => {
  if (isLoading || !data?.user?.id) return;

  const tourKey = `tour_seen_profile_${data.user.id}`;
  const isHandoff = sessionStorage.getItem("start_profile_tour") === "true";

  if (!isHandoff && localStorage.getItem(tourKey)) return;

  const startTour = () => {
    const photo = document.querySelector("#profile-photo");
    const payout = document.querySelector("#payout-details");
    if (!photo || !payout) return;

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
        sessionStorage.removeItem("tour_in_progress");
        sessionStorage.removeItem("start_profile_tour");
        localStorage.setItem(tourKey, "true");
      },
      steps: [
        {
          element: "#profile-photo",
          popover: {
            title: "Profile Photo",
            description:
              "Click the camera icon to upload or update your profile picture. This is how your team members and engineers will recognize you.",
          },
        },
        {
          element: "#payout-details",
          popover: {
            title: "Payout Details",
            description:
              "Set up your UPI ID or bank account here so payments can be processed smoothly. Hit Edit to add or update your details anytime.",
          },
        },
      ],
    });

    driverObj.drive();
  };

  const timer = setTimeout(startTour, isHandoff ? 0 : 1000);
  return () => clearTimeout(timer);
}, [isLoading, data?.user?.id]);

  if (isLoading) return <div className="flex items-center justify-center h-[80vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "var(--primary)" }} /></div>;

  const user = data?.user;
  const profile = data?.profile;

  if (!user) return <p className="text-center mt-10">No user found</p>;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold font-inter text-[var(--text-primary)]">My Profile</h2>
        <p className="text-sm font-inter text-[var(--text-muted)] mt-1">Manage your personal and business details.</p>
      </div>

      <div className="space-y-6">
        <ClientMetaCard user={user} />
        <ClientInfoCard user={user} onUpdate={() => mutate()} />
        <ClientProjectsCarousel
          projects={profile.projects}
          onProjectSelect={(project) => {
            router.push(`/client?projectId=${project.id}`);
          }}
        />
        <ClientDetailsCard profile={profile} user={user} onUpdate={() => mutate()} />
        <EngineerAccountCard />
      </div>
    </div>
  );
}