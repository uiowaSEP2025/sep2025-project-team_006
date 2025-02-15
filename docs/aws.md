# AWS Services & Setup

This is documentation about what AWS services we are using, how we are using them, and why we are using them.


## Services

### Amazon RDS

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

[Reference Setup Link](https://jmaicaaan.medium.com/this-is-how-i-deploy-my-first-nestjs-application-into-aws-ec2-a9eab0ccf020) -
Some steps were modified to adjusted to how the setup is today.

Steps for initial setup:

1. **TODO**