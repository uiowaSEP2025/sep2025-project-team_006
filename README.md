# GAP
The **Graduate Admission Portal** (shortened to "GAP") is a portal reviewers to track grad students in every part of life; from a students submission and admission, to their career outside of school, to their end-of-life.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/4tPelvOm)

## Setup Instructions

### Installing postgres

#### Windows Guide

1. Download PostgreSQL from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Follow the installation guide from [here](https://www.w3schools.com/postgresql/postgresql_install.php).
3. Then follow this [setup guide](https://www.w3schools.com/postgresql/postgresql_getstarted.php) up through the *Execute SQL Statements* section. 
4. Jump to the instructions below to connection the backend to the database.

#### WSL/Linux Guide

Most of this was adapted from this [StackOverflow](https://stackoverflow.com/a/12670521) answer.

1. `sudo apt update && sudo apt upgrade`
2. `sudo apt install postgresql` - this will install a stable version of postgres and create the `postgres` user on your installation of WSL.
3. Connect to the database under the **postgres** user; `sudo -u postgres psql template1` (template1 is an included database)
4. Inside the postgres shell, change the password of the default user; `ALTER USER postgres with encrypted password '%YOUR_PASSWORD%';`
5. Edit the postgres config, located at `/etc/postgresql/%PG_VERSION%/main/pg_hba.conf`. Find the line that says something like the following;
    ```
    local      all     postgres     peer
    ```
    ...change `peer` to say `md5`. This changes your authentication method from unix sockets to MD5 authentication.

Now you have postgres installed and some default database to use.

> [!NOTE]
> Going forward, this guide will change as we update and harden our database.

### Connecting it to the backend
1. Create a file named `.env` in the `backend` folder.
2. In that folder, place the following things (replace the placeholders);
    ```sh
    # most of these are defaults; change them to your usecase!
    PGSQL_USER = "postgres" # or whatever you name your postgres user...
    PGSQL_PASSWORD = "%YOUR_PASSWORD%"
    PGSQL_HOST = 127.0.0.1
    PGSQL_PORT = 5432
    PGSQL_DATABASE = "postgres"
    ```

Now when you run the app, things will work as expected.

You can use tools like [pgAdmin](https://www.pgadmin.org/) to connect and view your databases with a UI.

### Installing node.js/NPM
1. Download and install `node.js`

    - [Download link](https://nodejs.org/en/download/)
    - [Installation guide](https://phoenixnap.com/kb/install-node-js-npm-on-windows)

2. After installing an issue may occur with the `npm` commands so in the terminal run the command

    - `npm install -g npm`

3. To verify that everything installed correctly run the following commands in the terminal

    - `node -v`
    - `npm -v`

4. Clone this repository

5. Run the command `npm install` to get all the dependencies

6. Run the command `npm start` which will run the project on [http://localhost:3000](http://localhost:3000) to verify everything is working properly

## Commands
The root of the repository has npm scripts to interact with both the frontend and backend; open a terminal in this directory to run the following, or execute them in their own directories to do it one at at time.

Install dependencies;
```sh
npm run install:all
```

Build the projects;
```sh
npm run build
``` 

Run the projects;
```sh
npm run dev
```

