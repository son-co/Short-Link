package com.shop.bike.service;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.dto.StatisticPojo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface ClickCountService {

	ClickCount saveClickCount(String shortUrl, String clientId, String p);
	
	Page<ClickCount> findAllClickCount(ClickCountFilterDTO filterDTO, Pageable pageable);
	
	List<StatisticPojo> statistic(String fromDate, String toDate);
	
	void autoDeleted();
	
}
