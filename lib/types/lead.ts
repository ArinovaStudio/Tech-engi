export interface Lead {
  id: string;

  userType: string;
  domain: string;
  blocker: string;
  stage: string;
  budget: string;
  timeline: string;

  name: string;
  email: string;
  phone?: string | null;

  goal: string;

  createdAt: string;
  updatedAt: string;
}