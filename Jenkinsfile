pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                 git branch: 'main', url: 'https://github.com/orvencasido/crud-dynamic.git'
            }
        }

        stage('Rebuild Docker') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }
}
