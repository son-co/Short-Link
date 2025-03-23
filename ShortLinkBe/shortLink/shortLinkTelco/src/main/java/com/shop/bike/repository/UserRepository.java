package com.shop.bike.repository;

import com.shop.bike.entity.User;
import com.shop.bike.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public class UserRepository {
	
	@Autowired
	private UserMapper userMapper;
	
	public Optional<User> findById(Long id) {
		return userMapper.findById(id);
	}
	
	public Optional<User> findOneWithAuthoritiesByLogin(String login) {
		return userMapper.findByUserName(login);
	}
	
	public Optional<User> findByIdAndAuthorityAndStatus(Long id, List<String> authorities, Integer status) {
		return userMapper.findByIdAndAuthorityAndStatus(id, authorities != null && !authorities.isEmpty() ? authorities.get(0) : null, status);
	}
	
	public User save(User user) {
		if (user.getId() == null) {
			userMapper.insert(user);
		} else {
			userMapper.update(user);
		}
		return user;
	}
	
	public void delete(User user) {
		if (user.getId() != null) {
			userMapper.deleteUserRoles(user.getId());
			userMapper.deleteById(user.getId());
		}
	}
	
	public List<User> findAllUser() {
		return userMapper.findAllActiveUsers();
	}
	
	public Integer statisticUser() {
		return userMapper.findAllActiveUsers().size();
	}
}