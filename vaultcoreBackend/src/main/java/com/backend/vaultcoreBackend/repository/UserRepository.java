package com.backend.vaultcoreBackend.repository;
import com.backend.vaultcoreBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}