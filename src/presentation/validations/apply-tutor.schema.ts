import { z } from "zod";

const EducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(1, "Year is required"),
});

const CertificateSchema = z.object({
  key: z.string().nullable().default(null),
});

const ExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
});

const LinksSchema = z.object({
  linkedin: z.string().url().nullable().default(null),
  portfolio: z.string().url().nullable().default(null),
  github: z.string().url().nullable().default(null),
});

export const applyTutorSchema = z.object({
  bio: z.string().min(30, "Bio must be at least 50 characters"),
  headline: z.string().min(5, "Headline must be at least 10 characters"),
  education: z
    .array(EducationSchema)
    .min(1, "At least one education entry required"),
  certificates: z.array(CertificateSchema).default([]),
  experiences: z.array(ExperienceSchema).default([]),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  links: LinksSchema.default({
    linkedin: null,
    portfolio: null,
    github: null,
  }),
});