# nokia_0024

# Mise en place de l'environnement de dev, résumé de mes actions:

ssh root@51.158.69.60
- git config
- mise en place : git clone (maintenant, git pull suffit)
docker build -f docker/Dockerfile.dev -t api .
docker run -dp 5050:5050 api
