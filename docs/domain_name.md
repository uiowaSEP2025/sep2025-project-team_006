# Domain Name Process

1. With the GitHub education account I was able to get a free `.tech` domain from: https://get.tech/github-student-developer-pack
2. After I acquired that and I was able to get past the initial account setup I set up the DNS by adding the public `IPv4` address on the AWS EC2 console
3. Then I did the update and upgrade commands
    ```sh
    $ sudo apt-get update
    $ sudo apt-get upgrade -y
    ```
4. Then I installed Nginx
    ```sh
    $ sudo apt-get install nginx -y
    $ sudo systemctl start nginx
    $ sudo systemctl enable nginx
    ```
5. Then I verified it was listening on 80 and 443: `sudo ss -tlnp | grep nginx`
6. After this I had to configure the app to redirect to the correct port by creating a `.conf` file and adding a certain configuration to it.
    ```sh
    sudo nano /etc/nginx/sites-available/yourdomain.conf
    ```
    ```conf
    server {
        # Redirect all HTTP (port 80) to HTTPS
        listen 80;
        server_name gradappsite.tech www.gradappsite.tech;
        return 301 https://$host$request_uri;
    }

    server {
        # HTTPS block
        listen 443 ssl;
        server_name gradappsite.tech www.gradappsite.tech;

        # SSL cert and key (will be filled in by Certbot)
        ssl_certificate /etc/letsencrypt/live/gradappsite.tech/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/gradappsite.tech/privkey.pem;

        # Proxy all traffic to Node on port 5000
        location / {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $remote_addr;
        }
    }
    ```
7. Then I enabled it and reloaded the site
    ```sh
    $ sudo nginx -t
    $ sudo systemctl reload nginx
    ```
8. To request the cerificate I had to run these commands:
    ```sh
    $ sudo apt-get install certbot python3-certbot-nginx -y

    # Request a certificate (cover root domain + www if you have both):
    $ sudo certbot --nginx -d gradappsite.tech -d www.gradappsite.tech
    ```
9. After that assuming everything was setup properly it worked. Though realisitically there was plenty of trouble shooting along the way, the `.conf` script took some time to find a proper configuration that worked as well as the `DNS` might not have been quick to update publicly.

## Key Commands Reference

Here are some other commands and references that I had found and had used along the way for debugging purposes. 
I'm adding these here in case there is ever a need to use them.

### System Update / Firewall (Ubuntu/Debian):
```
$ sudo apt-get update && sudo apt-get upgrade -y
$ sudo ufw status
$ sudo ufw allow 80
$ sudo ufw allow 443
```
### Nginx Installation & Control:
```
$ sudo apt-get install nginx -y
$ sudo systemctl start nginx
$ sudo systemctl enable nginx
$ sudo systemctl reload nginx
$ sudo nginx -t
$ sudo ss -tlnp | grep nginx
```

### DNS Checks:
```
$ nslookup yourdomain.com
```

### Certbot:
```
$ sudo apt-get install certbot python3-certbot-nginx -y
$ sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
