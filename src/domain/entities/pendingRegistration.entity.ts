export class PendingRegistration {
  constructor(
    public readonly id: string | null,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly hashedPassword: string,
    public readonly otpCode: string,
    public readonly expiresAt: Date,
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}