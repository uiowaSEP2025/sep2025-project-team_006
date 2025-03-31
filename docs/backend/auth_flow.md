# Auth Flow
The auth module as a whole interfaces directly with the users table and User entity, and its main function is to deal with secure access to protected endpoints. When registering or logging in as a user, you will be met with a token and a session. The token is a JWT, a stateless standalone datatype that is meant to be very short lived. It is meant to be kept locally passed in via the Authorization header field to secure endpoints.

The session is a longstanding, server-managed token that is used to manage your current login state. It's primary function currently is to reset the authorization token.

## Addendum: Oauth
Oauth registrations have their own callback built into the provider we use (what was discussed was [Google](https://developers.google.com/identity/protocols/oauth2) and [Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)). Typically, the response from these Oauth providers will include an email we can plug into our own database structure.

Per actually logging in with Oauth, in SELT we generated a random password on the backend and stored it securely in the database alongside everything else - this does mean one could normally log in via password to an Oauth account, but no one would know what that password was, and there would ideally be guards against that.

There are frontend libraries to deal with Oauth; one to look into is [next-auth](https://next-auth.js.org/).
