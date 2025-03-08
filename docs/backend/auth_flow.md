# Auth Flow
A big fat work in progress. I'm not particularly an expert in the field of login management, just kinda following along what I did in SELT.

## 1. User registers; `POST /api/auth/register`
The user registers. This should have two parameters (no body?);
- email
- password
This returns a session token.

## 1.5 Oauth
Oauth registrations have their own callback built into the provider we use (what was discussed was [Google](https://developers.google.com/identity/protocols/oauth2) and [Outlook](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)). Typically, the response from these Oauth providers will include an email we can plug into our own database structre.

Per actually logging in with Oauth, we generated a random password on the server side and stored it securely in the database alongside everything else - this does mean one could log in via password to an oauth account, but no one would know what that password was.

## 2. User logs in; `POST /api/auth/login`
The user logs in with the same parameters.
Returns a session token, but additionally does some other verification such as;
- Whether an existing session token exists (should we allow multiple?)
- etc.

# Specifics
The auth module interfaces directly with the users table and User entity, and its main function is to deal with generating and verifying session tokens. I *believe* this is the right way to do things - I don't know if it makes sense to have a user endpoint in this scenario until we do some more complex stuff, and even then, I believe there could be another abstrcation alongside this. 

