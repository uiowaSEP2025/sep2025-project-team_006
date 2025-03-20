# Auth Flow
A work in progress.

## 1. Student registers; `POST /api/auth/student/register`
The student registers an account. This follows the UserCreation DTO in a JSON-formatted body;
```json
{
    "email": "example@example.com",
    "password": "example_pw"
}
```
This returns a payload with a string JWT and a session token, allowing them to access authenticated pages. 

## 2. Student logs in; `POST /api/auth/student/login`
If the student doesn't have a valid session token, the student logs in. This also follows the UserCreation DTO in a JSON-formatted body;
```json
{
    "email": "example@example.com",
    "password": "example_pw"
}
```
This returns a payload with a string JWT and a session token, allowing them to access authenticated pages.

# Specifics
The auth module interfaces directly with the users table and User entity, and its main function is to deal with generating and verifying session tokens. I *believe* this is the right way to do things - I don't know if it makes sense to have a user endpoint in this scenario until we do some more complex stuff, and even then, I believe there could be another abstrcation alongside this. 

## Addendum: Oauth
Oauth registrations have their own callback built into the provider we use (what was discussed was [Google](https://developers.google.com/identity/protocols/oauth2) and [Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)). Typically, the response from these Oauth providers will include an email we can plug into our own database structure.

Per actually logging in with Oauth, in SELT we generated a random password on the backend and stored it securely in the database alongside everything else - this does mean one could normally log in via password to an Oauth account, but no one would know what that password was, and there would ideally be guards against that.

There are frontend libraries to deal with Oauth; one to look into is [next-auth](https://next-auth.js.org/).
