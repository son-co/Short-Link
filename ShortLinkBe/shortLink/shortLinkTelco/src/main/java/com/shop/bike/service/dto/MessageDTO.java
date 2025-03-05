package com.shop.bike.service.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class MessageDTO {

	private Long id;

	@NotNull
	@NotEmpty
	private String message;

	private String receiptId;

}