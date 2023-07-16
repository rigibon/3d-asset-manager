package com.atelier.assets.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.atelier.assets.dao.FolderRepository;
import com.atelier.assets.entity.Folder;
import com.atelier.assets.entity.FolderRequest;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/folders")
@AllArgsConstructor
@CrossOrigin(origins = "${allowed.origins}")
public class FolderController {

    private final FolderRepository folderRepository;

    @GetMapping("/api/folders")
    public List<Folder> listAsset() { return folderRepository.findAll(); }

    @PostMapping("/uploadsw")
    public void saveFolder(@RequestBody FolderRequest folder) {
        Folder newFolder = new Folder(folder.name);
        folderRepository.save(newFolder);
    }
}