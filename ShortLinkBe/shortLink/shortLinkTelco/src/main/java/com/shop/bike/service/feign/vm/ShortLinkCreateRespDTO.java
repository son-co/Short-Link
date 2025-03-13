package com.shop.bike.service.feign.vm;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.Instant;
import java.util.Date;

/**
 * Short link creation response object
 * Public WeChat: Martin Coding, reply: join group, add WeChat (Note: link) to get project data
 */
@Data
@Getter
@Setter
public class ShortLinkCreateRespDTO {

    @JsonProperty("code")
    private String code;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private Data data;

    @JsonProperty("requestId")
    private String requestId;

    @JsonProperty("success")
    private Boolean success;
    
    private String title;
    
    private String favicon;
    
    private Long groupId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date validDate;
    

    @Getter
    @Setter
    public static class Data {
        
        @JsonProperty("gid")
        private String gid;
        
        @JsonProperty("originUrl")
        private String originUrl;
        
        @JsonProperty("fullShortUrl")
        private String fullShortUrl;
    }
}
