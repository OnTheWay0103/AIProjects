@Data
@Entity
@Table(name = "payment_notify")
public class PaymentNotify {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentId;

    @Column(columnDefinition = "TEXT")
    private String notifyData;

    private LocalDateTime notifyTime;

    private String processStatus;

    private Integer processTimes;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;
}