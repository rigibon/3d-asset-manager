package com.atelier.assets.entity;

import lombok.Data;

@Data
public class UploadResponse {
    private final String fileName;

    public UploadResponse(String fileName) {
        this.fileName = fileName;
    }
}
