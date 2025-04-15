// Extension of types for the global window property to account for user info.  
export {};

declare global {
  interface Window {
    __USER__?: Record<string, unknown>;
  }
}
