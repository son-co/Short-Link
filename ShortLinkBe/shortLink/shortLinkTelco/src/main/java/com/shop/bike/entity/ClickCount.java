package com.shop.bike.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "click_count")
@Setter
@Getter
public class ClickCount {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
	@SequenceGenerator(name = "sequenceGenerator")
	@Column(name = "id")
	private Long id;

    @Column(name = "t_domain")
    private String domain;

    @Column(name = "short_url")
    private String shortUrl;
	
	@Column(name = "ip_address")
	private String ipAddress;
	
	@Column(name = "origin_url")
	private String originUrl;

	@CreatedDate
	@Column(name = "created_date", updatable = false)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	private Instant createdDate = Instant.now();
	
	@Column(name = "short_link_extra")
	private String shortLinkExtra;

	@Column(name = "agent")
	private String agent;

	@Column(name = "cookie")
	private String cookie;
}
