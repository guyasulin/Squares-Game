import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Square } from '../square.model';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  squares$: Observable<Square[]>;

  constructor(public service: SquareService) { }
  
  ngOnInit() {
    this.service.getSquares().subscribe(res => {
	  this.squares$ = res.map(item => {
			return {
				id: item.payload.doc.id,
				...item.payload.doc.data()
			} as Square
	  })
    })
  }
}
