export const STATUS_CONFIG = {
  APPLIED: {
    label: "Applied",
    color: "blue",
    bgClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  PHONE_SCREEN: {
    label: "Phone screen",
    color: "yellow",
    bgClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  INTERVIEWING: {
    label: "Interviewing",
    color: "orange",
    bgClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  OFFER: {
    label: "Offer",
    color: "green",
    bgClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    color: "red",
    bgClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    color: "gray",
    bgClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;

export type Application = {
  id: string;
  company: string;
  role: string;
  status: StatusKey;
  location: string | null;
  url: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string | null;
  appliedAt: Date;
  followUpAt: Date | null;
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
};

export type Note = {
  id: string;
  applicationId: string;
  content: string;
  createdAt: Date;
};
