pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/orvencasido/crud-dynamic.git'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                // This will bring down all docker-compose containers related to the project
                sh 'docker-compose down'
                
                // Optional: Kill any container that might be using port 3306
                sh '''
                    RUNNING_CONTAINER=$(docker ps --format "{{.ID}} {{.Ports}}" | grep "0.0.0.0:3306" | awk \'{print $1}\')
                    if [ ! -z "$RUNNING_CONTAINER" ]; then
                        echo "Stopping container using port 3306: $RUNNING_CONTAINER"
                        docker stop $RUNNING_CONTAINER
                    fi
                '''
            }
        }

        stage('Rebuild Docker') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
    }
}
