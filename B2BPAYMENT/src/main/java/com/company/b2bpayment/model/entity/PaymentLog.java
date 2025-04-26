@Data
@Entity
@Table(name = "payment_log")
public class PaymentLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentId;

    private String orderNo;

    private String logType;

    @Column(columnDefinition = "TEXT")
    private String logContent;

    private LocalDateTime createdTime;
}