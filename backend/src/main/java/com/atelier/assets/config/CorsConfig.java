package com.atelier.assets.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Value("${allowed.origins")
    public String[] allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/login")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("*")
                        .exposedHeaders("*");

                registry.addMapping("/upload")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("*")
                        .exposedHeaders("*");

                registry.addMapping("/api/assets/**")
                    .allowedOrigins(allowedOrigins)
                    .allowedMethods("*")
                    .exposedHeaders("*");

                registry.addMapping("/files/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("*")
                        .exposedHeaders("*");

                registry.addMapping("/files/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("*")
                        .exposedHeaders("*");

                registry.addMapping("/downloadModel/**")
                    .allowedOrigins(allowedOrigins)
                    .allowedMethods("*")
                    .exposedHeaders("*");


                registry.addMapping("/delete/**")
                    .allowedOrigins(allowedOrigins)
                    .allowedMethods("*")
                    .exposedHeaders("*");

                registry.addMapping("/**")
                    .allowedOrigins(allowedOrigins)
                    .allowedMethods("*")
                    .exposedHeaders("*");
            }

           @Override
           public void addResourceHandlers(ResourceHandlerRegistry registry) {
           registry
               .addResourceHandler("/resources/**")
               .addResourceLocations("classpath:/resources/");
           }
        };
    }
}
