pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Images') {
      steps { sh 'docker-compose -p blooddonor build' }
    }
    stage('Deploy') {
      steps {
        sh 'docker-compose -p blooddonor down || true'
        sh 'docker-compose -p blooddonor up -d'
      }
    }
    stage('Verify') {
      steps {
        sh 'sleep 10'
        sh 'docker ps --filter name=blooddonor'
      }
    }
  }

  post {
    success { echo 'Build and deployment successful!' }
    failure { echo 'Build failed - check the console output.' }
  }
}
