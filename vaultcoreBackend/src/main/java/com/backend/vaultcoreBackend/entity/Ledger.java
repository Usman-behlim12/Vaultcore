package com.backend.vaultcoreBackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Ledger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private User account;

    private BigDecimal amount;
    private String type; // CREDIT / DEBIT
    private LocalDateTime timestamp = LocalDateTime.now();

    public Ledger(String tid, User acc, BigDecimal amt, String type) {
        this.transactionId = tid;
        this.account = acc;
        this.amount = amt;
        this.type = type;
    }
}