package com.shop.bike.utils;

import com.shop.bike.service.ClickCountService;
import com.shop.bike.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ScheduleUtils {

    @Autowired
    private ClickCountService clickCountService;

   

    @Scheduled(fixedDelay = 3000000)
    public void deleteValue() {
        clickCountService.autoDeleted();
    }

}