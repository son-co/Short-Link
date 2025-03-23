package com.shop.bike.mapper;

import com.shop.bike.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    
    @Select("SELECT * FROM jhi_user WHERE id = #{id}")
    Optional<User> findById(@Param("id") Long id);
    
    @Select("SELECT * FROM jhi_user WHERE user_name = #{userName}")
    Optional<User> findByUserName(@Param("userName") String userName);
    
    @Select("SELECT u.* FROM jhi_user u " +
            "LEFT JOIN user_role ur ON u.id = ur.user_id " +
            "LEFT JOIN role r ON ur.role_id = r.id " +
            "WHERE u.id = #{id} " +
            "AND (#{status} IS NULL OR u.status = #{status}) " +
            "AND (#{authority} IS NULL OR r.code = #{authority})")
    Optional<User> findByIdAndAuthorityAndStatus(
            @Param("id") Long id,
            @Param("authority") String authority,
            @Param("status") Integer status);
    
    @Insert("INSERT INTO jhi_user (user_name, email, password, name, phone, status, avatar, " +
            "created_by, created_date, last_modified_by, last_modified_date) " +
            "VALUES (#{userName}, #{email}, #{password}, #{name}, #{phone}, #{status}, #{avatar}, " +
            "#{createdBy}, #{createdDate}, #{lastModifiedBy}, #{lastModifiedDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE jhi_user SET " +
            "email = #{email}, " +
            "password = #{password}, " +
            "name = #{name}, " +
            "phone = #{phone}, " +
            "status = #{status}, " +
            "avatar = #{avatar}, " +
            "last_modified_by = #{lastModifiedBy}, " +
            "last_modified_date = #{lastModifiedDate} " +
            "WHERE id = #{id}")
    int update(User user);
    
    @Delete("DELETE FROM jhi_user WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
    
    @Select("SELECT * FROM jhi_user WHERE status = 1")
    List<User> findAllActiveUsers();
    
    @Insert("INSERT INTO user_role (user_id, role_id) VALUES (#{userId}, #{roleId})")
    int insertUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);
    
    @Delete("DELETE FROM user_role WHERE user_id = #{userId}")
    int deleteUserRoles(@Param("userId") Long userId);
} 