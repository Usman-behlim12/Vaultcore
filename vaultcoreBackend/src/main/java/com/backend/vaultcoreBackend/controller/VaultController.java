package com.backend.vaultcoreBackend.controller;

import com.backend.vaultcoreBackend.entity.Ledger;
import com.backend.vaultcoreBackend.entity.User;
import com.backend.vaultcoreBackend.repository.LedgerRepository;
import com.backend.vaultcoreBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173") // React URL
public class VaultController {

    @Autowired private UserRepository userRepo;
    @Autowired private LedgerRepository ledgerRepo;

    // 1. LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        User user = userRepo.findByUsername(data.get("username"));
        if (user != null && user.getPassword().equals(data.get("password"))) {
            // Fake Token for Demo (Real impl needs JJWT library)
            return ResponseEntity.ok(Map.of(
                "token", "fake-jwt-token-" + UUID.randomUUID(), 
                "username", user.getUsername()
            ));
        }
        return ResponseEntity.status(401).body("Invalid Login");
    }

    // 2. GET BALANCE
    @GetMapping("/balance/{username}")
    public ResponseEntity<?> getBalance(@PathVariable String username) {
        User user = userRepo.findByUsername(username);
        return ResponseEntity.ok(Map.of("balance", user.getBalance()));
    }

    // 3. TRANSFER MONEY (The Core Feature)
    @PostMapping("/transfer")
    @Transactional(isolation = Isolation.SERIALIZABLE) // Week 2 Requirement: ACID
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> data) {
        String fromUser = (String) data.get("from");
        String toUser = (String) data.get("to");
        BigDecimal amount = new BigDecimal(data.get("amount").toString());

        User sender = userRepo.findByUsername(fromUser);
        User receiver = userRepo.findByUsername(toUser);

        if (sender == null || receiver == null) return ResponseEntity.badRequest().body("User not found");
        if (sender.getBalance().compareTo(amount) < 0) return ResponseEntity.badRequest().body("Insufficient Funds");

        // Logic
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        userRepo.save(sender);
        userRepo.save(receiver);

        // Double Entry Ledger
        String txnId = UUID.randomUUID().toString();
        ledgerRepo.save(new Ledger(txnId, sender, amount, "DEBIT"));
        ledgerRepo.save(new Ledger(txnId, receiver, amount, "CREDIT"));

        return ResponseEntity.ok(Map.of("message", "Transfer Successful", "txnId", txnId));
    }

    // 4. HISTORY
    @GetMapping("/history/{username}")
    public List<Ledger> getHistory(@PathVariable String username) {
        User user = userRepo.findByUsername(username);
        return ledgerRepo.findByAccountOrderByTimestampDesc(user);
    }
}