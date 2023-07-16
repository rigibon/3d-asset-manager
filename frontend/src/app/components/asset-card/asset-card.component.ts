import { Component, Input, Injectable, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/common/asset';
import { AssetsService } from 'src/app/services/assets.service';
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function fitCameraToObject(scene: any, camera: any, object: any, offset: any) {

	offset = offset || 1.5;

	const boundingBox = new THREE.Box3();

	boundingBox.setFromObject(object);
	const box = new THREE.BoxHelper(object, 0xffff00);

	const center = boundingBox.getCenter(new THREE.Vector3());
	const size = boundingBox.getSize(new THREE.Vector3());

	var boxHeight = new THREE.Vector3();
	boundingBox.getSize(boxHeight);
	var boxWidth = new THREE.Vector3();
	boundingBox.getSize(boxWidth);

	camera.position.set(center.x + (boxWidth.z), center.y, center.z + (boxWidth.z * 1.4));
	camera.lookAt(center);
}

@Component({
	selector: 'app-asset-card',
	templateUrl: './asset-card.component.html',
	styleUrls: ['./asset-card.component.css']
})

export class AssetCardComponent {
	// @ts-ignore
	@ViewChild("assetImageLoaded", { static: true }) assetImageLoaded: ElementRef;
	@Input() asset_image_src: string = "";
	@Input() nameAsset: string = "";
	@Input() asset: Asset = new Asset(0, "", 1, "", 0, "", "", false);
	scene: any;
	camera: any;
	loader: any;
	renderer: any
	assetLoaded: boolean = false;
	imageLoaded: boolean = false;
	loadingAsset: boolean = true;

	constructor(public assetsService: AssetsService) {

	}

	onLoadImage() {
		this.loadingAsset = false;
	}

	onLoadAssetImage() {
		this.loader.load("https://assets-backend.onrender.com/downloadModel/" + this.nameAsset, (gltf: any) => {
			while(this.scene.children.length > 0){ 
			  this.scene.remove(this.scene.children[0]); 
			}

			var materials: any = [];
			var materialNames: any = [];

			gltf.scene.traverse((child: any) => {
				if (child.isMesh && materialNames.indexOf(child.material.name) === -1) {
					materials.push(child.material);
					materialNames.push(child.material.name);

					var newMaterial = { name: child.material.name, categoryId: 2, src: "default.jpg-650.png", folderId: 1, format: "Material" };

					// this.assetsService.duplicateFile(newMaterial).subscribe((data: any) => { });

					this.assetsService.getNewAsset(newMaterial).subscribe((data: any) => {});

					if (child.material.map) {
						const canvas = document.createElement( 'canvas' );
						canvas.width = child.material.map.image.width;
						canvas.height = child.material.map.image.height;

						var src = this.asset_image_src.slice(0, -4) + "_" + child.material.id + "_albedo.png";
						
						const context = canvas.getContext( '2d' )!;
						context.drawImage( child.material.map.image, 0, 0 );
						
						const data = context.getImageData( 0, 0, canvas.width, canvas.height );
						var dataURL = canvas.toDataURL();
						this.assetsService.uploadDataURI(dataURL, src);

						var newAsset = { name: src, categoryId: 3, src: src, folderId: 1, format: "png" };

						this.assetsService.getNewAsset(newAsset).subscribe((data: any) => {});
					}

					if (child.material.metalnessMap) {
						//child.material.metalnessMap);
						var width = child.material.metalnessMap.image.width;
						var height = child.material.metalnessMap.image.height;
						const canvas = document.createElement( 'canvas' );
						canvas.width = width;
						canvas.height = height;

						var src = this.asset_image_src.slice(0, -4) + "_" + child.material.id + "_metalness.png";
						
						const context = canvas.getContext( '2d' )!;
						context.drawImage( child.material.metalnessMap.image, 0, 0 );
						
						const data = context.getImageData( 0, 0, canvas.width, canvas.height );
						var dataURL = canvas.toDataURL();
						this.assetsService.uploadDataURI(dataURL, src);

						var newAsset = { name: src, categoryId: 3, src: src, folderId: 1, format: "png" };

						this.assetsService.getNewAsset(newAsset).subscribe((data: any) => {});
					}

					if (child.material.normalMap) {
						const canvas = document.createElement( 'canvas' );
						canvas.width = child.material.normalMap.image.width;
						canvas.height = child.material.normalMap.image.height;

						var src = this.asset_image_src.slice(0, -4) + "_" + child.id + "_normal.png";
						
						const context = canvas.getContext( '2d' )!;
						context.drawImage( child.material.normalMap.image, 0, 0 );
						
						const data = context.getImageData( 0, 0, canvas.width, canvas.height );
						var dataURL = canvas.toDataURL();
						this.assetsService.uploadDataURI(dataURL, src);

						var newAsset = { name: src, categoryId: 3, src: src, folderId: 1, format: "png" };

						this.assetsService.getNewAsset(newAsset).subscribe((data: any) => {});
					}

					if (child.material.roughnessMap) {
						const canvas = document.createElement( 'canvas' );
						canvas.width = child.material.roughnessMap.image.width;
						canvas.height = child.material.roughnessMap.image.height;

						var src = this.asset_image_src.slice(0, -4) + "_" + child.id + "_roughness.png";
						
						const context = canvas.getContext( '2d' )!;
						context.drawImage( child.material.roughnessMap.image, 0, 0 );
						
						const data = context.getImageData( 0, 0, canvas.width, canvas.height );
						var dataURL = canvas.toDataURL();
						this.assetsService.uploadDataURI(dataURL, src);

						var newAsset = { name: src, categoryId: 3, src: src, folderId: 1, format: "png" };

						this.assetsService.getNewAsset(newAsset).subscribe((data: any) => {});
					}
				}
			});

			gltf.scene.position.set(0, -3, 2);
			gltf.scene.scale.set(0.05, 0.05, 0.05);

			// //materials);

			this.scene.add(gltf.scene);

			fitCameraToObject(this.scene, this.camera, gltf.scene, 1.0);

			this.renderer.render(this.scene, this.camera);

			var dataURL = this.renderer.domElement.toDataURL();

			var assetCard = document.getElementById(this.asset_image_src);
			// //assetCard);

			// @ts-ignore
			assetCard!.src = dataURL;

			this.assetLoaded = true;

			this.assetsService.uploadDataURI(dataURL, this.asset_image_src);
		}, undefined, function (error: any) {
			// console.error(error);
		});
	}

	createScene() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(90, 256 / 256, 0.1, 1000);
		this.camera.position.set(1.0, 5.0, 1.0);
		// camera.lookAt(0.0, -0.5, -2.0);
		this.scene.background = new THREE.Color(0x232323);
		this.loader = new GLTFLoader();

		this.renderer = new THREE.WebGLRenderer({
			preserveDrawingBuffer: true,
			antialias: true
		});
		this.renderer.setSize(256, 256);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		// scene.add( cube );

		const light = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(light);

		const light2 = new THREE.PointLight(0xffffff, 1, 100);
		light2.position.set(2, 5, 2);
		// scene.add( light2 );

		const another_light = new THREE.PointLight(0xffffff, 1, 0);
		another_light.position.set(2, -5, 7);
		this.scene.add(another_light);

		var rgbeLoader = new RGBELoader();
		var pmremGenerator = new THREE.PMREMGenerator(this.renderer);

		this.camera.position.z = 5;

		this.loader = new GLTFLoader();

		rgbeLoader.load("https://assets-backend.onrender.com/downloadFile/HDR_029_Sky_Cloudy_Ref.hdr", (texture) => {
			const envMap = pmremGenerator.fromEquirectangular(texture).texture;

			this.scene.environment = envMap;
			// scene.background = envMap;
			// newMaterial.envMap = envMap;

			this.onLoadAssetImage();
		});
	}

	ngAfterViewInit() {
		try {
			// WHEN UPLOAD TO SERVER
			this.assetsService.getFolder("https://assets-backend.onrender.com/downloadFile/" + this.asset.src).subscribe(data => {
				if (data) {
					var assetCard = document.getElementById(this.asset.src);
					// @ts-ignore
					assetCard!.src = "https://assets-backend.onrender.com/downloadFile/" + this.asset.src;
				} else {
					this.createScene();
				}
			});
		} catch (error) {
			// //error);
		}
	}

	openSettingsOnAsset(asset: any) {
		this.assetsService.openSettings.next(true); 
		this.assetsService.selectedAsset.next(asset);
		//this.assetsService.selectedAsset);
	}

	favorite(asset: Asset) {
		this.assetsService.getAssetById(asset.id).subscribe(((res: any) => {
			//asset.favorite);
			this.assetsService.favAsset(asset, res).subscribe((res: any) => {
				//res);
				var favoriteButton = document.getElementById(asset.id.toString())!;
				if (!asset.favorite) {
					favoriteButton.classList.add("bi-star-fill");
					favoriteButton.classList.remove("bi-star");
				} else {
					favoriteButton.classList.add("bi-star");
					favoriteButton.classList.remove("bi-star-fill");
				}
			});
		}));
	}

	openMoveModal(asset: any) {
		this.assetsService.moveAssetPopup.next(true);
		this.assetsService.assetToMove.next(asset);
	}
}