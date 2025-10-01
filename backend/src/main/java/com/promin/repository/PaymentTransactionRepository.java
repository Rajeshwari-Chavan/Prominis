package com.promin.repository;

import com.promin.entity.PaymentTransaction;
import com.promin.entity.PaymentStatus;
import com.promin.entity.PaymentType;
import com.promin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    
    List<PaymentTransaction> findByPayer(User payer);
    
    List<PaymentTransaction> findByPayee(User payee);
    
    List<PaymentTransaction> findByStatus(PaymentStatus status);
    
    List<PaymentTransaction> findByType(PaymentType type);
    
    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.payer = :payer AND p.status = 'COMPLETED'")
    BigDecimal getTotalPaidByUser(@Param("payer") User payer);
    
    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.payee = :payee AND p.status = 'COMPLETED'")
    BigDecimal getTotalReceivedByUser(@Param("payee") User payee);
    
    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.type = 'COMMISSION' AND p.status = 'COMPLETED'")
    BigDecimal getTotalPlatformRevenue();
}
