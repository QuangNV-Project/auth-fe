pipeline {
    agent any

    environment {
        // ================= CẤU HÌNH CHUNG =================
        REMOTE_DIR_NGINX  = '/var/www/nginx/auth-fe'
        BUILD_OUTPUT_DIR = 'build' 
        
        ENV_DEV_ID  = 'env-file-react-dev'
        ENV_PROD_ID = 'env-file-react-prod'
        
        NODE_IMAGE      = 'node:24-alpine'
        // ==================================================
    }

    stages {
        // =======================================================
        // STAGE 1: BUILD & DEPLOY CHO DEV
        // =======================================================
        stage('Deploy to DEV') {
            when {
                branch 'dev'
            }
            steps {
                script {
                    echo "🚀 [DEV] Bắt đầu quy trình Build & Deploy..."

                    withCredentials([file(credentialsId: ENV_DEV_ID, variable: 'ENV_PATH')]) {
                        
                        // Copy file bí mật thành file .env nằm ngay tại thư mục gốc code
                        // Để lát nữa Docker mount vào sẽ thấy file .env này
                        sh 'cp $ENV_PATH .env'

                        docker.image(NODE_IMAGE).inside {
                            echo "🔨 Building for DEV..."
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }

                    sh 'rm .env'

                    // 2. Deploy sang Server Dev
                    echo "🚚 Đang Deploy file tĩnh sang Server DEV..."
                    withCredentials([
                        string(credentialsId: 'remote-server-dev-host', variable: 'REMOTE_HOST'),
                        string(credentialsId: 'remote-server-dev-user', variable: 'REMOTE_USER'),
                        string(credentialsId: 'remote-server-dev-port', variable: 'REMOTE_PORT'),
                        sshUserPrivateKey(credentialsId: 'remote-ssh-key-dev', keyFileVariable: 'SSH_KEY')
                    ]) {
                        // Gọi hàm deploy
                        deployReactApp(REMOTE_DIR_NGINX)
                    }
                }
            }
        }

        // =======================================================
        // STAGE 2: BUILD & DEPLOY CHO PROD
        // =======================================================
        stage('Deploy to PROD') {
            when {
                branch 'main' 
            }
            steps {
                script {
                    echo "🚨 [PROD] Bắt đầu quy trình Build & Deploy..."

                    // 1. Build React bằng Docker
                    withCredentials([file(credentialsId: ENV_PROD_ID, variable: 'ENV_PATH')]) {
                        
                        // Copy thành .env
                        sh 'cp $ENV_PATH .env'

                        docker.image(NODE_IMAGE).inside {
                            echo "🔨 Building for PROD..."
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                    
                    sh 'rm .env'

                    // 2. Deploy sang Server Prod
                    echo "🚚 Đang Deploy file tĩnh sang Server PROD..."
                    withCredentials([
                        string(credentialsId: 'remote-server-prod-host', variable: 'REMOTE_HOST'),
                        string(credentialsId: 'remote-server-prod-user', variable: 'REMOTE_USER'),
                        string(credentialsId: 'remote-server-prod-port', variable: 'REMOTE_PORT'),
                        sshUserPrivateKey(credentialsId: 'remote-ssh-key-prod', keyFileVariable: 'SSH_KEY')
                    ]) {
                        deployReactApp(REMOTE_DIR_NGINX)
                    }
                }
            }
        }

        stage('Reload') {
            steps {
                sh 'sudo nginx -s reload'
            }
        }
    }

    post {
        success {
            echo '✅ React App deployed successfully!'
            // Có thể thêm bước xóa thư mục build trên jenkins để tiết kiệm chỗ
            sh "rm -rf ${BUILD_OUTPUT_DIR}" 
        }
        failure {
            echo '❌ Deploy Failed!'
        }
    }
}

// ===================================================================================
// HÀM DEPLOY LOGIC
// ===================================================================================
def deployReactApp(targetDir) {
    // 1. Đảm bảo thư mục đích tồn tại
    sh """
        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} 'mkdir -p ${targetDir}'
    """

    sh """
        rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT}" ./${BUILD_OUTPUT_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${targetDir}/
    """
}