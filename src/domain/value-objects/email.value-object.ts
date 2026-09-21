export class Email {
  private readonly value: string;

  constructor(email: string) {
    // Stronger regex — rejects "@", "a@", "a@b", etc.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }
    
    this.value = email.toLowerCase();
  }

  getValue(): string {
    return this.value;
  }
}