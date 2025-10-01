package com.promin.repository;

import com.promin.entity.Review;
import com.promin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByReviewee(User reviewee);
    
    List<Review> findByReviewer(User reviewer);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee = :reviewee")
    Double getAverageRatingByReviewee(@Param("reviewee") User reviewee);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewee = :reviewee")
    long countByReviewee(@Param("reviewee") User reviewee);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee AND r.reviewer = :reviewer")
    Optional<Review> findByRevieweeAndReviewer(@Param("reviewee") User reviewee, @Param("reviewer") User reviewer);
}
