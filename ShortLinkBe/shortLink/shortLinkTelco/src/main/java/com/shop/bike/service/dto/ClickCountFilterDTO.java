package com.shop.bike.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Column;
import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@Data
public class ClickCountFilterDTO {

    private Long id;

    private String domain;

    private String shortUrl;

    private String ipAddress;

    private String originUrl;

    private Instant createdDateFrom;
    
    private Instant createDateTo;
}