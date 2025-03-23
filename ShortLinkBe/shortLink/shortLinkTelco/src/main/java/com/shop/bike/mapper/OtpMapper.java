package com.shop.bike.mapper;

import com.shop.bike.entity.Otp;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface OtpMapper {
    
    @Select("SELECT * FROM otp WHERE id = #{id}")
    Optional<Otp> findById(@Param("id") Long id);
    
    @Select("SELECT * FROM otp WHERE user_name = #{userName}")
    Optional<Otp> findByUserName(@Param("userName") String userName);
    
    @Select("SELECT * FROM otp WHERE user_name = #{userName} AND active_key = #{activeKey}")
    Optional<Otp> findByUserNameAndActiveKey(@Param("userName") String userName, @Param("activeKey") String activeKey);
    
    @Insert("INSERT INTO otp (resend_otp, otp, incorrect_otp, user_name, active_key, " +
            "created_by, created_date, last_modified_by, last_modified_date) " +
            "VALUES (#{resendOtp}, #{otp}, #{incorrectOtp}, #{userName}, #{activeKey}, " +
            "#{createdBy}, #{createdDate}, #{lastModifiedBy}, #{lastModifiedDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Otp otp);
    
    @Update("UPDATE otp SET " +
            "resend_otp = #{resendOtp}, " +
            "otp = #{otp}, " +
            "incorrect_otp = #{incorrectOtp}, " +
            "user_name = #{userName}, " +
            "active_key = #{activeKey}, " +
            "last_modified_by = #{lastModifiedBy}, " +
            "last_modified_date = #{lastModifiedDate} " +
            "WHERE id = #{id}")
    int update(Otp otp);
    
    @Delete("DELETE FROM otp WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
} 