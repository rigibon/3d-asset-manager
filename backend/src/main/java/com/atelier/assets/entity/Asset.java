package com.atelier.assets.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="ASSETS")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="name")
    private String name;

    @ManyToOne
    @JoinColumn(name="category")
    private Category category;

    @Column(name="src")
    private String src;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name="folder")
    private Folder folder;

    @Column(name="format")
    private String format;

    @Column(name="cover")
    private String cover;

    @Column(name="favorite")
    private Boolean favorite;

    public Asset(String name, Category category, String src, Folder folder, String format) {
        this.name = name;
        this.category = category;
        this.src = src;
        this.folder = folder;
        this.format = format;
    }
}