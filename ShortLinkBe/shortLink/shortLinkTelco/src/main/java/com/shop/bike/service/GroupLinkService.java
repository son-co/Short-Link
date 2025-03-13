package com.shop.bike.service;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.entity.GroupLink;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.dto.GroupLinkDTO;
import com.shop.bike.service.dto.StatisticPojo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GroupLinkService {

	List<GroupLinkDTO> findAllByUser();
	
	GroupLinkDTO getDetail(Long id);
	
	void deletedGroup(Long id);
	
	GroupLinkDTO saveGroupLink(GroupLinkDTO dto);
	
}
