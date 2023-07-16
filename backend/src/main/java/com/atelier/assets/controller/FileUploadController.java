package com.atelier.assets.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;

import com.atelier.assets.service.S3Service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FileUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.atelier.assets.FileUploadResponse;
import com.atelier.assets.FileUploadUtil;
import com.atelier.assets.entity.AssetRequest;
 
@RestController
@RequiredArgsConstructor
public class FileUploadController {

    private final S3Service s3Service;
     
    @PostMapping("/uploadFile")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile multipartFile)
                    throws IOException {

        String filename = multipartFile.getOriginalFilename();
        File file = new File("src/main/resources/" + filename);
        FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), file);
        s3Service.uploadToS3(filename, new BufferedInputStream(multipartFile.getInputStream()));

        FileUploadResponse response = new FileUploadResponse();
        response.setFileName(filename);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/duplicateFile")
    public String duplicateFile(@RequestBody AssetRequest asset) throws IOException {
        FileUploadUtil.duplicateFile(asset.name);

        return asset.name;
    }

    @PostMapping("/uploadModel")
    public ResponseEntity<FileUploadResponse> uploadModel(
            @RequestParam("model") MultipartFile multipartFile)
                    throws IOException {

        String filename = multipartFile.getOriginalFilename();
        File file = new File("src/main/resources/" + filename);
        FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), file);
        s3Service.uploadToS3(filename, new BufferedInputStream(multipartFile.getInputStream()));

        FileUploadResponse response = new FileUploadResponse();
        response.setFileName(filename);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}