package com.shop.bike.service;

import com.shop.bike.entity.User;
import com.shop.bike.service.feign.dto.ShortLinkCreateReqDTO;
import com.shop.bike.service.feign.vm.Result;
import com.shop.bike.service.feign.vm.ShortLinkCreateRespDTO;
import com.shop.bike.vm.ShortLinkVM;
import com.shop.bike.vm.StatisticOverview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

public interface ShortLinkService {

	ShortLinkCreateRespDTO createShortLink(ShortLinkCreateReqDTO requestParam);
	
	Page<ShortLinkVM> findAllShortLink(ShortLinkFilterDTO filterDTO, Pageable pageable);
	
	StatisticOverview getOverview();
	
	void updateIsAccess(Boolean isAccess, String uri);

	Boolean getIsAccess(String uri);

}