package com.atelier.assets.controller;

import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.atelier.assets.entity.AssetRequest;
import com.atelier.assets.representation.BucketObjectRepresentation;
import com.atelier.assets.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/buckets")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping(value = "/{bucketName}")
    public void createBucket(@PathVariable String bucketName, @RequestParam boolean publicBucket){
        s3Service.createS3Bucket(bucketName, publicBucket);
    }

    @GetMapping
    public List<String> listBuckets(){
        var buckets = s3Service.listBuckets();
        var names = buckets.stream().map(Bucket::getName).collect(Collectors.toList());
        return names;
    }

    @DeleteMapping(value = "/{bucketName}")
    public void deleteBucket(@PathVariable String bucketName){
        s3Service.deleteBucket(bucketName);
    }

    @PostMapping(value = "/{bucketName}/objects")
    public void createObject(@PathVariable String bucketName, @RequestBody BucketObjectRepresentation representation, @RequestParam boolean publicObject) throws IOException {
        s3Service.putObject(bucketName, representation, publicObject);
    }

    @GetMapping(value = "/{bucketName}/objects/{objectName}")
    public ResponseEntity<byte[]> downloadObject(@PathVariable String bucketName, @PathVariable String objectName) throws IOException {
        S3Object object = s3Service.downloadObject(bucketName, objectName);
        S3ObjectInputStream objectInputStream = object.getObjectContent();
        byte[] bytes = IOUtils.toByteArray(objectInputStream);
        String fileName = URLEncoder.encode(objectName, "UTF-8").replaceAll("\\+", "%20");

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        httpHeaders.setContentLength(bytes.length);
        httpHeaders.setContentDispositionFormData("attachment", fileName);

        return new ResponseEntity<>(bytes, httpHeaders, HttpStatus.OK);
    }

    @PostMapping(value = "duplicate")
    public void duplicateToS3(@RequestBody AssetRequest asset) throws IOException {
        S3Object object = s3Service.downloadObject("assets-admin", "default.jpg-650.png");
        S3ObjectInputStream objectInputStream = object.getObjectContent();

        s3Service.uploadToS3("default.jpg-650_" + asset.name + ".png", objectInputStream);
    }

    @PostMapping(value = "upload")
    public void uploadToS3(@RequestParam("file")MultipartFile multipart) throws IOException {
        String filename = multipart.getOriginalFilename();
        File file = new File("src/main/resources/" + filename);
        FileUtils.copyInputStreamToFile(multipart.getInputStream(), file);
        s3Service.uploadToS3(filename, new BufferedInputStream(multipart.getInputStream()));
    }

    @PatchMapping(value = "/{bucketSourceName}/objects/{objectName}/{bucketTargetName}")
    public void moveObject(@PathVariable String bucketSourceName, @PathVariable String objectName, @PathVariable String bucketTargetName) {
        s3Service.moveObject(bucketSourceName, objectName, bucketTargetName);
    }

    @GetMapping(value = "/{bucketName}/objects")
    public List<String> listObjects(@PathVariable String bucketName) {
        return s3Service.listObjects(bucketName).stream().map(S3ObjectSummary::getKey).collect(Collectors.toList());
    }

    @DeleteMapping(value = "/{bucketName}/objects/{objectName}")
    public void deleteObject(@PathVariable String bucketName, @PathVariable String objectName) {
        s3Service.deleteObject(bucketName, objectName);
    }

    @DeleteMapping(value = "/{bucketName}/objects")
    public void deleteObject(@PathVariable String bucketName, @RequestBody List<String> objects) {
        s3Service.deleteMultipleObjects(bucketName, objects);
    }
}