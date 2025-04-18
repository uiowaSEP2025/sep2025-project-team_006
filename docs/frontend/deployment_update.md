# Deployment Update
With the merging of [PR #34](https://github.com/uiowaSEP2025/sep2025-project-team_006/pull/34), the GAP website no longer uses a static website export hosted on GitHub Pages, and now is a standalone frontend server, which acts as a middleman to the backend. This is an improvement of the clientside authentication script we had, and now properly protects hidden pages by locking them via routes that proxy and manage the authentication endpoints on the backend, including cycling the JWT token in a fashion transparent to the user. Trying to access these pages without the right authentication will cause a 301 redirect.

User info is now accessible and managed by a global `window.__USER__` variable, and sensitive information like your session and token are stored securely as cookies. To block people from accessing restricted webpages, a middleware function is placed inside `middleware.ts` that controls where people can go, and where people should go if they aren't allowed. This would be better placed inside of the actual .tsx files, but for now this works.

Locally, features of the website as of main work as-is, however this change requiers us to switch our means of deploying. Alongside Brandon's free-tier backend EC2 instance will be our frontend EC2 instance.

## The proper way to do things
To access stuff on the backend, one should create a proxy API call on the frontends side, placed inside the `app/api` folder - `app/api/login/route.ts` and `app/api/register/route.ts` are good, similar examples of this, and their references are placed inside the actual rendered webpages in `app/(faculty)/faculty/page.tsx` and `app/(student)/createAccount/page.tsx`.

As of this commit, most calls to the backend are done directly via the token stored in your document cookies; this is fine, but in the future we should move to the above file/route structure. 
