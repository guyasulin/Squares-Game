import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Square } from '../square.model';
import { SquareService } from '../square.service';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-threejs-meshsquare',
  template: `<div #rendererContainer ></div>`,
})
export class ThreejsMeshsquareComponent implements OnInit, AfterViewInit {

	squares$: Observable<Square[]>;
	@ViewChild('rendererContainer') rendererContainer: ElementRef;
	renderer = new THREE.WebGLRenderer({ alpha: true });
	scene = null;
	camera = null;
	mesh = null;
	controls = null;

	constructor(public service: SquareService, private firestore: AngularFirestore) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		this.controls = new OrbitControls(this.camera);
		// this.controls.update();
		const interaction = new Interaction(this.renderer, this.scene, this.camera);
	}

	ngAfterViewInit() {
		this.configCamera();
		this.configRenderer();
		this.configControls();

		this.animate();
	}

	configCamera() {
		this.camera.position.set(500, 500, 500);
	}

	configRenderer() {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(new THREE.Color("#ffff"));
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.domElement.style.display = 'block';
		this.renderer.domElement.style.margin = 'auto';
		this.renderer.domElement.style.width = '100%';
		this.renderer.domElement.style.height = '100%';

		this.rendererContainer.nativeElement.appendChild(this.renderer.domElement, this.mesh);
	}

	configControls() {
		this.controls.autoRotate = true;
		this.controls.enableZoom = false;
		this.controls.enablePan = false;
		this.controls.update();
	}

	createMesh(squares) {
		for (let i = 0; i < squares.length; i++) {
			const element = squares[i];

			const geometry = new THREE.BoxGeometry(100, 100, 25);
			const material = new THREE.MeshBasicMaterial({ color: element.color });
			const cube: any = new THREE.Mesh(geometry, material);

			cube.cursor = 'pointer';
			cube.on('click', (event) => {
				const cube: any = event.data.target;
				const newColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
				cube.material.color.setHex(newColor);
				this.onSubmit(element.id, newColor);
			});

			cube.position.setX((i % 3) * 100);
			cube.position.setY(Math.floor(i / 3) * 100);
			this.scene.add(cube);
		}
	}

	onSubmit(id, color) {
		this.firestore.collection('squares').doc(id).update({ color: color });
	}

	animate() {
		window.requestAnimationFrame(() => this.animate());
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	ngOnInit() {
		this.service.getSquares().subscribe((res) => {
			const arr = res.map((item) => {
				return {
					id: item.payload.doc.id,
					...item.payload.doc.data()
				} as Square;
			});
			this.createMesh(arr);
		});
	}

}
