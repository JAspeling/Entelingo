import { Component, OnInit } from '@angular/core';
import { NgxGaugeType } from "ngx-gauge/gauge/gauge";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  gaugeType: NgxGaugeType = 'full';
  gaugeValue = 10;

}
