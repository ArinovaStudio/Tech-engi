"use client";

import React, { useState } from "react";
import ProjectTabs from "@/components/project/projectTabs";
import TabContent from "@/components/project/TabContent";
import DashboardShell from "@/components/layout/DashboardShell";

const STATIC_PROJECT = {
  id: "p1",
  name: "E-commerce Revamp",
  summary: "Full redesign and rebuild of the client shopping portal with improved UX and performance optimizations.",
  basicDetails: "Includes cart, checkout, and payment gateway integration. The project aims to improve conversion rates by 30% through better UX design and faster load times.",
  priority: "HIGH",
  repository: "https://github.com/arinova/ecommerce-revamp.git",
  progress: 68,
  membersCount: 5,
  createdAt: "2024-11-12T00:00:00.000Z",
  members: [
    {
      id: "m1",
      userId: "u1",
      isLeader: true,
      role: { name: "Developer" },
      user: {
        id: "u1",
        name: "Priya Sharma",
        email: "priya@arinova.com",
        image: null,
        isLogin: true,
        role: { name: "EMPLOYEE" },
      },
    },
    {
      id: "m2",
      userId: "u2",
      isLeader: false,
      role: { name: "Designer" },
      user: {
        id: "u2",
        name: "Rahul Mehta",
        email: "rahul@arinova.com",
        image: null,
        isLogin: false,
        role: { name: "EMPLOYEE" },
      },
    },
    {
      id: "m3",
      userId: "u3",
      isLeader: false,
      role: { name: "QA Engineer" },
      user: {
        id: "u3",
        name: "Anjali Singh",
        email: "anjali@arinova.com",
        image: null,
        isLogin: true,
        role: { name: "EMPLOYEE" },
      },
    },
    {
      id: "m4",
      userId: "u4",
      isLeader: false,
      role: { name: "Client" },
      user: {
        id: "u4",
        name: "Vikram Nair",
        email: "vikram@client.com",
        image: null,
        isLogin: false,
        role: { name: "CLIENT" },
      },
    },
  ],
  ongoingMilestones: 2,
  totalMilestones: 5,
  projectInfo: {
    budget: 150000,
    startDate: "2024-11-12T00:00:00.000Z",
    deadline: "2025-06-30T00:00:00.000Z",
    projectType: "e-commerce",
    supervisorAdmin: "a1",
  },
};

export default function ProjectIdPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <DashboardShell>
      <div className="p-2">
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          <TabContent activeTab={activeTab} project={STATIC_PROJECT} />
        </div>
      </div>
    </DashboardShell>
  );
}
