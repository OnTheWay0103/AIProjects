public enum PaymentStatus {
    PENDING("pending", "处理中"),
    SUCCEEDED("succeeded", "支付成功"),
    FAILED("failed", "支付失败");

    private final String code;
    private final String desc;

    PaymentStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}