-- 支付订单表
CREATE TABLE payment (
    id VARCHAR(64) PRIMARY KEY COMMENT '支付对象ID',
    order_no VARCHAR(64) NOT NULL COMMENT '商户订单号',
    app_id VARCHAR(64) NOT NULL COMMENT '应用ID',
    pay_channel VARCHAR(20) NOT NULL COMMENT '支付渠道',
    pay_amt DECIMAL(14,2) NOT NULL COMMENT '支付金额',
    goods_title VARCHAR(64) NOT NULL COMMENT '商品标题',
    goods_desc VARCHAR(127) NOT NULL COMMENT '商品描述',
    currency VARCHAR(3) DEFAULT 'cny' COMMENT '货币代码',
    status VARCHAR(16) NOT NULL COMMENT '支付状态',
    description VARCHAR(128) COMMENT '订单附加说明',
    expend_params TEXT COMMENT '扩展参数JSON',
    notify_url VARCHAR(250) COMMENT '异步通知地址',
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    expire_time TIMESTAMP COMMENT '订单失效时间',
    updated_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_order_no (order_no),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付订单表';

-- 支付通知记录表
CREATE TABLE payment_notify (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '通知记录ID',
    payment_id VARCHAR(64) NOT NULL COMMENT '支付对象ID',
    notify_data TEXT NOT NULL COMMENT '通知数据',
    notify_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '通知时间',
    process_status VARCHAR(16) NOT NULL COMMENT '处理状态',
    process_times INT NOT NULL DEFAULT 0 COMMENT '处理次数',
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_payment_id (payment_id),
    INDEX idx_notify_time (notify_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付通知记录表';

-- 支付日志表
CREATE TABLE payment_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    payment_id VARCHAR(64) NOT NULL COMMENT '支付对象ID',
    order_no VARCHAR(64) NOT NULL COMMENT '商户订单号',
    log_type VARCHAR(32) NOT NULL COMMENT '日志类型',
    log_content TEXT NOT NULL COMMENT '日志内容',
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_payment_id (payment_id),
    INDEX idx_order_no (order_no),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付日志表'; 