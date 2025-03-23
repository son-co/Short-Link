package com.shop.bike.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class Role extends BaseEntity {
	private Long id;
	private String code;
	private String value;
	private List<User> users = new ArrayList<>();
}
