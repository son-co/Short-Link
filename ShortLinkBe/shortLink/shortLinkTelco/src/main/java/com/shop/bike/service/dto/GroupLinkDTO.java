package com.shop.bike.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;

@Data
public class GroupLinkDTO implements Serializable {

	/**
	 * 
	 */
	private Long id;

	private String groupName;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	private Instant createdDate;

}
