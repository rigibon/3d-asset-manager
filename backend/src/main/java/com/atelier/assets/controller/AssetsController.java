package com.atelier.assets.controller;

import com.atelier.assets.dao.AssetRepository;
import com.atelier.assets.dao.CategoryRepository;
import com.atelier.assets.dao.FolderRepository;
import com.atelier.assets.entity.Asset;
import com.atelier.assets.entity.AssetRequest;
import com.atelier.assets.entity.Category;
import com.atelier.assets.entity.Folder;
import com.atelier.assets.service.AssetService;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@AllArgsConstructor
@CrossOrigin(origins = "${allowed.origins}")
public class AssetsController {

    private final AssetRepository assetRepository;
    private final AssetService assetService;
    private final CategoryRepository categoryRepository;
    private final FolderRepository folderRepository;

    @GetMapping("/api/assets")
    public List<Asset> listAsset() { return assetRepository.findAll(); }

    @GetMapping("/{id}")
    public Asset listAsset(@PathVariable Long id) { return assetRepository.findById(id).get(); }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE )
    public ResponseEntity<Asset> deleteById(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/uploadsw")
    public void saveAsset(@RequestBody AssetRequest asset) {
        Category assetCategory = categoryRepository.findById(asset.categoryId).get();
        Folder assetFolder = folderRepository.findById(asset.folderId).get();
        Asset newAsset = new Asset(asset.name, assetCategory, asset.src, assetFolder, asset.format);
        assetRepository.save(newAsset);
    }

    @PutMapping("/{id}")
    public Asset favAsset(@PathVariable Long id, @RequestBody AssetRequest asset) {
        Asset newAsset = assetRepository.findById(id).get();
        Folder newFolder = folderRepository.findById(asset.folderId).get();

        newAsset.setFolder(newFolder);
        newAsset.setFavorite(asset.favorite);

        assetRepository.save(newAsset);

        return newAsset;
    }

    @GetMapping("/favorites")
    public List<Asset> listFavorites() {
        return assetRepository.findFavorites();
    }

    @GetMapping("/favorites/{id}")
    public List<Asset> listFavoritesByCategory(@PathVariable Long id) {
        return assetRepository.findFavoritesByCategory(id);
    }

    @GetMapping("/findByFolderIdCustom/{id}")
    public List<Asset> findByFolderId(@PathVariable Long id) {
        return assetRepository.findAssetsByFolderCustom(id);
    }
}