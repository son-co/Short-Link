package com.shop.bike.repository;

import com.shop.bike.entity.Role;
import com.shop.bike.mapper.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public class RoleRepository {
    
    @Autowired
    private RoleMapper roleMapper;
    
    public Optional<Role> findById(Long id) {
        return roleMapper.findById(id);
    }
    
    public Optional<Role> findByCode(String code) {
        return roleMapper.findByCode(code);
    }
    
    public Role save(Role role) {
        if (role.getId() == null) {
            roleMapper.insert(role);
        } else {
            roleMapper.update(role);
        }
        return role;
    }
    
    public void delete(Role role) {
        if (role.getId() != null) {
            roleMapper.deleteById(role.getId());
        }
    }
    
    public List<Role> findRolesByUserId(Long userId) {
        return roleMapper.findRolesByUserId(userId);
    }
}
