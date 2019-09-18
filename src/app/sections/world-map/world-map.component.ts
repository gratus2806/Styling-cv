import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Google map lat-long
  lat: number = 51.678418;
  lng: number = 7.809007;
}
