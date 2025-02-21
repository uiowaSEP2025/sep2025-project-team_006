# AWS Services & Setup

This is documentation about what AWS services we are using, how we are using them, and why we are using them.


## Services

### Amazon RDS

**NOTE: *This method caused us to be charged, if we decide to go this route again the instructions must change in some aspects. This will be kept here for record to show what did not work properly.***

[Amazon Relational Database Service](https://aws.amazon.com/rds/?did=ft_card&trk=ft_card)

[Reference Setup Link](https://medium.com/@achelengwanelson/how-to-setup-a-database-on-aws-rds-a2dc17fc38ec) -
Some steps were modified to adjusted to how the setup is today.

Steps for initial setup:

1. Log in to AWS
2. Search for RDS on the console home
3. Click on Databases found on the left side, and then click Create database on the right side
4. Selected Standard create, and then picked PostgreSQL
5. The engine version we picked was `17.2-R1` since locally we had installed `17.2`
6. Selected the Production template as well as the Single DB instance, since this project will not be widely available publicly.
7. DB instance identifier is: `gap-sql-1`
8. Added credentials:
    - Master unsername: `postgres`
    - Credentials management: `Self managed`
    - Master password: `********`
9. For Instance configuration:
    - Turn on Include previous generation classes
    - Select Burstable classes (includes t classes)
    - Then pick `db.t3.micro`
10. For Storage:
    - Storage type: `General Purpose SSD (gp3)`
    - Allocated storage: `200`
    - Enable storage autoscaling
    - Maximum storage threshold: `1000`
11. For Connectivity:
    - Don't connect to an EC2 compute resouce - this was done because the `EC2` compute resouce had not been created yet.
    - Network tpye: `IPv4`
    - Virtual private cloud: `Default VPC`
    - DB subnet group: `Default`
    - Public access: `No`
    - Everything else is left as the default
12. Database authentication: `Password authentication`
13. Disable Monitorting as it is not fully included in the free tier
14. Additional configuration:
    - Initial database name: `gapdb`
    - Enable automated backups
    - Backup retention period: `7 days`
    - Backup window: `No preference`
    - Enable deletion protection
15. An Estimated monthly cost is shown, as far as I am aware of this shouldn't charge us as we selected the free tier before all this configuration

### Amazon EC2

[Amazon EC2](https://aws.amazon.com/ec2/?did=ft_card&trk=ft_card)

[Reference EC2 Setup Guide](https://www.youtube.com/watch?v=86Tuwtn3zp0)

[Reference Deployment Link](https://jmaicaaan.medium.com/this-is-how-i-deploy-my-first-nestjs-application-into-aws-ec2-a9eab0ccf020) -
Some steps were modified to adjusted to how the setup is today.

Steps for initial setup:

1. Log in to the AWS console, and find the EC2 Instance.
2. Launch a new instance
3. Added name `gap-backend`
4. For Application and OS Images:
    - Select Ubuntu
    - Then select Ubuntu Server 24.04 LTS (Free tier eligible)
    - Keep the 640bit (x86) architecture
5. Instane type: `t2.micro` (Free tier eligible)
6. Key pair (login) - created a new key pair
    - Name: `gap_backend_key`
    - Key pair type: `RSA`
    - Private key file format: `.pem`
7. Network settings:
    - Allow SSH traffic from: `Anywhere` (will likely change to one location later)
    - Allow HTTP/HTTPS traffic from internet
8. In the terminal locate the location of the `.pem` file that was downloaded and run the following command: `chmod 400 <filename>.pem`
    - This needs to be done in a Linux terminal
    - If on windows, move the file to a Linux installation or a WSL installation to continue
9. Then to remote into the EC2 instance run: `ssh -v -i <filename>.pem ubuntu@<public-ip>`
10. Once in, we need to install `node` from:
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
11. After installation is complete, we need to activate NVM by running: `. ~/.nvm/nvm.sh`
12. Then install node by running `nvm install node`
13. Verify the node version from: `node -v`
14. Then we clone this repository into the instance with ssh.

For now the EC2 instance is running a PostgreSQL database locally, ideally we will want to change this as storage needs and complexity increases. The Postgres setup can be found in the main `README.md` file in the root directory.

15. Assuming the database is all configured, then to deploy manually we must run the following commands:
    ```sh
    $ npm run build

    $ npm run start:prod
    ```
    