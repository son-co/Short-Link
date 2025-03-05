package com.shop.bike.service.feign.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * Short link creation response object
 * Public WeChat: Martin Coding, reply: join group, add WeChat (Note: link) to get project data
 */
@Data
@Getter
@Setter
public class ShortLinkTitleRespDTO {

    @JsonProperty("code")
    private String code;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private String data;

    @JsonProperty("success")
    private Boolean success;
    
    @JsonProperty("requestId")
    private String requestId;
    
}
