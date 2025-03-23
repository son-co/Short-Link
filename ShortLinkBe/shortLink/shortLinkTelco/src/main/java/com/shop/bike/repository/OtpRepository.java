package com.shop.bike.repository;

import com.shop.bike.entity.Otp;
import com.shop.bike.mapper.OtpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Primary
public class OtpRepository {
	
	@Autowired
	private OtpMapper otpMapper;
	
	public Optional<Otp> findById(Long id) {
		return otpMapper.findById(id);
	}
	
	public Optional<Otp> findByUserName(String userName) {
		return otpMapper.findByUserName(userName);
	}
	
	public Optional<Otp> findByUserNameAndActiveKey(String userName, String activationKey) {
		return otpMapper.findByUserNameAndActiveKey(userName, activationKey);
	}
	
	public Otp save(Otp otp) {
		if (otp.getId() == null) {
			otpMapper.insert(otp);
		} else {
			otpMapper.update(otp);
		}
		return otp;
	}
	
	public void delete(Otp otp) {
		if (otp.getId() != null) {
			otpMapper.deleteById(otp.getId());
		}
	}
}
