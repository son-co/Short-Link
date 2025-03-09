package com.shop.bike.service.impl;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.entity.Otp;
import com.shop.bike.entity.ShortLinkDO;
import com.shop.bike.entity.User;
import com.shop.bike.entity.enumeration.ErrorEnum;
import com.shop.bike.repository.ClickCountRepository;
import com.shop.bike.repository.OtpRepository;
import com.shop.bike.repository.ShortLinkRepository;
import com.shop.bike.repository.UserRepository;
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
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@Primary
@Slf4j
public class ClickCountServiceImpl implements ClickCountService {
	
	@Autowired
	private ClickCountRepository clickCountRepository;
	
	@Autowired
	private ShortLinkRepository shortLinkRepository;


	@Override
	public ClickCount saveClickCount(String shortUrl, String clientIp) {
		ShortLinkDO shortLinkDO = shortLinkRepository.findByShortUri(shortUrl);
		ClickCount clickCount = new ClickCount();
		if(shortLinkDO!=null) {
			clickCount.setDomain(shortLinkDO.getFullShortUrl());
			clickCount.setOriginUrl(shortLinkDO.getOriginUrl());
		}
		System.out.println("client id: "+ clientIp);
		clickCount.setIpAddress(clientIp);
		clickCount.setShortUrl(shortUrl);
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
		return clickCountRepository.statisticClick(fromDate, toDate);
	}
	
}
