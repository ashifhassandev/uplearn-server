export class Otp {
  constructor(
    public readonly userId: string,
    public readonly code: string,
    public readonly expiresAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}