package com.atelier.assets.controller;

import com.atelier.assets.dao.CategoryRepository;
import com.atelier.assets.entity.Category;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@AllArgsConstructor
@CrossOrigin(origins = "${allowed.origins}")
public class CategoriesController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/api/categories")
    public List<Category> listCategory() { return categoryRepository.findAll(); }

    @GetMapping("/hola")
    public String hola() { return "Hola"; }

    @GetMapping("/{name}")
    public Optional<Category> findByName(@PathVariable String name) { return categoryRepository.findByName(name); };

}