package com.shop.bike.service.dto;

import java.time.Instant;

public interface MessagePojo {

	String getMessage();

	Instant getCreatedDate();

	String getReceiptId();

	String getChatId();
}