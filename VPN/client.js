const net = require('net')
const tls = require('tls')
const fs = require('fs')
const config = require('./env/config')

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

// 创建本地代理服务器
const localServer = net.createServer((clientSocket) => {
    console.log("++++++++本地链接")

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
            console.error(`XX本地数据解析错误: ${err.message}`)
            clientSocket.end()
        }
    })

    // 处理客户端断开连接
    clientSocket.on('end', () => {
        console.log("---------本地断开")
    })

    // 处理错误
    clientSocket.on('error', (err) => {
        console.error(`XXXXXXX本地错误: ${err.message}`)
    })
})

/**
 * 处理HTTPS请求（CONNECT方法）
 */
function handleHttpsRequest(clientSocket, target) {
    console.log(`HTTPS: ${target}`)

    // 连接到远程代理服务器
    const remoteSocket = tls.connect(createTlsConfig(), () => {
        console.log(`+++++HTTPS链接到远程，Target=${target}`)
        if (remoteSocket.authorized) {
            console.log('已成功连接到代理服务器并完成客户端认证！')
        } else {
            console.error('连接到代理服务器失败或客户端认证失败:', remoteSocket.authorizationError)
            remoteSocket.destroy()
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
            console.log(`建立隧道回复....: ${responseStr.length}`)

            if (responseStr.startsWith('HTTP/1.1 200')) {
                console.log("和远程建立隧道成功。。。")

                // 响应客户端，表示隧道已建立
                clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')

                // 开始双向转发数据
                clientSocket.pipe(remoteSocket)
                remoteSocket.pipe(clientSocket)
            } else {
                console.error("和远程建立隧道失败！！！")
                clientSocket.end()
            }
        })
    })

    // 处理远程服务器断开连接
    remoteSocket.on('end', () => {
        console.log("---远程断开")
        clientSocket.end()
    })

    // 处理错误
    remoteSocket.on('error', (err) => {
        console.error(`xxx远程错误: ${err.message}`)
        clientSocket.end()
    })
}

function handleHttpRequest(clientSocket, requestData) {
    console.log("HTTP")

    // 解析HTTP请求头
    const [requestLine, ...headers] = requestData.split('\r\n')
    const [method, path, httpVersion] = requestLine.split(' ')

    // 提取目标地址（从Host头字段中）
    const hostHeader = headers.find((header) => header.startsWith('Host:'))
    if (!hostHeader) {
        throw new Error("host缺失")
    }
    const targetAddress = hostHeader.split(' ')[1] // 提取Host值

    console.log(`目标地址: ${targetAddress}`)

    // 连接到远程服务器
    const remoteSocket = tls.connect(createTlsConfig(), () => {
        console.log("+++HTTP链接到远程")
        if (remoteSocket.authorized) {
            console.log('已成功连接到代理服务器并完成客户端认证！')
        } else {
            console.error('连接到代理服务器失败或客户端认证失败:', remoteSocket.authorizationError)
            remoteSocket.destroy()
        }

        // 构造JSON数据
        const jsonData = JSON.stringify({
            type: 'HTTP',
            target: targetAddress,
            payload: requestData
        })

        console.log(`#转发给远程: Target=${targetAddress}`)
        remoteSocket.write(jsonData)
    })

    // 当远程服务器返回数据时，转发给客户端
    remoteSocket.on('data', (data) => {
        console.log(`@回复数据: ${data.toString().length}`)
        clientSocket.write(data)
    })

    // 处理远程服务器断开连接
    remoteSocket.on('end', () => {
        console.log("---远程断开")
        clientSocket.end()
    })

    // 处理错误
    remoteSocket.on('error', (err) => {
        console.error(`xxx远程错误: ${err.message}`)
        clientSocket.end()
    })
}

// 启动本地代理服务器
localServer.listen(config.local.port, () => {
    console.log(`启动本地代理服务器，端口：${config.local.port}`)
})