package com.shop.bike.service;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.pojo.GetValueIpAndPhonePojo;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.dto.StatisticPojo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface ClickCountService {

	ClickCount saveClickCount(String shortUrl, String clientId, String p, String agent);
	
	Page<ClickCount> findAllClickCount(ClickCountFilterDTO filterDTO, Pageable pageable);
	
	List<StatisticPojo> statistic(String fromDate, String toDate);
	
	void autoDeleted();

	List<GetValueIpAndPhonePojo> getValue(String shortUrl);
	
}
