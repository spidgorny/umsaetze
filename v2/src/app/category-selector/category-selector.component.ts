import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.css']
})
export class CategorySelectorComponent implements OnInit {

  @Input() selected: string;

  constructor() { }

  ngOnInit() {
  }

}
