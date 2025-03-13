package com.shop.bike.service.impl;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.shop.bike.entity.GroupLink;
import com.shop.bike.entity.ShortLinkDO;
import com.shop.bike.entity.enumeration.ErrorEnum;
import com.shop.bike.repository.ClickCountRepository;
import com.shop.bike.repository.GroupLinkRepository;
import com.shop.bike.repository.ShortLinkRepository;
import com.shop.bike.security.SecurityUtils;
import com.shop.bike.service.GroupLinkService;
import com.shop.bike.service.ShortLinkFilterDTO;
import com.shop.bike.service.ShortLinkService;
import com.shop.bike.service.dto.GroupLinkDTO;
import com.shop.bike.service.dto.mapper.GroupLinkMapper;
import com.shop.bike.service.feign.dto.ShortLinkCreateReqDTO;
import com.shop.bike.service.feign.vm.ShortLinkCreateRespDTO;
import com.shop.bike.utils.JsonConverter;
import com.shop.bike.vm.ShortLinkVM;
import com.shop.bike.vm.StatisticOverview;
import com.shop.bike.vm.mapper.ShortLinkVMMapper;
import com.shop.bike.web.rest.errors.BadRequestAlertException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
@Transactional
@Primary
@Slf4j
public class GroupLinkServiceImpl implements GroupLinkService {

    @Autowired
    private GroupLinkRepository repository;
    
    @Autowired
    private GroupLinkMapper mapper;

    @Override
    public List<GroupLinkDTO> findAllByUser() {
        return repository.findAllByCreatedBy(SecurityUtils.getCurrentUserLogin().get())
                .stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public GroupLinkDTO getDetail(Long id) {
        return mapper.toDto(repository.findById(id)
                .orElseThrow(()-> new BadRequestAlertException(ErrorEnum.GROUP_NOT_FOUND)));
    }

    @Override
    public void deletedGroup(Long id) {
        repository.deleteById(id);
    }

    @Override
    public GroupLinkDTO saveGroupLink(GroupLinkDTO dto) {
        GroupLink groupLink;
        if(dto.getId()==null) {
            groupLink = mapper.toEntity(dto);
        }
        else {
            groupLink = repository.findById(dto.getId())
                    .orElseThrow(()-> new BadRequestAlertException(ErrorEnum.GROUP_NOT_FOUND));
            mapper.partialUpdate(groupLink, dto);
        }
        return mapper.toDto(repository.save(groupLink));
    }
}