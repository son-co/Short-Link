package com.shop.bike.service.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class PaymentParamDTO implements Serializable {
	
	private String scMC;
	
	private String scMID;
	
	private Double scAMOUNT;
	
	private String scPAYMODE;
	
	private Integer scPAYTERM;
	
	private String scREF;
	
	private String scPAYREF;
	
	private String scCURDATA;
	
	private Double scORIGAMOUNT;
	
	private String scSTATUS;
	
	private String scSECUREHASH;
	
}
