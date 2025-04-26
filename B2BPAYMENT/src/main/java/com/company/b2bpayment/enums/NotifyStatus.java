public enum NotifyStatus {
    PENDING("pending", "待处理"),
    PROCESSING("processing", "处理中"),
    SUCCESS("success", "处理成功"),
    FAILED("failed", "处理失败");

    private final String code;
    private final String desc;

    NotifyStatus(String code, String desc) {
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