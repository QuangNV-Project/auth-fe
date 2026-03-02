pipeline {
    agent any

    environment {
        // ================= CẤU HÌNH CHUNG =================
        // DEV
        REMOTE_DIR_DEV_NGINX  = '/home/quangnv_dev/infra/nginx/auth-fe'

        // PROD
        REMOTE_DIR_PROD_NGINX  = '/home/quangnv/infra/nginx/auth-fe'

        BUILD_OUTPUT_DIR = 'build' 
        
        ENV_DEV_ID  = 'env-file-fe-dev'
        ENV_PROD_ID = 'env-file-fe-prod'
        
        // [UPDATE] Dùng bản 22-alpine (LTS) để ổn định nhất
        NODE_IMAGE      = 'node:22-alpine'
        
        // [NEW] Đường dẫn thư mục lưu cache trên máy chủ Jenkins (Host)
        // Bạn có thể đổi đường dẫn này tùy ý
        HOST_NPM_CACHE_DIR = '/home/quangnv_dev/npm/jenkins-npm-cache'
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

                    // Checkout code lại vì đã cleanWs ở trên
                    checkout scm

                    withCredentials([file(credentialsId: ENV_DEV_ID, variable: 'ENV_PATH')]) {
                        
                        // [CACHE CONFIG]
                        // -u 0:0  -> Chạy với quyền Root
                        // -v ...  -> Mount thư mục Host vào Container để lưu cache vĩnh viễn
                        docker.image(NODE_IMAGE).inside("-u 0:0 -v ${HOST_NPM_CACHE_DIR}:/.npm") {
                            
                            echo "📄 Creating .env file..."
                            sh "cp '${ENV_PATH}' .env"

                            echo "🔨 Building for DEV (With Cache)..."
                            
                            // Lần đầu sẽ tải về Host. Lần sau sẽ lấy từ Host -> Container (Cực nhanh)
                            sh 'npm ci'
                            sh 'npm run build'

                            // [QUAN TRỌNG] Trả lại quyền sở hữu thư mục build cho user jenkins (UID 1000)
                            // Nếu không có bước này, bước rsync/cleanWs phía sau sẽ lỗi Permission Denied
                            sh 'chown -R 1000:1000 build'
                        }
                    }

                    // Xóa file env bảo mật
                    sh 'rm .env'

                    // 2. Deploy sang Server Dev
                    echo "🚚 Đang Deploy file tĩnh sang Server DEV..."
                    withCredentials([
                        string(credentialsId: 'remote-server-dev-host', variable: 'REMOTE_HOST'),
                        string(credentialsId: 'remote-server-dev-user', variable: 'REMOTE_USER'),
                        string(credentialsId: 'remote-server-dev-port', variable: 'REMOTE_PORT'),
                        sshUserPrivateKey(credentialsId: 'remote-ssh-key-dev', keyFileVariable: 'SSH_KEY')
                    ]) {
                        deployReactApp(REMOTE_DIR_DEV_NGINX)
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
                    checkout scm

                    withCredentials([file(credentialsId: ENV_PROD_ID, variable: 'ENV_PATH')]) {
                        
                        // Áp dụng config cache tương tự cho PROD
                        docker.image(NODE_IMAGE).inside("-u 0:0 -v ${HOST_NPM_CACHE_DIR}:/.npm") {
                            
                            sh "cp '${ENV_PATH}' .env"

                            echo "🔨 Building for PROD (With Cache)..."
                            sh 'npm ci'
                            sh 'npm run build'

                            // Fix quyền
                            sh 'chown -R 1000:1000 build'
                        }
                    }
                    
                    sh 'rm .env'

                    echo "🚚 Đang Deploy file tĩnh sang Server PROD..."
                    withCredentials([
                        string(credentialsId: 'remote-server-prod-host', variable: 'REMOTE_HOST'),
                        string(credentialsId: 'remote-server-prod-user', variable: 'REMOTE_USER'),
                        string(credentialsId: 'remote-server-prod-port', variable: 'REMOTE_PORT'),
                        sshUserPrivateKey(credentialsId: 'remote-ssh-key-prod', keyFileVariable: 'SSH_KEY')
                    ]) {
                        deployReactApp(REMOTE_DIR_PROD_NGINX)
                    }
                }
            }
        }
    }

    post {
        always {
            // Dọn dẹp workspace sau khi xong việc
            cleanWs()
        }
        success {
            echo '✅ React App deployed successfully!'
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

    // 2. Upload file
    sh """
        rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT}" ./${BUILD_OUTPUT_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${targetDir}/
    """

    // 3. Reload Nginx
    echo "🔄 Reloading Nginx on Remote Server..."
    sh """
        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} 'sudo nginx -s reload'
    """
}