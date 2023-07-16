package com.atelier.assets;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.ResourceLoader;
import org.springframework.web.multipart.MultipartFile;
 
public class FileUploadUtil {

    public static void duplicateFile(String fileName) throws IOException {
        Path placeholder = Paths.get("Files-Upload/default.jpg-650.png");
        Path target = Paths.get("Files-Upload/default.jpg-650_" + fileName + ".png");

        try {
 
            Files.copy(placeholder, target);
 
        } catch (FileAlreadyExistsException ex) {
            System.err.format("File %s already exists.", target);
        } catch (IOException ex) {
            System.err.format("I/O Error when copying file");
        }
    }

    public static String saveModel(String modelName, MultipartFile multipartFile)
            throws IOException {
        Path uploadPath = Paths.get("models");
          
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
         
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(modelName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {       
            throw new IOException("Could not save file: " + modelName, ioe);
        }
         
        return modelName;
    }
}