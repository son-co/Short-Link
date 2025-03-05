package com.shop.bike.service.dto;

import com.shop.bike.entity.enumeration.PaymentGateway;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class NotificationDTO {

    private Long id;

    private String title;

    private String content;

}