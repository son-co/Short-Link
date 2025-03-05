package com.shop.bike.admin;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.service.ClickCountService;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.dto.StatisticPojo;
import com.shop.bike.utils.PaginationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/api/v1/admin")
@Slf4j
public class ClickCountAdminStatisticResource {
    
	@Autowired
    private ClickCountService service;
    

    @GetMapping("/click-count/get-list")
    public ResponseEntity<List<ClickCount>> getMyOrderAdmin(ClickCountFilterDTO filterDTO, Pageable pageable) {
        Page<ClickCount> page = service.findAllClickCount(filterDTO, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
    
    @GetMapping("/click-count/get-statistic")
    public ResponseEntity<List<StatisticPojo>> statisticClick(String fromDate, String toDate) {
        return ResponseEntity.ok(service.statistic(fromDate, toDate));
    }
}
