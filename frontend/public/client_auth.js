// This is superceded by the proper frontend auth system, but I think it's worth keeping around still.

// Our current frontend is not built to be deployed outside of a static environment currently.
// As a stopgap for now, all authentication procedures are done directly on the client.
// This isn't faking it or anything - authentication is still being done, and the user cant just disable javascript and run like the wind.
// But it is baaaaaaad.

//const API_BASE_URL = "https://gradappsite.tech";
const API_BASE_URL = "http://localhost:5000"

// A map of where to redirect to based on the users condition.
const redirects = {
    "/faculty": { out: null, student: null, faculty: "/facultyHome" },
    "/students": { out: null, student: "/studentHome", faculty: null }, 
    "/facultyHome": { out: "/faculty", student: "/faculty", faculty: null },
    "/studentHome": { out: "/students", student: null, faculty: "/students" },
    "/metricSetting": { out: "/", student: "/faculty", faculty: null },
    "/studentList": { out: "/", student: "/faculty", faculty: null },
    "/studentList/application": { out: "/", student: "/faculty", faculty: null },
};

// Small macro to redirect only if the redirect value is not null.
const redir_not_null = (loc) => (loc != null) ? window.location.replace(loc) : true;

// This is ran automagically on each page visited.
(() => {
    if (location.pathname in redirects) {
        // A redirect rule is put in place, do the logic.
        const token = localStorage.getItem("token");
        const goto = redirects[location.pathname] ?? {};

        if (!token) {
            // The token doesn't exist, redirect if theres some restriction.
            redir_not_null(goto["out"]);
        } else {
            // Verify our standing with the backend API.
            fetch(`${API_BASE_URL}/api/auth/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(resp => {
                if (resp.ok) {
                    // Good response. Life's great.
                    resp.json().then(json => {
                        const role = json["payload"]["account_type"];
                        const id = json["payload"]["id"]
                        localStorage.setItem("id", id);
                        redir_not_null(goto[role]);
                    });
                } else {
                    // Bad response, bad token, die here.
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    localStorage.removeItem("id");
                    redir_not_null(goto["out"]);
                }
            }).catch(e => {
                // oh well
            });
        }
    }
})();
