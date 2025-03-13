package com.shop.bike.vm;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.util.Date;

/**
 * A DTO for the {@link com.malu.base.profile.domain.Wards} entity.
 */
@Getter
@Setter
public class ShortLinkVM {

    private Long id;

    private String domain;

    private String shortUri;
    
    private String fullShortUrl;

    private String originUrl;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Date validDate;

    private String describe;

    private String title;

    private String favicon;
    
    private Integer totalClick;

    private String titleUserCreated;
    
    private Long groupId;
    
    private Boolean isAccess;
}
