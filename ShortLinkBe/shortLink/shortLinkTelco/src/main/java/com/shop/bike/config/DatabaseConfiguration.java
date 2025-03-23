package com.shop.bike.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@MapperScan("com.shop.bike.mapper")
@EnableTransactionManagement
public class DatabaseConfiguration {
}
