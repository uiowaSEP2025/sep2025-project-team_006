/** Constants used in multiple places. */

// Default cookie settings. Overwrite as needed.
export const cookie_settings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
};
