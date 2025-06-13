pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/orvencasido/crud-dynamic.git'
            }
        }

        stage('Stop Existing Containers and Free Ports') {
            steps {
                sh 'docker-compose down'

                // Free port 3306 if in use
                sh '''
                    RUNNING_CONTAINER=$(docker ps --format "{{.ID}} {{.Ports}}" | grep "0.0.0.0:3306" | awk \'{print $1}\')
                    if [ ! -z "$RUNNING_CONTAINER" ]; then
                        echo "Stopping container using port 3306: $RUNNING_CONTAINER"
                        docker stop $RUNNING_CONTAINER
                    fi
                '''

                // Free port 5000 if in use
                sh '''
                    RUNNING_CONTAINER=$(docker ps --format "{{.ID}} {{.Ports}}" | grep "0.0.0.0:5000" | awk \'{print $1}\')
                    if [ ! -z "$RUNNING_CONTAINER" ]; then
                        echo "Stopping container using port 5000: $RUNNING_CONTAINER"
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
