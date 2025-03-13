package com.shop.bike.repository;

import com.shop.bike.entity.GroupLink;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@Primary
public interface GroupLinkRepository extends JpaRepository<GroupLink, Long> {
    
    List<GroupLink> findAllByCreatedBy(String createBy);
    
}
