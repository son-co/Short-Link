package com.shop.bike.admin;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.service.ClickCountService;
import com.shop.bike.service.ShortLinkService;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.feign.dto.ShortLinkCreateReqDTO;
import com.shop.bike.service.feign.vm.ShortLinkCreateRespDTO;
import com.shop.bike.utils.PaginationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/api/v1/consumer/public")
@Slf4j
public class ClickCountAdminResource {
    
	@Autowired
    private ClickCountService service;


    @GetMapping("/click-count/{shortUrl}/{clientIp}")
    public ResponseEntity<ClickCount> createShortLink(@PathVariable("shortUrl") String shortUrl,@PathVariable("clientIp") String clientIp) {
        return ResponseEntity.ok(service.saveClickCount(shortUrl, clientIp));
    }

}
