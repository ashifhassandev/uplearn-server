import { ApplicationStatus } from "../enums/application-status.enum";
import type {
  Certificate,
  Education,
  Experience,
  Links,
} from "../types/instructor-details.type";

export class InstructorDetails {
  constructor(
    private readonly _id: string | null,
    private readonly _userId: string,
    private readonly _bio: string | null = null,
    private readonly _headline: string | null = null,
    private readonly _education: Education[] = [],
    private readonly _certificates: Certificate[] = [],
    private readonly _experiences: Experience[] = [],
    private readonly _skills: string[] = [],
    private readonly _links: Links = {
      linkedin: null,
      portfolio: null,
      github: null,
    },
    private readonly _applicationStatus: ApplicationStatus = ApplicationStatus.PENDING,
    private readonly _rejectionReason: string | null = null,
    private readonly _isApprovedByAdmin: boolean = false,
    private readonly _approvedByAdminAt: Date | null = null,
    private readonly _approvedByAdminId: string | null = null,
    private readonly _isPlatformVerified: boolean = false,
    private readonly _platformVerifiedAt: Date | null = null,
  ) {}

  get id(): string | null {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get bio(): string | null {
    return this._bio;
  }
  get headline(): string | null {
    return this._headline;
  }
  get education(): Education[] {
    return this._education;
  }
  get certificates(): Certificate[] {
    return this._certificates;
  }
  get experiences(): Experience[] {
    return this._experiences;
  }
  get skills(): string[] {
    return this._skills;
  }
  get links(): Links {
    return this._links;
  }
  get applicationStatus(): ApplicationStatus {
    return this._applicationStatus;
  }
  get rejectionReason(): string | null {
    return this._rejectionReason;
  }
  get isApprovedByAdmin(): boolean {
    return this._isApprovedByAdmin;
  }
  get approvedByAdminAt(): Date | null {
    return this._approvedByAdminAt;
  }
  get approvedByAdminId(): string | null {
    return this._approvedByAdminId;
  }
  get isPlatformVerified(): boolean {
    return this._isPlatformVerified;
  }
  get platformVerifiedAt(): Date | null {
    return this._platformVerifiedAt;
  }

  isPending(): boolean {
    return this._applicationStatus === ApplicationStatus.PENDING;
  }

  isApproved(): boolean {
    return this._applicationStatus === ApplicationStatus.APPROVED;
  }

  canReapply(): boolean {
    return this._applicationStatus === ApplicationStatus.REJECTED;
  }

  withReapplication(
    bio: string,
    headline: string,
    education: Education[],
    certificates: Certificate[],
    experiences: Experience[],
    skills: string[],
    links: Links,
  ): InstructorDetails {
    return new InstructorDetails(
      this._id,
      this._userId,
      bio,
      headline,
      education,
      certificates,
      experiences,
      skills,
      links,
      ApplicationStatus.PENDING,
      null,                 
      this._isApprovedByAdmin,
      this._approvedByAdminAt,
      this._approvedByAdminId,
      this._isPlatformVerified,
      this._platformVerifiedAt,
    );
  }
}