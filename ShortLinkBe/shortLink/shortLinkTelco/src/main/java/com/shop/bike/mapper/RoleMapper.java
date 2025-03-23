package com.shop.bike.mapper;

import com.shop.bike.entity.Role;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface RoleMapper {
    
    @Select("SELECT * FROM role WHERE id = #{id}")
    Optional<Role> findById(@Param("id") Long id);
    
    @Select("SELECT * FROM role WHERE code = #{code}")
    Optional<Role> findByCode(@Param("code") String code);
    
    @Insert("INSERT INTO role (code, value, created_by, created_date, last_modified_by, last_modified_date) " +
            "VALUES (#{code}, #{value}, #{createdBy}, #{createdDate}, #{lastModifiedBy}, #{lastModifiedDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Role role);
    
    @Update("UPDATE role SET " +
            "code = #{code}, " +
            "value = #{value}, " +
            "last_modified_by = #{lastModifiedBy}, " +
            "last_modified_date = #{lastModifiedDate} " +
            "WHERE id = #{id}")
    int update(Role role);
    
    @Delete("DELETE FROM role WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
    
    @Select("SELECT r.* FROM role r " +
            "INNER JOIN user_role ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId}")
    List<Role> findRolesByUserId(@Param("userId") Long userId);
} 