@Data
@Component
@ConfigurationProperties(prefix = "huifu")
public class HuifuProperties {
    private String appId;
    private String merchantId;
    private String privateKey;
    private String publicKey;
    private String apiUrl;
    private String notifyUrl;
}