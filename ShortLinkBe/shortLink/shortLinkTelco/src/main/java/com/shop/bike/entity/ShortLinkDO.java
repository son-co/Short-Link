package com.shop.bike.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

/**
 * 短链接实体
 * 公众号：马丁玩编程，回复：加群，添加马哥微信（备注：link）获取项目资料
 */
@Data
@Builder
@Entity
@Table(name = "short_link")
@NoArgsConstructor
@AllArgsConstructor
public class ShortLinkDO extends BaseEntity {

    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    /**
     * 域名
     */
    @Column(name = "t_domain")
    private String domain;

    /**
     * 短链接
     */
    @Column(name = "short_uri")
    private String shortUri;

    /**
     * 完整短链接
     */
    @Column(name = "full_short_url")
    private String fullShortUrl;

    /**
     * 原始链接
     */
    @Column(name = "origin_url")
    private String originUrl;

    /**
     * 点击量
     */
    @Column(name = "click_num")
    private Integer clickNum;

    /**
     * 分组标识
     */
    @Column(name = "gid")
    private String gid;

    /**
     * 启用标识 0：activated 1：unactivated
     */
    @Column(name = "t_enable_status")
    private Integer enableStatus;

    /**
     * 创建类型 0：接口创建 1：控制台创建
     */
    @Column(name = "created_type")
    private Integer createdType;

    /**
     * 有效期类型 0：永久有效 1：自定义
     */
    @Column(name = "valid_date_type")
    private Integer validDateType;

    /**
     * 有效期
     */
    @Column(name = "valid_date")
    private Date validDate;

    /**
     * 描述
     */
    @Column(name = "t_describe")
    private String describe;

    /**
     * 网站标识
     */
    @Column(name = "favicon")
    private String favicon;

    /**
     * 历史PV
     */
    @Column(name = "total_pv")
    private Integer totalPv;

    /**
     * 历史UV
     */
    @Column(name = "total_uv")
    private Integer totalUv;

    /**
     * 历史UIP
     */
    @Column(name = "total_uip")
    private Integer totalUip;

    /**
     * 删除时间
     */
    @Column(name = "del_time")
    private Long delTime;
    
    @Column(name = "title")
    private String title;
}
