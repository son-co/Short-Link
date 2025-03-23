package com.shop.bike.repository;

import com.shop.bike.entity.ShortLinkDO;
import com.shop.bike.mapper.ShortLinkMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
@Primary
public class ShortLinkRepository {
    
    @Autowired
    private ShortLinkMapper shortLinkMapper;
    
    public Optional<ShortLinkDO> findById(Long id) {
        return shortLinkMapper.findById(id);
    }
    
    public ShortLinkDO findByShortUri(String shortUri) {
        return shortLinkMapper.findByShortUri(shortUri);
    }
    
    public Page<ShortLinkDO> findAllWithFilter(Long id, Long groupId, String domain, String shortUri,
                                              String fullShortUrl, String originUrl, Instant fromDate,
                                              Instant toDate, String userId, String title,
                                              String titleUserCreated, Pageable pageable) {
        List<ShortLinkDO> results = shortLinkMapper.findAllWithFilter(id, groupId, domain, shortUri,
                fullShortUrl, originUrl, fromDate, toDate, userId, title, titleUserCreated);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), results.size());
        return new PageImpl<>(results.subList(start, end), pageable, results.size());
    }
    
    public Integer getStatistic(Instant timeFrom, Instant timeTo) {
        return shortLinkMapper.getStatistic(timeFrom, timeTo);
    }
    
    public ShortLinkDO save(ShortLinkDO shortLink) {
        if (shortLink.getId() == null) {
            shortLinkMapper.insert(shortLink);
        } else {
            shortLinkMapper.update(shortLink);
        }
        return shortLink;
    }
    
    public void delete(ShortLinkDO shortLink) {
        if (shortLink.getId() != null) {
            shortLinkMapper.deleteById(shortLink.getId());
        }
    }
    
    public void deleteById(Long id) {
        shortLinkMapper.deleteById(id);
    }
}
