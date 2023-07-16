package com.atelier.assets.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.atelier.assets.entity.Folder;

@RepositoryRestResource
public interface FolderRepository extends JpaRepository<Folder, Long> {

    Optional<Folder> findById(Long id);
}