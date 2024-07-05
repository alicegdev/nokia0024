# nokia_0024

# Mise en place Devops, résumé de mes actions:

sudo dockerd to launch Docker if you didn't setup automatic launch in WSL

# docker build -f docker/Dockerfile.dev -t api .

# docker run -dp 5050:5050 api

https://www.youtube.com/watch?v=FTNKDgN4CGI

need to install aws cli : sudo apt install awscli
Create AWS-CLI user

# Then "aws configure" in WSL with the API key and the secret

# docker build -t docker/Dockerfile.dev -t api .

# Stage

docker build -t nokia0024_back .
docker tag api:latest 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024_back:latest
docker push 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024_back:latest

# Certbot

docker build -t nokia0024-certbot .
docker tag nokia0024-certbot:latest 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024-certbot:latest
docker push 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024-certbot:latest

# Proxy

docker build -t nokia0024-proxy .
docker tag nokia0024-proxy:latest 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024-proxy:latest
docker push 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024-proxy:latest

# Db

docker build -t nokia0024-db .
docker tag nokia0024-db:latest 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024-db:latest
docker push 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024-db:latest

-> Login to aws-cli (your credentials are already saved in console if you've configured them):

# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 891377270838.dkr.ecr.us-east-1.amazonaws.com

# docker push 891377270838.dkr.ecr.us-east-1.amazonaws.com/nokia0024_back:latest

# Création du proxy

docker compose -f docker-compose.yml up -d

# Création des certificats

docker compose -f docker-compose.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d nokia0024-api.com

# Pushed to GitLab
