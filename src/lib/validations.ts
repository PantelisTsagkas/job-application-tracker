import { z } from "zod";

export const applicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum([
    "APPLIED",
    "PHONE_SCREEN",
    "INTERVIEWING",
    "OFFER",
    "REJECTED",
    "WITHDRAWN",
  ]),
  location: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  description: z.string().optional(),
  appliedAt: z.date(),
  followUpAt: z.date().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

// Schema for API input (accepts date strings and coerces numbers)
export const applicationApiSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum([
    "APPLIED",
    "PHONE_SCREEN",
    "INTERVIEWING",
    "OFFER",
    "REJECTED",
    "WITHDRAWN",
  ]),
  location: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  salaryMin: z.union([z.number(), z.string().transform(Number)]).optional(),
  salaryMax: z.union([z.number(), z.string().transform(Number)]).optional(),
  description: z.string().optional(),
  appliedAt: z.union([z.date(), z.string().transform((s) => new Date(s))]),
  followUpAt: z.union([z.date(), z.string().transform((s) => new Date(s))]).optional(),
});
