import { Component, Input, OnInit } from '@angular/core';
import { Square } from '../square.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

	@Input() squares: Square[];

	constructor(private firestore: AngularFirestore) {}

	ngOnInit(): void {}

	randomColor(item: Square) {
		item.color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
		this.onSubmit(item.id, item.color);
	}

	onSubmit(id, color) {
		this.firestore.collection('squares').doc(id).update({ color: color });
	}

}
