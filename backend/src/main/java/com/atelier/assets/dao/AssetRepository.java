package com.atelier.assets.dao;

import com.atelier.assets.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByCategoryId(int category);

    List<Asset> deleteById(int asset);

    List<Asset> findByFolderId(int folder);

    List<Asset> findByFolderIdAndCategoryId(int folder, int category);

    List<Asset> findByFolderIdAndCategoryIdAndNameContaining(int folder, int category, String keyword);

    @Query(value = "SELECT * FROM `assets` WHERE `favorite` = 1", nativeQuery = true)
    List<Asset> findFavorites();

    @Query(value = "SELECT * FROM `assets` WHERE `favorite` = 1 AND `category` = :category", nativeQuery = true)
    List<Asset> findFavoritesByCategory(@Param("category") Long category);

    @Query(value = "SELECT * FROM `assets` WHERE `folder` = :folder", nativeQuery = true)
    List<Asset> findAssetsByFolderCustom(@Param("folder") Long folder);
}
