import passport from "passport";
import {
  type Profile,
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";

export const setupGoogleStrategy = (): void => {
  if (!process.env.GOOGLE_CLIENT_ID)
    throw new Error("GOOGLE_CLIENT_ID is not defined");
  if (!process.env.GOOGLE_CLIENT_SECRET)
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile: Profile, done) => {
        done(null, profile as unknown as Express.User);
      },
    ),
  );
};