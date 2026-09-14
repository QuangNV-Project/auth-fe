pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
    }

    environment {
        BUILDX_BUILDER = 'auth-fe-builder'
        BUILD_OUTPUT_DIR = 'build'
        NODE_IMAGE = 'node:22-alpine'
        DEPLOY_COMPLETED = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    if (fileExists('.deployment-completed')) {
                        deleteFile('.deployment-completed')
                    }
                }
                checkout scm
            }
        }

        stage('Resolve deployment context') {
            steps {
                script {
                    def branch = (env.BRANCH_NAME ?: env.GIT_BRANCH ?: sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()).replaceFirst(/^origin\//, '')

                    if (!(branch in ['dev', 'main'])) {
                        echo "Branch ${branch} is outside the deployment scope."
                        return
                    }

                    def commit = sh(
                        script: 'git rev-parse --short=12 HEAD',
                        returnStdout: true
                    ).trim()
                    if (!(commit ==~ /[0-9a-f]{12}/)) {
                        error('Could not resolve a valid Git commit SHA')
                    }

                    env.DEPLOY_BRANCH = branch
                    env.DEPLOY_ENV = branch == 'dev' ? 'dev' : 'prod'
                    env.REQUIRE_PROD_APPROVAL = (env.REQUIRE_PROD_APPROVAL ?: 'false').toBoolean().toString()
                    env.BUILD_VERSION = "${env.BUILD_NUMBER}-${commit}"
                    env.ENV_CREDENTIAL_ID = branch == 'dev' ? 'env-file-fe-dev' : 'env-file-fe-prod'
                    currentBuild.displayName = "#${env.BUILD_NUMBER} ${branch} ${commit}"
                    echo "Build environment=${env.DEPLOY_ENV}, version=${env.BUILD_VERSION}, requireProdApproval=${env.REQUIRE_PROD_APPROVAL}"
                }
            }
        }

        stage('Preflight BuildKit') {
            when {
                expression { env.DEPLOY_ENV in ['dev', 'prod'] }
            }
            steps {
                sh '''#!/usr/bin/env bash
                    set -Eeuo pipefail
                    docker version --format '{{.Server.Version}}'
                    docker buildx version
                    if ! docker buildx inspect "$BUILDX_BUILDER" >/dev/null 2>&1; then
                      docker buildx create --name "$BUILDX_BUILDER" --driver docker-container || true
                    fi
                    docker buildx inspect "$BUILDX_BUILDER" --bootstrap
                '''
            }
        }

        stage('Build static artifact') {
            when {
                expression { env.DEPLOY_ENV in ['dev', 'prod'] }
            }
            steps {
                withCredentials([
                    file(credentialsId: env.ENV_CREDENTIAL_ID, variable: 'FRONTEND_ENV_FILE')
                ]) {
                    sh '''#!/usr/bin/env bash
                        set -Eeuo pipefail
                        [[ -s "$FRONTEND_ENV_FILE" ]] || { echo 'Frontend environment file is empty' >&2; exit 1; }

                        env_fingerprint="$(sha256sum "$FRONTEND_ENV_FILE" | awk '{print $1}')"
                        output_uid="$(id -u)"
                        output_gid="$(id -g)"

                        docker run --rm \
                          --volume "$WORKSPACE:/workspace" \
                          "$NODE_IMAGE" rm -rf -- "/workspace/$BUILD_OUTPUT_DIR"
                        docker buildx build --builder "$BUILDX_BUILDER" \
                          --progress plain \
                          --target artifact \
                          --secret id=frontend_env,src="$FRONTEND_ENV_FILE" \
                          --build-arg BUILD_ENV_FINGERPRINT="$env_fingerprint" \
                          --build-arg OUTPUT_UID="$output_uid" \
                          --build-arg OUTPUT_GID="$output_gid" \
                          --output "type=local,dest=$BUILD_OUTPUT_DIR" .

                        [[ -s "$BUILD_OUTPUT_DIR/index.html" ]] || { echo 'Build did not produce index.html' >&2; exit 1; }
                    '''
                }
            }
        }

        stage('Approve production deployment') {
            when {
                expression { env.DEPLOY_ENV == 'prod' && env.REQUIRE_PROD_APPROVAL == 'true' }
            }
            steps {
                script {
                    timeout(time: 30, unit: 'MINUTES') {
                        input(
                            id: "auth-fe-prod-${env.BUILD_NUMBER}",
                            message: """
PRODUCTION RELEASE GATE

Application:   auth-fe
Environment:   PROD
Branch:        ${env.DEPLOY_BRANCH}
Version:       ${env.BUILD_VERSION}
Build:         #${env.BUILD_NUMBER}

The static artifact has been built successfully and is ready to be synchronized to production.

Build details:
${env.BUILD_URL}
                            """.stripIndent().trim(),
                            ok: 'Deploy to PROD',
                            cancel: 'Abort release'
                        )
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression { env.DEPLOY_ENV in ['dev', 'prod'] }
            }
            steps {
                script {
                    deployReactApp()
                    env.DEPLOY_COMPLETED = 'true'
                    writeFile file: '.deployment-completed', text: 'true\n'
                }
            }
        }
    }

    post {
        always {
            script {
                if (env.DEPLOY_ENV in ['dev', 'prod']) {
                    sendTelegram(currentBuild.currentResult ?: 'UNKNOWN')
                } else {
                    echo 'Telegram notification skipped for a non-deployment branch.'
                }
            }
        }
        cleanup {
            deleteDir()
        }
    }
}

def deployReactApp() {
    def config = env.DEPLOY_ENV == 'dev'
        ? [
            host: 'remote-server-dev-host',
            user: 'remote-server-dev-user',
            port: 'remote-server-dev-port',
            key: 'remote-ssh-key-dev',
            targetDir: '/home/quangnv_dev/infra/nginx/auth-fe'
        ]
        : [
            host: 'remote-server-prod-host',
            user: 'remote-server-prod-user',
            port: 'remote-server-prod-port',
            key: 'remote-ssh-key-prod',
            targetDir: '/home/quangnv/infra/nginx/auth-fe'
        ]

    withCredentials([
        string(credentialsId: config.host, variable: 'REMOTE_HOST'),
        string(credentialsId: config.user, variable: 'REMOTE_USER'),
        string(credentialsId: config.port, variable: 'REMOTE_PORT'),
        sshUserPrivateKey(credentialsId: config.key, keyFileVariable: 'SSH_KEY')
    ]) {
        withEnv(["REMOTE_DIR=${config.targetDir}"]) {
            sh '''#!/usr/bin/env bash
                set -Eeuo pipefail
                chmod 600 "$SSH_KEY"

                ssh -o BatchMode=yes -o StrictHostKeyChecking=yes \
                  -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
                  "mkdir -p '$REMOTE_DIR' && chmod 755 '$REMOTE_DIR'"

                rsync -az --delete --delay-updates --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
                  -e "ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -i '$SSH_KEY' -p '$REMOTE_PORT'" \
                  "$BUILD_OUTPUT_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
            '''
        }
    }
}

def sendTelegram(status) {
    def statusIcon = [
        SUCCESS : '✅',
        FAILURE : '❌',
        UNSTABLE: '⚠️',
        ABORTED : '⏹️'
    ][status] ?: 'ℹ️'
    def escapeHtml = { value ->
        (value ?: 'N/A').toString()
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
    }
    def deployment = fileExists('.deployment-completed') ? 'Completed' : 'Not completed'
    def message = """${statusIcon} <b>auth-fe pipeline</b>

<b>Status:</b> <code>${escapeHtml(status)}</code>
<b>Environment:</b> <code>${escapeHtml(env.DEPLOY_ENV)}</code>
<b>Branch:</b> <code>${escapeHtml(env.DEPLOY_BRANCH)}</code>
<b>Version:</b> <code>${escapeHtml(env.BUILD_VERSION)}</code>
<b>Build:</b> <code>#${escapeHtml(env.BUILD_NUMBER)}</code>
<b>Deployment:</b> <code>${deployment}</code>
<b>Duration:</b> ${escapeHtml(currentBuild.durationString)}

🔗 <a href="${escapeHtml(env.BUILD_URL)}">Open Jenkins build</a>"""

    withCredentials([
        string(credentialsId: 'telegram-bot-token', variable: 'TELEGRAM_BOT_TOKEN'),
        string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
    ]) {
        withEnv(["TELEGRAM_MESSAGE=${message}"]) {
            sh '''#!/usr/bin/env bash
                set -Eeuo pipefail
                if ! curl -fsS --retry 2 -X POST \
                  "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
                  -d "chat_id=$TELEGRAM_CHAT_ID" \
                  -d 'parse_mode=HTML' \
                  --data-urlencode "text=$TELEGRAM_MESSAGE"; then
                  echo 'Telegram notification failed; pipeline result is unchanged.' >&2
                fi
            '''
        }
    }
}
