package com.shop.bike.mapper;

import com.shop.bike.entity.ShortLinkDO;
import org.apache.ibatis.annotations.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Mapper
public interface ShortLinkMapper {
    
    @Select("SELECT * FROM short_link WHERE id = #{id}")
    Optional<ShortLinkDO> findById(@Param("id") Long id);
    
    @Select("SELECT * FROM short_link WHERE short_uri = #{shortUri}")
    ShortLinkDO findByShortUri(@Param("shortUri") String shortUri);
    
    @Select("<script>SELECT * FROM short_link x WHERE 1=1 " +
            "<if test='userId != null'> AND x.created_by = #{userId}</if> " +
            "<if test='id != null'> AND CAST(x.id AS CHAR) LIKE CONCAT('%', #{id}, '%')</if> " +
            "<if test='groupId != null'> AND CAST(x.group_id AS CHAR) LIKE CONCAT('%', #{groupId}, '%')</if> " +
            "<if test='domain != null'> AND x.t_domain LIKE CONCAT('%', #{domain}, '%')</if> " +
            "<if test='title != null'> AND x.title LIKE CONCAT('%', #{title}, '%')</if> " +
            "<if test='titleUserCreated != null'> AND x.title_user_created LIKE CONCAT('%', #{titleUserCreated}, '%')</if> " +
            "<if test='shortUri != null'> AND x.short_uri LIKE CONCAT('%', #{shortUri}, '%')</if> " +
            "<if test='fullShortUrl != null'> AND x.full_short_url LIKE CONCAT('%', #{fullShortUrl}, '%')</if> " +
            "<if test='originUrl != null'> AND x.origin_url LIKE CONCAT('%', #{originUrl}, '%')</if> " +
            "<if test='fromDate != null'> AND x.valid_date &gt;= #{fromDate}</if> " +
            "<if test='toDate != null'> AND x.valid_date &lt;= #{toDate}</if> " +
            "ORDER BY x.valid_date DESC</script>")
    List<ShortLinkDO> findAllWithFilter(
            @Param("id") Long id,
            @Param("groupId") Long groupId,
            @Param("domain") String domain,
            @Param("shortUri") String shortUri,
            @Param("fullShortUrl") String fullShortUrl,
            @Param("originUrl") String originUrl,
            @Param("fromDate") Instant fromDate,
            @Param("toDate") Instant toDate,
            @Param("userId") String userId,
            @Param("title") String title,
            @Param("titleUserCreated") String titleUserCreated);
    
    @Select("<script>SELECT COUNT(*) FROM short_link x WHERE 1=1 " +
            "<if test='timeFrom != null'> AND x.valid_date &gt; #{timeFrom}</if> " +
            "<if test='timeTo != null'> AND x.valid_date &lt; #{timeTo}</if></script>")
    Integer getStatistic(@Param("timeFrom") Instant timeFrom, @Param("timeTo") Instant timeTo);
    
    @Insert("INSERT INTO short_link (t_domain, short_uri, full_short_url, origin_url, click_num, gid, " +
            "t_enable_status, created_type, valid_date_type, valid_date, t_describe, favicon, total_pv, " +
            "total_uv, total_uip, del_time, title, title_user_created, is_access, group_id, " +
            "created_by, created_date, last_modified_by, last_modified_date) " +
            "VALUES (#{domain}, #{shortUri}, #{fullShortUrl}, #{originUrl}, #{clickNum}, #{gid}, " +
            "#{enableStatus}, #{createdType}, #{validDateType}, #{validDate}, #{describe}, #{favicon}, " +
            "#{totalPv}, #{totalUv}, #{totalUip}, #{delTime}, #{title}, #{titleUserCreated}, " +
            "#{isAccess}, #{groupId}, #{createdBy}, #{createdDate}, #{lastModifiedBy}, #{lastModifiedDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ShortLinkDO shortLink);
    
    @Update("UPDATE short_link SET " +
            "t_domain = #{domain}, " +
            "short_uri = #{shortUri}, " +
            "full_short_url = #{fullShortUrl}, " +
            "origin_url = #{originUrl}, " +
            "click_num = #{clickNum}, " +
            "gid = #{gid}, " +
            "t_enable_status = #{enableStatus}, " +
            "created_type = #{createdType}, " +
            "valid_date_type = #{validDateType}, " +
            "valid_date = #{validDate}, " +
            "t_describe = #{describe}, " +
            "favicon = #{favicon}, " +
            "total_pv = #{totalPv}, " +
            "total_uv = #{totalUv}, " +
            "total_uip = #{totalUip}, " +
            "del_time = #{delTime}, " +
            "title = #{title}, " +
            "title_user_created = #{titleUserCreated}, " +
            "is_access = #{isAccess}, " +
            "group_id = #{groupId}, " +
            "last_modified_by = #{lastModifiedBy}, " +
            "last_modified_date = #{lastModifiedDate} " +
            "WHERE id = #{id}")
    int update(ShortLinkDO shortLink);
    
    @Delete("DELETE FROM short_link WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
} 