package com.shop.bike.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class GroupLink extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String groupName;
}
