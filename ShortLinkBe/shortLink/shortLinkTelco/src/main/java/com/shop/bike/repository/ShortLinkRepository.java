package com.shop.bike.repository;

import com.shop.bike.entity.ShortLinkDO;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Repository
@Primary
public interface ShortLinkRepository extends JpaRepository<ShortLinkDO, Long> {

    ShortLinkDO findByShortUri(String shortUri);
    
    @Query(value = " SELECT x.*   " +
            "            FROM telcosms_shortlink.short_link  x   " +
            "            WHERE  (:userId is null or x.created_by = :userId )" +
            "              AND (:id IS NULL OR CAST(x.id AS CHAR) LIKE CONCAT('%', :id, '%'))   " +
            "              AND (:groupId IS NULL OR CAST(x.group_id AS CHAR) LIKE CONCAT('%', :groupId, '%'))   " +
            "              AND (:domain IS NULL OR x.t_domain LIKE CONCAT('%', :domain, '%'))   " +
            "              AND (:title IS NULL OR x.title LIKE CONCAT('%', :title, '%'))   " +
            "              AND (:titleUserCreated IS NULL OR x.title_user_created LIKE CONCAT('%', :titleUserCreated, '%'))   " +
            "              AND (:shortUri IS NULL OR x.short_uri  LIKE CONCAT('%', :shortUri, '%'))   " +
            "              AND (:fullShortUrl IS NULL OR x.full_short_url  LIKE CONCAT('%', :fullShortUrl, '%'))   " +
            "              AND (:originUrl IS NULL OR x.origin_url LIKE CONCAT('%', :originUrl, '%'))   " +
            "              AND (:fromDate IS NULL OR x.valid_date  >= :fromDate)   " +
            "              AND (:toDate IS NULL OR x.valid_date <= :toDate) order by x.valid_date desc ",
            countQuery = "SELECT COUNT(*) FROM telcosms_shortlink.short_link x " +
            "WHERE (:userId IS NULL OR x.created_by = :userId) " +
            "AND (:id IS NULL OR CAST(x.id AS CHAR) LIKE CONCAT('%', :id, '%')) " +
            "AND (:groupId IS NULL OR CAST(x.group_id AS CHAR) LIKE CONCAT('%', :groupId, '%')) " +
            "AND (:domain IS NULL OR x.t_domain LIKE CONCAT('%', :domain, '%')) " +
            "AND (:title IS NULL OR x.title LIKE CONCAT('%', :title, '%')) " +
            "AND (:titleUserCreated IS NULL OR x.title_user_created LIKE CONCAT('%', :titleUserCreated, '%')) " +
            "AND (:shortUri IS NULL OR x.short_uri LIKE CONCAT('%', :shortUri, '%')) " +
            "AND (:fullShortUrl IS NULL OR x.full_short_url LIKE CONCAT('%', :fullShortUrl, '%')) " +
            "AND (:originUrl IS NULL OR x.origin_url LIKE CONCAT('%', :originUrl, '%')) " +
            "AND (:fromDate IS NULL OR x.valid_date >= :fromDate) " +
            "AND (:toDate IS NULL OR x.valid_date <= :toDate)",
            nativeQuery = true)
    Page<ShortLinkDO> findAllWithFilter(@Param("id") Long id,
                                        @Param("groupId") Long groupId,
                                        @Param("domain") String domain,
                                        @Param("shortUri") String shortUri,
                                        @Param("fullShortUrl") String fullShortUrl,
                                        @Param("originUrl") String originUrl,
                                        @Param("fromDate") Instant fromDate,
                                        @Param("toDate") Instant toDate,
                                        @Param("userId") String userId,
                                        @Param("title") String title,
                                        @Param("titleUserCreated") String titleUserCreated,
                                        Pageable pageable);
    
    @Query(value = "SELECT count(*) " +
            "FROM telcosms_shortlink.short_link x " +
            "where  " +
            "(:timeFrom is null or x.valid_date > :timeFrom) " +
            "and (:timeTo is null or x.valid_date < :timeTo)", nativeQuery = true)
    Integer getStatistic( @Param("timeFrom") Instant timeFrom,
                                        @Param("timeTo") Instant timeTo);
    
    
}
