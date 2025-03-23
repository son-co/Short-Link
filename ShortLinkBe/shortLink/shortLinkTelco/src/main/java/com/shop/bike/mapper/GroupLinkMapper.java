package com.shop.bike.mapper;

import com.shop.bike.entity.GroupLink;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface GroupLinkMapper {
    
    @Select("SELECT * FROM group_link WHERE id = #{id}")
    Optional<GroupLink> findById(@Param("id") Long id);
    
    @Select("SELECT * FROM group_link WHERE created_by = #{createdBy}")
    List<GroupLink> findAllByCreatedBy(@Param("createdBy") String createdBy);
    
    @Insert("INSERT INTO group_link (group_name, created_by, created_date, last_modified_by, last_modified_date) " +
            "VALUES (#{groupName}, #{createdBy}, #{createdDate}, #{lastModifiedBy}, #{lastModifiedDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(GroupLink groupLink);
    
    @Update("UPDATE group_link SET " +
            "group_name = #{groupName}, " +
            "last_modified_by = #{lastModifiedBy}, " +
            "last_modified_date = #{lastModifiedDate} " +
            "WHERE id = #{id}")
    int update(GroupLink groupLink);
    
    @Delete("DELETE FROM group_link WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
} 