# Public Repository

As a group the four of us have decided to have our GitHub repository be public.

## Our Rationale

1. **Branch Protection**
    - Having a public repository allows us to enforce branch protection rules, ensuring that we have an approved pull request before merging into our `main` and `production` branches.
    - This is for the purpose of helping maintain code integrity and enforcing code reviews and all changes made.

2. **Pull Request Template**
    - We can utilize a pull request template to enforce a standardized proceedure for submitting changes and proving that they work as intended

3. **Github Actions**
    - Public repositories allow us to use GitHub Actions which we will need for CI/CD items
    - This will runs automated test scripts for regression testing on our `main` and `production` branches
    - This will also run ESLint scripts to ensure code consistency and to identitfy any warnings or errors.
    - This can also be used to automatically deploy our `production` branch assuming all previous test pass 
