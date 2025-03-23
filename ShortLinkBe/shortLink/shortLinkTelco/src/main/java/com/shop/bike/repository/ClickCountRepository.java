package com.shop.bike.repository;

import com.shop.bike.entity.ClickCount;
import com.shop.bike.mapper.ClickCountMapper;
import com.shop.bike.pojo.GetValueIpAndPhonePojo;
import com.shop.bike.service.dto.StatisticPojo;
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
public class ClickCountRepository {
    
    @Autowired
    private ClickCountMapper clickCountMapper;
    
    public Optional<ClickCount> findById(Long id) {
        return clickCountMapper.findById(id);
    }
    
    public ClickCount save(ClickCount clickCount) {
        if (clickCount.getId() == null) {
            clickCountMapper.insert(clickCount);
        } else {
            clickCountMapper.update(clickCount);
        }
        return clickCount;
    }
    
    public void delete(ClickCount clickCount) {
        if (clickCount.getId() != null) {
            clickCountMapper.deleteById(clickCount.getId());
        }
    }
    
    public List<GetValueIpAndPhonePojo> getValueIpAndPhone(String shortUrl) {
        return clickCountMapper.getValueIpAndPhone(shortUrl);
    }
    
    public List<StatisticPojo> getStatistic(Instant fromDate, Instant toDate) {
        return clickCountMapper.getStatistic(fromDate, toDate);
    }
    
    public Page<ClickCount> findAllWithFilter(Long id, String domain, String ipAddress, String shortUrl,
            String originUrl, Instant fromDate, Instant toDate, Pageable pageable) {
        List<ClickCount> results = clickCountMapper.findAllWithFilter(id, domain, ipAddress, shortUrl,
                originUrl, fromDate, toDate);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), results.size());
        return new PageImpl<>(results.subList(start, end), pageable, results.size());
    }
    
    public Integer getTotalClick(String shortUrl) {
        return clickCountMapper.getTotalClick(shortUrl);
    }
    
    public Integer getTotalExtra(String shortUrl) {
        return clickCountMapper.getTotalExtra(shortUrl);
    }
    
    public void deleteValue() {
        clickCountMapper.deleteValue();
    }
    
    public Long count() {
        return clickCountMapper.count();
    }
    
    public List<StatisticPojo> statisticClick(String fromDate, String toDate, String userLogin) {
        return clickCountMapper.statisticClick(fromDate, toDate, userLogin);
    }
}
