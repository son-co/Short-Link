package com.shop.bike.mapper;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.pojo.GetValueIpAndPhonePojo;
import com.shop.bike.service.dto.StatisticPojo;
import org.apache.ibatis.annotations.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Mapper
public interface ClickCountMapper {
    
    @Select("SELECT * FROM click_count WHERE id = #{id}")
    Optional<ClickCount> findById(@Param("id") Long id);
    
    @Insert("INSERT INTO click_count (t_domain, short_url, ip_address, origin_url, created_date, short_link_extra, agent, cookie) " +
            "VALUES (#{domain}, #{shortUrl}, #{ipAddress}, #{originUrl}, #{createdDate}, #{shortLinkExtra}, #{agent}, #{cookie})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ClickCount clickCount);
    
    @Update("UPDATE click_count SET " +
            "t_domain = #{domain}, " +
            "short_url = #{shortUrl}, " +
            "ip_address = #{ipAddress}, " +
            "origin_url = #{originUrl}, " +
            "short_link_extra = #{shortLinkExtra}, " +
            "agent = #{agent}, " +
            "cookie = #{cookie} " +
            "WHERE id = #{id}")
    int update(ClickCount clickCount);
    
    @Delete("DELETE FROM click_count WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
    
    @Select("SELECT ip_address as ipAddress, COUNT(*) as count " +
            "FROM click_count " +
            "WHERE short_url = #{shortUrl} " +
            "GROUP BY ip_address")
    List<GetValueIpAndPhonePojo> getValueIpAndPhone(@Param("shortUrl") String shortUrl);
    
    @Select("SELECT DATE(created_date) as date, COUNT(*) as count " +
            "FROM click_count " +
            "WHERE created_date BETWEEN #{fromDate} AND #{toDate} " +
            "GROUP BY DATE(created_date)")
    List<StatisticPojo> getStatistic(@Param("fromDate") Instant fromDate, @Param("toDate") Instant toDate);
    
    @Select("<script>" +
            "SELECT * FROM click_count " +
            "WHERE 1=1 " +
            "<if test='id != null'>AND id = #{id}</if> " +
            "<if test='domain != null'>AND t_domain = #{domain}</if> " +
            "<if test='ipAddress != null'>AND ip_address = #{ipAddress}</if> " +
            "<if test='shortUrl != null'>AND short_url = #{shortUrl}</if> " +
            "<if test='originUrl != null'>AND origin_url = #{originUrl}</if> " +
            "<if test='fromDate != null'>AND created_date >= #{fromDate}</if> " +
            "<if test='toDate != null'>AND created_date &lt;= #{toDate}</if> " +
            "ORDER BY created_date DESC" +
            "</script>")
    List<ClickCount> findAllWithFilter(
            @Param("id") Long id,
            @Param("domain") String domain,
            @Param("ipAddress") String ipAddress,
            @Param("shortUrl") String shortUrl,
            @Param("originUrl") String originUrl,
            @Param("fromDate") Instant fromDate,
            @Param("toDate") Instant toDate);
            
    @Select("SELECT count(DISTINCT CONCAT(cc.ip_address, '_', cc.cookie)) " +
            "FROM click_count cc " +
            "WHERE cc.short_url = #{shortUrl}")
    Integer getTotalClick(@Param("shortUrl") String shortUrl);
    
    @Select("SELECT count(DISTINCT(cc.short_link_extra)) " +
            "FROM click_count cc " +
            "WHERE cc.short_url = #{shortUrl}")
    Integer getTotalExtra(@Param("shortUrl") String shortUrl);
    
    @Delete("DELETE FROM click_count WHERE t_domain is null")
    void deleteValue();
    
    @Select("SELECT COUNT(*) FROM click_count")
    Long count();
    
    @Select("SELECT DATE(cc.created_date) as date, COUNT(*) as count " +
            "FROM click_count cc " +
            "JOIN short_link sl ON cc.short_url = sl.short_uri " +
            "WHERE cc.created_date BETWEEN #{fromDate} AND #{toDate} " +
            "AND sl.created_by = #{userLogin} " +
            "GROUP BY DATE(cc.created_date)")
    List<StatisticPojo> statisticClick(@Param("fromDate") String fromDate, 
                                     @Param("toDate") String toDate, 
                                     @Param("userLogin") String userLogin);
} 