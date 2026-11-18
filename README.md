# Blood Donor Platform

4 containers: frontend (nginx), backend (Node/Express), db (MongoDB), gateway (nginx reverse proxy).

Run locally:  docker-compose up --build   ->  http://localhost:8081

CI/CD: GitHub -> Jenkins (Jenkinsfile) -> docker-compose build & deploy.
