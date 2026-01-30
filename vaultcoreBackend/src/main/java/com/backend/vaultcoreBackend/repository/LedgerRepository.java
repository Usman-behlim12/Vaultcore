package com.backend.vaultcoreBackend.repository;
import com.backend.vaultcoreBackend.entity.Ledger;
import com.backend.vaultcoreBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findByAccountOrderByTimestampDesc(User account);
}