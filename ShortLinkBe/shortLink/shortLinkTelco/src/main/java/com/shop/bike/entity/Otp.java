package com.shop.bike.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class Otp extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private Integer resendOtp;
    private String otp;
    private Integer incorrectOtp;
    private String userName;
    private String activeKey;
    
    public Otp id(Long id) {
        this.setId(id);
        return this;
    }
    
    public Otp resendOtp(Integer resendOtp) {
        this.setResendOtp(resendOtp);
        return this;
    }
    
    public Otp otp(String otp) {
        this.setOtp(otp);
        return this;
    }
    
    public Otp incorrectOtp(Integer incorrectOtp) {
        this.setIncorrectOtp(incorrectOtp);
        return this;
    }
}
