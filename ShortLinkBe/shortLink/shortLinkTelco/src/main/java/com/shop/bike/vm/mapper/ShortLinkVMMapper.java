package com.shop.bike.vm.mapper;

import com.shop.bike.entity.Otp;
import com.shop.bike.entity.ShortLinkDO;
import com.shop.bike.service.EntityMapper;
import com.shop.bike.service.dto.OtpDTO;
import com.shop.bike.vm.ShortLinkVM;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link Otp} and its DTO {@link OtpDTO}.
 */
@Mapper(componentModel = "spring")
public interface ShortLinkVMMapper extends EntityMapper<ShortLinkVM, ShortLinkDO> {
}
