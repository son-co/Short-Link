package com.shop.bike.repository;

import com.shop.bike.entity.GroupLink;
import com.shop.bike.mapper.GroupLinkMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public class GroupLinkRepository {
    
    @Autowired
    private GroupLinkMapper groupLinkMapper;
    
    public Optional<GroupLink> findById(Long id) {
        return groupLinkMapper.findById(id);
    }
    
    public List<GroupLink> findAllByCreatedBy(String createdBy) {
        return groupLinkMapper.findAllByCreatedBy(createdBy);
    }
    
    public GroupLink save(GroupLink groupLink) {
        if (groupLink.getId() == null) {
            groupLinkMapper.insert(groupLink);
        } else {
            groupLinkMapper.update(groupLink);
        }
        return groupLink;
    }
    
    public void delete(GroupLink groupLink) {
        if (groupLink.getId() != null) {
            groupLinkMapper.deleteById(groupLink.getId());
        }
    }
    
    public void deleteById(Long id) {
        groupLinkMapper.deleteById(id);
    }
}
