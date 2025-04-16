import { Component, OnInit } from '@angular/core';
import {SERVICES} from "../../../shared/data/services.data";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

    protected readonly services = SERVICES;
}
