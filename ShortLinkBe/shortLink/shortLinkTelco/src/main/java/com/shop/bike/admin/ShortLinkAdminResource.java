package com.shop.bike.admin;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.service.ShortLinkFilterDTO;
import com.shop.bike.service.ShortLinkService;
import com.shop.bike.service.dto.ClickCountFilterDTO;
import com.shop.bike.service.feign.dto.ShortLinkCreateReqDTO;
import com.shop.bike.service.feign.vm.Result;
import com.shop.bike.service.feign.vm.ShortLinkCreateRespDTO;
import com.shop.bike.utils.PaginationUtil;
import com.shop.bike.vm.LoginVM;
import com.shop.bike.vm.ShortLinkVM;
import com.shop.bike.vm.StatisticOverview;
import com.shop.bike.web.rest.errors.UsernameNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/api/v1/admin")
@Slf4j
public class ShortLinkAdminResource {
    
	@Autowired
    private ShortLinkService service;


    @PostMapping("/short-link/create")
    public ResponseEntity<ShortLinkCreateRespDTO> createShortLink(@RequestBody ShortLinkCreateReqDTO requestParam) {
        return ResponseEntity.ok(service.createShortLink(requestParam));
    }


    @GetMapping("/short-link/get-list")
    public ResponseEntity<List<ShortLinkVM>> getMyOrderAdmin(ShortLinkFilterDTO filterDTO, Pageable pageable) {
        Page<ShortLinkVM> page = service.findAllShortLink(filterDTO, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
    
    @GetMapping("/overview/statistic")
    public ResponseEntity<StatisticOverview> getStatistic() {
        log.debug("get statistic overview");
        return ResponseEntity.ok(service.getOverview());
    }
}
