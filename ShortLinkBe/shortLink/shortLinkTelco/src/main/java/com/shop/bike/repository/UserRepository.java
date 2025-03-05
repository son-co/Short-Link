package com.shop.bike.repository;

import com.shop.bike.entity.User;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public interface UserRepository extends JpaRepository<User, Long> {
	
	@Query("select u from User u where u.status = 1")
	List<User> findAllUser();

	@Query(value = "SELECT u.* from jhi_user u left join user_role ur on u.id = ur.user_id where u.user_name =:userName", nativeQuery = true)
	Optional<User> findOneWithAuthoritiesByLogin(@Param("userName") String login);

	@Query(
			"SELECT DISTINCT p from User p join p.roles a where p.id=:id " +
					" and (:status is null or p.status=:status) " +
					"and (COALESCE(:authorities, null) is null or a.code=:authorities)"
	)
	Optional<User> findByIdAndAuthorityAndStatus(
			@Param("id") Long id,
			@Param("authorities") List<String> authorities,
			@Param("status") Integer status
	);
	

	@Query(value = "SELECT count(x.id) FROM jhi_user x " +
			"left join user_role ur on ur.user_id = x.id " +
			"where ur.role_id = 2", nativeQuery = true)
	Integer statisticUser();
}