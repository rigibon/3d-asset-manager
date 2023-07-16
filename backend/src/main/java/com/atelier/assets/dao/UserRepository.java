package com.atelier.assets.dao;

import com.atelier.assets.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(@Param("email") String email);

    User findById(@Param("id") int id);

    Optional<User> findOneByEmail(String email);

}
