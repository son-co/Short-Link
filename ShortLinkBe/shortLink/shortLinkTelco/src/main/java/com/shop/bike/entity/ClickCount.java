package com.shop.bike.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
public class ClickCount {
	private Long id;
	private String domain;
	private String shortUrl;
	private String ipAddress;
	private String originUrl;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	private Instant createdDate = Instant.now();
	
	private String shortLinkExtra;
	private String agent;
	private String cookie;
}
