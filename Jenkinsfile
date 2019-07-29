pipeline {
    agent {
        dockerfile true
    }
    parameters {
        string(name: 'ServerPort', defaultValue: '8080', description: 'The tcp port to listen on')
        string(name: 'DBServer', defaultValue: '127.0.0.1', description: 'The name/ip of the DB server')
        string(name: 'DBPort', defaultValue: '3306', description: 'The tcp port of the DB server')
        string(name: 'DBName', defaultValue: 'dbTest2', description: 'The database name on the DB server')
        string(name: 'DBUser', defaultValue: 'test', description: 'The name of the DB service user')
        //password(name: 'DBPassword', description: 'Password of the DB service user')
    }
    environment {
        SERVER_PORT = ${params.ServerPort}
        DB_SERVER   = ${params.DBServer}
        DB_PORT     = ${params.DBPort}
        DB_NAME     = ${params.DBName}
        DB_USER     = ${params.DBUser}
        DB_PASSWORD = credentials('db-password')
    }
    stages {
        stage('Test') {
            steps {
                sh 'netstat -ltn | grep -qE "^[^:]*:+8080\\>"'
            }
        }
    }
}

// vim: set ft=groovy sw=4 ts=4 et indk= :
