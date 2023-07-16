package com.atelier.assets.service;

import com.atelier.assets.dao.AssetRepository;
import com.atelier.assets.entity.Asset;
import org.springframework.stereotype.Service;

@Service
public class AssetService {
    private AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public void uploadAsset(Asset asset) {
        assetRepository.save(asset);
    }
    
    public void deleteAsset(Long asset) {
        assetRepository.deleteById(asset);
    }
}
