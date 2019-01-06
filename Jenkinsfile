pipeline {
    agent any

    environment {
        MONGO_PORT    = '27018'
        FLASK_ENV     = 'dev'
        CI            = 'true'
        REACT_APP_url = 'http://abedef.ddns.net:11801'
    }
    stages {
        stage('Build') {
            steps {
                sh 'pip install pipenv'
                script {
                    try {
                        sh 'docker stop jenkins_mongo'
                    } catch(error) {
                        echo 'OK'
                    }
                    try {
                        sh 'docker rm jenkins_mongo'
                    } catch(error) {
                        echo 'OK'
                    }
                    
                }
                sh 'docker run -v jenkins-api-data:/data/db -p 27018:27017 -d --name jenkins_mongo mongo:xenial'
                dir('APIService') {
                    sh 'pipenv install'
                }
            }
        }
        stage('Test') {
            steps {
                sh 'pip install --user pymongo'
                sh 'python -c "import pymongo; print(pymongo.MongoClient(\\"localhost:27018\\").list_databases())"'
                dir('APIService') {
                    sh 'pipenv run python -m unittest discover'
                }
            }
        }
        stage('ClientTest') {
            steps {
                dir('WebAppService') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                dir('APIService') {
                    sh 'docker-compose down'
                    sh 'docker-compose up -d'
                }
                dir('WebAppService') {
                    script {
                        try {
                            sh 'docker stop koolaid-client-staging'
                        } catch(error) {
                            echo 'OK'
                        }
                        try {
                            sh 'docker rm koolaid-client-staging'
                        } catch (error) {
                            echo 'OK'
                        }
                    }
                    sh 'docker build -t koolaid-client .'
                    sh 'docker run -p 3000:3000 -d --name koolaid-client-staging koolaid-client'
                }
                
            }
        }
    }
    post {
        always {
            sh 'docker stop jenkins_mongo && docker rm jenkins_mongo'
        }
    }
}