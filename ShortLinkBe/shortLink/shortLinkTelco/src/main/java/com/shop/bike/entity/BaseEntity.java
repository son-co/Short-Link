package com.shop.bike.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.time.Instant;

public abstract class BaseEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@JsonIgnore
	private String createdBy;
	
	@JsonIgnore
	private Instant createdDate = Instant.now();
	
	@JsonIgnore
	private String lastModifiedBy;
	
	@JsonIgnore
	private Instant lastModifiedDate = Instant.now();
	
	public String getCreatedBy() {
		return createdBy;
	}
	
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	
	public Instant getCreatedDate() {
		return createdDate;
	}
	
	public void setCreatedDate(Instant createdDate) {
		this.createdDate = createdDate;
	}
	
	public String getLastModifiedBy() {
		return lastModifiedBy;
	}
	
	public void setLastModifiedBy(String lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}
	
	public Instant getLastModifiedDate() {
		return lastModifiedDate;
	}
	
	public void setLastModifiedDate(Instant lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}
}