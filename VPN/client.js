const net = require('net')
const tls = require('tls')
const fs = require('fs')
const config = require('./env/config')
const whitelist = require('./whitelist')
const logger = require('./utils/logger')

// 检查域名是否在白名单中
function isDomainInWhitelist(domain) {
    // 移除端口号(如果有)
    domain = domain.split(':')[0]
    
    // 检查精确匹配
    if (whitelist.domains.includes(domain)) {
        return true
    }
    
    // 检查通配符匹配
    return whitelist.domains.some(pattern => {
        if (pattern.startsWith('*.')) {
            const baseDomain = pattern.slice(2)
            return domain === baseDomain || domain.endsWith('.' + baseDomain)
        }
        return false
    })
}

// 创建TLS连接配置
function createTlsConfig() {
    return {
        host: config.remote.host,
        port: config.remote.port,
        key: fs.readFileSync(config.tls.key),
        cert: fs.readFileSync(config.tls.cert),
        ca: [fs.readFileSync(config.tls.ca)],
        rejectUnauthorized: true
    }
}

// 统一的错误处理函数
function handleError(socket, error, context) {
    logger.error(`${context}: ${error.message}`)
    if (socket && !socket.destroyed) {
        socket.end()
    }
}

// 创建本地代理服务器
const localServer = net.createServer((clientSocket) => {
    logger.info("新的客户端连接")

    // 缓存客户端数据
    let clientData = ''

    // 当客户端发送数据时，处理HTTP或HTTPS请求
    clientSocket.on('data', (data) => {
        try {
            // 将数据追加到缓存中
            clientData += data.toString()

            // 检查是否接收到完整的HTTP请求头
            if (!clientData.includes('\r\n\r\n')) {
                return // 等待更多数据
            }

            // 解析HTTP请求行
            const [requestLine] = clientData.split('\r\n')
            const [method, path, httpVersion] = requestLine.split(' ')

            if (method === 'CONNECT') {
                handleHttpsRequest(clientSocket, path)
            } else {
                handleHttpRequest(clientSocket, clientData)
            }

            // 清空缓存
            clientData = ''
        } catch (err) {
            handleError(clientSocket, err, '请求解析错误')
        }
    })

    // 处理客户端断开连接
    clientSocket.on('end', () => {
        logger.debug("客户端断开连接")
    })

    // 处理错误
    clientSocket.on('error', (err) => {
        handleError(clientSocket, err, '客户端连接错误')
    })
})

/**
 * 处理HTTPS请求（CONNECT方法）
 */
function handleHttpsRequest(clientSocket, target) {
    logger.info(`处理HTTPS请求: ${target}`)
    
    // 从target中提取域名
    const [host, port] = target.split(':')
    
    // 检查域名是否在白名单中
    if (!isDomainInWhitelist(host)) {
        logger.info(`域名 ${host} 不在白名单中,直接连接`)
        // 直接连接到目标服务器
        const targetSocket = tls.connect({
            host: host,
            port: port || 443,
            rejectUnauthorized: false
        }, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
            clientSocket.pipe(targetSocket)
            targetSocket.pipe(clientSocket)
        })
        
        targetSocket.on('error', (err) => {
            handleError(clientSocket, err, '目标服务器连接错误')
        })
        return
    }

    // 连接到远程代理服务器
    const remoteSocket = tls.connect(createTlsConfig(), () => {
        logger.info(`已连接到远程代理服务器,目标: ${target}`)
        if (remoteSocket.authorized) {
            logger.debug('TLS认证成功')
        } else {
            handleError(remoteSocket, new Error(`TLS认证失败: ${remoteSocket.authorizationError}`), 'TLS认证')
            return
        }

        // 构造JSON数据
        const jsonData = JSON.stringify({
            type: 'CONNECT',
            target: target
        })

        remoteSocket.write(jsonData)

        // 等待远程服务器响应
        remoteSocket.once('data', (response) => {
            const responseStr = response.toString()
            logger.debug(`收到远程服务器响应: ${responseStr.length} 字节`)

            if (responseStr.startsWith('HTTP/1.1 200')) {
                logger.info("隧道建立成功")

                // 响应客户端，表示隧道已建立
                clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')

                // 开始双向转发数据
                clientSocket.pipe(remoteSocket)
                remoteSocket.pipe(clientSocket)
            } else {
                handleError(clientSocket, new Error('隧道建立失败'), '隧道建立')
            }
        })
    })

    // 处理远程服务器断开连接
    remoteSocket.on('end', () => {
        logger.debug("远程服务器断开连接")
        clientSocket.end()
    })

    // 处理错误
    remoteSocket.on('error', (err) => {
        handleError(clientSocket, err, '远程服务器连接错误')
    })
}

function handleHttpRequest(clientSocket, requestData) {
    logger.info("处理HTTP请求")

    // 解析HTTP请求头
    const [requestLine, ...headers] = requestData.split('\r\n')
    const [method, path, httpVersion] = requestLine.split(' ')

    // 提取目标地址（从Host头字段中）
    const hostHeader = headers.find((header) => header.startsWith('Host:'))
    if (!hostHeader) {
        handleError(clientSocket, new Error("缺少Host头"), '请求解析')
        return
    }
    const targetAddress = hostHeader.split(' ')[1] // 提取Host值

    logger.info(`目标地址: ${targetAddress}`)
    
    // 检查域名是否在白名单中
    if (!isDomainInWhitelist(targetAddress)) {
        logger.info(`域名 ${targetAddress} 不在白名单中,直接连接`)
        // 直接连接到目标服务器
        const targetSocket = net.connect({
            host: targetAddress,
            port: 80
        }, () => {
            targetSocket.write(requestData)
        })
        
        targetSocket.on('data', (data) => {
            clientSocket.write(data)
        })
        
        targetSocket.on('end', () => {
            clientSocket.end()
        })
        
        targetSocket.on('error', (err) => {
            handleError(clientSocket, err, '目标服务器连接错误')
        })
        return
    }

    // 连接到远程服务器
    const remoteSocket = tls.connect(createTlsConfig(), () => {
        logger.info("已连接到远程代理服务器")
        if (remoteSocket.authorized) {
            logger.debug('TLS认证成功')
        } else {
            handleError(remoteSocket, new Error(`TLS认证失败: ${remoteSocket.authorizationError}`), 'TLS认证')
            return
        }

        // 构造JSON数据
        const jsonData = JSON.stringify({
            type: 'HTTP',
            target: targetAddress,
            payload: requestData
        })

        logger.debug(`转发请求到远程服务器: ${targetAddress}`)
        remoteSocket.write(jsonData)
    })

    // 当远程服务器返回数据时，转发给客户端
    remoteSocket.on('data', (data) => {
        logger.debug(`收到远程服务器响应: ${data.length} 字节`)
        clientSocket.write(data)
    })

    // 处理远程服务器断开连接
    remoteSocket.on('end', () => {
        logger.debug("远程服务器断开连接")
        clientSocket.end()
    })

    // 处理错误
    remoteSocket.on('error', (err) => {
        handleError(clientSocket, err, '远程服务器连接错误')
    })
}

// 启动本地代理服务器
localServer.listen(config.local.port, () => {
    logger.info(`本地代理服务器启动成功,监听端口: ${config.local.port}`)
})