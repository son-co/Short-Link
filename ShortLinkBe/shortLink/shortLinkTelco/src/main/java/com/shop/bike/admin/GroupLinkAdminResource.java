package com.shop.bike.admin;

import com.shop.bike.service.GroupLinkService;
import com.shop.bike.service.ShortLinkFilterDTO;
import com.shop.bike.service.ShortLinkService;
import com.shop.bike.service.dto.GroupLinkDTO;
import com.shop.bike.service.feign.dto.ShortLinkCreateReqDTO;
import com.shop.bike.service.feign.vm.ShortLinkCreateRespDTO;
import com.shop.bike.utils.PaginationUtil;
import com.shop.bike.vm.ShortLinkVM;
import com.shop.bike.vm.StatisticOverview;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Controller
@RequestMapping("/api/v1/admin")
@Slf4j
public class GroupLinkAdminResource {
    
	@Autowired
    private GroupLinkService service;


    @PostMapping("/group-link/create")
    public ResponseEntity<GroupLinkDTO> createGroupLink(@RequestBody GroupLinkDTO dto) {
        return ResponseEntity.ok(service.saveGroupLink(dto));
    }

    @PutMapping("/group-link/update")
    public ResponseEntity<GroupLinkDTO> updateGroupLink(@RequestBody GroupLinkDTO dto) {
        return ResponseEntity.ok(service.saveGroupLink(dto));
    }


    @GetMapping("/group-link/get-list")
    public ResponseEntity<List<GroupLinkDTO>> getMyOrderAdmin() {
        List<GroupLinkDTO> page = service.findAllByUser();
        return ResponseEntity.ok(page);
    }

    @GetMapping("/group-link/{id}")
    public ResponseEntity<GroupLinkDTO> getDetail(@PathVariable("id")Long id) {
        GroupLinkDTO page = service.getDetail(id);
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/group-link/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable("id")Long id) {
        service.deletedGroup(id);
        return ResponseEntity.noContent().build();
    }
    
    
}
