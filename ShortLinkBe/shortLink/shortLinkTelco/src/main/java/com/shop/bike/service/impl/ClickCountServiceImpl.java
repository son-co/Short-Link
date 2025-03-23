package com.shop.bike.service.impl;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.entity.Otp;
import com.shop.bike.entity.ShortLinkDO;
import com.shop.bike.entity.User;
import com.shop.bike.entity.enumeration.ErrorEnum;
import com.shop.bike.pojo.GetValueIpAndPhonePojo;
import com.shop.bike.repository.ClickCountRepository;
import com.shop.bike.repository.OtpRepository;
import com.shop.bike.repository.ShortLinkRepository;
import com.shop.bike.repository.UserRepository;
import com.shop.bike.security.SecurityUtils;
import com.shop.bike.service.ClickCountService;
import com.shop.bike.service.MailService;
import com.shop.bike.service.OtpService;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.dto.MailRequestDTO;
import com.shop.bike.service.dto.OtpDTO;
import com.shop.bike.service.dto.StatisticPojo;
import com.shop.bike.service.dto.mapper.OtpMapper;
import com.shop.bike.utils.Utils;
import com.shop.bike.web.rest.errors.BadRequestAlertException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.*;

@Service
@Transactional
@Primary
@Slf4j
public class ClickCountServiceImpl implements ClickCountService {
	
	@Autowired
	private ClickCountRepository clickCountRepository;
	
	@Autowired
	private ShortLinkRepository shortLinkRepository;

	private static final String BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	private static final int BASE = 62;
	private static final int FIXED_LENGTH = 8; // Fixed output length



	@Override
	public ClickCount saveClickCount(String shortUrl, String clientIp,String cookie, String p,String agent) {
		ShortLinkDO shortLinkDO = shortLinkRepository.findByShortUri(shortUrl);
		ClickCount clickCount = new ClickCount();
		if(shortLinkDO!=null) {
			clickCount.setDomain(shortLinkDO.getFullShortUrl());
			clickCount.setOriginUrl(shortLinkDO.getOriginUrl());
		}

		clickCount.setShortUrl(Objects.requireNonNullElse(shortUrl, ""));
		clickCount.setIpAddress(Objects.requireNonNullElse(clientIp, ""));
		clickCount.setAgent(Objects.requireNonNullElse(agent, ""));
        clickCount.setCookie(Objects.requireNonNullElse(cookie, ""));

		if(p!=null) {
			clickCount.setShortLinkExtra(decodePhone(p));
		}else{
			clickCount.setShortLinkExtra("");
		}
		return clickCountRepository.save(clickCount);
		
	}

	@Override
	public Page<ClickCount> findAllClickCount(ClickCountFilterDTO filterDTO, Pageable pageable) {
		return clickCountRepository.findAllWithFilter(filterDTO.getId(),
				filterDTO.getDomain(), filterDTO.getIpAddress(), filterDTO.getShortUrl(),
				filterDTO.getOriginUrl(), filterDTO.getCreatedDateFrom(), filterDTO.getCreateDateTo(), pageable);
	}

	@Override
	public List<StatisticPojo> statistic(String fromDate, String toDate) {
		return clickCountRepository.statisticClick(fromDate, toDate, SecurityUtils.getCurrentUserLogin().get());
	}

	@Override
	public void autoDeleted() {
		clickCountRepository.deleteValue();
	}

	@Override
	public List<GetValueIpAndPhonePojo> getValue(String shortUrl) {
		return clickCountRepository.getValueIpAndPhone(shortUrl);
	}

	public static String encodePhone(String phoneNumber) {
		BigInteger num = new BigInteger(phoneNumber);
		StringBuilder encoded = new StringBuilder();

		while (num.compareTo(BigInteger.ZERO) > 0) {
			encoded.insert(0, BASE62.charAt(num.mod(BigInteger.valueOf(BASE)).intValue()));
			num = num.divide(BigInteger.valueOf(BASE));
		}

		// Pad to ensure 8 characters
		while (encoded.length() < FIXED_LENGTH) {
			encoded.insert(0, "0");
		}

		return encoded.toString();
	}

	// 2️⃣ Decoding: 8-character string -> Original phone number
	public static String decodePhone(String encoded) {
		BigInteger num = BigInteger.ZERO;

		for (char c : encoded.toCharArray()) {
			num = num.multiply(BigInteger.valueOf(BASE)).add(BigInteger.valueOf(BASE62.indexOf(c)));
		}

		return num.toString();
	}

	public static void main(String[] args) {
		String phoneNumber = "639163003715"; // Philippine phone number
		String encoded = encodePhone(phoneNumber);
		String decoded = decodePhone(encoded);

		System.out.println("Original Phone Number: " + phoneNumber);
		System.out.println("Encoded: " + encoded);
		System.out.println("Decoded: " + decoded);
		System.out.println("Match: " + phoneNumber.equals(decoded));
	}

}
