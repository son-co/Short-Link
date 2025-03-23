package com.shop.bike.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class User extends BaseEntity {
	private Long id;
	private String userName;
	private String email;
	private String password;
	private String name;
	private String phone;
	private Integer status;
	private String avatar;
	private List<Role> roles = new ArrayList<>();
}