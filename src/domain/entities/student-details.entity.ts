export class StudentDetails {
  constructor(
    private readonly _id: string | null,
    private readonly _userId: string,
    private readonly _coins: number = 0,
    private readonly _badges: string[] = [],
    private readonly _isPlatformVerified: boolean = false,
    private readonly _platformVerifiedAt: Date | null = null,
  ) {}

  get id(): string | null {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get coins(): number {
    return this._coins;
  }
  get badges(): string[] {
    return this._badges;
  }
  get isPlatformVerified(): boolean {
    return this._isPlatformVerified;
  }
  get platformVerifiedAt(): Date | null {
    return this._platformVerifiedAt;
  }
}