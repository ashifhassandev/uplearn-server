import type { Request, Response } from "express";
import passport from "passport";
import type { Profile } from "passport-google-oauth20";
import { inject, injectable } from "tsyringe";

import { AppError } from "@/shared/errors/app.error";

import { TOKENS } from "../../application/constants/injection-token.constants";
import type { IGoogleAuthUseCase } from "../../application/ports/use-cases/auth/google-auth.use-case.interface";
import type { ILogger } from "../../shared/logger/logger.interface";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "../constants/cookie.constants";

const FRONTEND_URL = process.env.FRONTEND_URL;

@injectable()
export class GoogleAuthController {
  constructor(
    @inject(TOKENS.IGoogleAuthUseCase)
    private readonly googleAuthUseCase: IGoogleAuthUseCase,

    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  public initiateGoogleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
    session: false,
  });

  public handleGoogleCallback = (req: Request, res: Response): void => {
    passport.authenticate(
      "google",
      { session: false },
      async (err: Error, profile: Profile) => {
        try {
          this.logger.info("Google callback received", {
            hasError: !!err,
            hasProfile: !!profile,
            error: err?.message,
          });

          if (err || !profile) {
            return res.redirect(
              `${FRONTEND_URL}/login?error=google_auth_failed`,
            );
          }

          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName || "User";
          const lastName = profile.name?.familyName || "";
          const profileImage = profile.photos?.[0]?.value ?? null;

          if (!email) {
            return res.redirect(`${FRONTEND_URL}/login?error=no_email`);
          }

          const result = await this.googleAuthUseCase.execute({
            googleId: profile.id,
            email,
            firstName,
            lastName,
            profileImage,
          });

          res.cookie(
            COOKIE_NAMES.REFRESH_TOKEN,
            result.refreshToken,
            COOKIE_OPTIONS,
          );

          const params = new URLSearchParams({
            accessToken: result.accessToken,
            user: JSON.stringify(result.user),
          });

          res.redirect(
            `${FRONTEND_URL}/auth/google/success?${params.toString()}`,
          );
        } catch (error) {
          this.logger.error("Google auth failed unexpectedly");
          const message =
            error instanceof AppError
              ? encodeURIComponent(error.message)
              : encodeURIComponent("Something went wrong. Please try again.");
          res.redirect(`${FRONTEND_URL}/login?error=${message}`);
        }
      },
    )(req, res);
  };
}