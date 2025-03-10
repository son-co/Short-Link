package com.shop.bike.repository;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.entity.Otp;
import com.shop.bike.service.dto.StatisticPojo;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
@Primary
public interface ClickCountRepository extends JpaRepository<ClickCount, Long> {

    @Query(value = "SELECT x.* " +
            "FROM telcosms_shortlink.click_count x " +
            "WHERE x.origin_url is not null and (:id IS NULL OR CAST(x.id AS CHAR) LIKE CONCAT('%', :id, '%')) " +
            "  AND (:domain IS NULL OR x.t_domain LIKE CONCAT('%', :domain, '%')) " +
            "  AND (:ipAddress IS NULL OR x.ip_address LIKE CONCAT('%', :ipAddress, '%')) " +
            "  AND (:shortUrl IS NULL OR x.short_url LIKE CONCAT('%', :shortUrl, '%')) " +
            "  AND (:originUrl IS NULL OR x.origin_url LIKE CONCAT('%', :originUrl, '%')) " +
            "  AND (:fromDate IS NULL OR x.created_date >= :fromDate) " +
            "  AND (:toDate IS NULL OR x.created_date <= :toDate)",
            nativeQuery = true)
    Page<ClickCount> findAllWithFilter(@Param("id") Long id,
                                       @Param("domain") String domain,
                                       @Param("ipAddress") String ipAddress,
                                       @Param("shortUrl") String shortUrl,
                                       @Param("originUrl") String originUrl,
                                       @Param("fromDate") Instant fromDate,
                                       @Param("toDate") Instant toDate,
                                       Pageable pageable);

    @Query(value = "SELECT  " +
            "    COUNT(x.id) AS totalClick,  " +
            "    DATE(x.created_date) AS date   " +
            "FROM telcosms_shortlink.click_count x " +
            "WHERE x.origin_url is not null and " +
            "(:fromDate is null or (x.created_date >= :fromDate)) " +
            "and (:toDate is null or (x.created_date <= :toDate)) " +
            "GROUP BY DATE(x.created_date); ", nativeQuery = true)
    List<StatisticPojo> statisticClick(@Param("fromDate") String fromDate,
                                       @Param("toDate") String toDate);
    
    @Query(value = "SELECT count(DISTINCT(cc.ip_address)) from click_count cc where cc.short_url =:shortUrl", nativeQuery = true)
    Integer getTotalClick(@Param("shortUrl")String shortUrl);

}
