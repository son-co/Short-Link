/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.nageoffer.shortlink.project.toolkit;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class BotDetector {
    private final StringRedisTemplate stringRedisTemplate;
    private static final List<String> BOT_USER_AGENTS = Arrays.asList(
            "bot", "spider", "crawler", "slurp", "baidu", "googlebot", "bingbot",
            "yandex", "sogou", "360", "sosospider", "msnbot", "yodaobot"
    );
    private static final String BOT_IP_KEY_PREFIX = "shortlink:bot:ip:";
    private static final String BOT_UA_KEY_PREFIX = "shortlink:bot:ua:";
    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final long BOT_IP_EXPIRE_TIME = 24;
    private static final long BOT_UA_EXPIRE_TIME = 24;

    public BotDetector(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public boolean isBot(HttpServletRequest request) {
        String ip = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        
        // 检查IP是否在黑名单中
        if (isIpBlacklisted(ip)) {
            return true;
        }
        
        // 检查User-Agent是否包含机器人标识
        if (isBotUserAgent(userAgent)) {
            markAsBot(ip, userAgent);
            return true;
        }
        
        // 检查请求频率
        if (isHighFrequencyRequest(ip)) {
            markAsBot(ip, userAgent);
            return true;
        }
        
        return false;
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StrUtil.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (StrUtil.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (StrUtil.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private boolean isBotUserAgent(String userAgent) {
        if (StrUtil.isBlank(userAgent)) {
            return true;
        }
        String lowerUserAgent = userAgent.toLowerCase();
        return BOT_USER_AGENTS.stream().anyMatch(bot -> lowerUserAgent.contains(bot.toLowerCase()));
    }

    private boolean isIpBlacklisted(String ip) {
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(BOT_IP_KEY_PREFIX + ip));
    }

    private boolean isHighFrequencyRequest(String ip) {
        String key = "shortlink:request:count:" + ip;
        Long count = stringRedisTemplate.opsForValue().increment(key);
        if (count == null) {
            return false;
        }
        if (count == 1) {
            stringRedisTemplate.expire(key, 1, TimeUnit.MINUTES);
        }
        return count > MAX_REQUESTS_PER_MINUTE;
    }

    private void markAsBot(String ip, String userAgent) {
        if (StrUtil.isNotBlank(ip)) {
            stringRedisTemplate.opsForValue().set(BOT_IP_KEY_PREFIX + ip, "1", BOT_IP_EXPIRE_TIME, TimeUnit.HOURS);
        }
        if (StrUtil.isNotBlank(userAgent)) {
            stringRedisTemplate.opsForValue().set(BOT_UA_KEY_PREFIX + userAgent, "1", BOT_UA_EXPIRE_TIME, TimeUnit.HOURS);
        }
    }
} 