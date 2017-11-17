import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../services/artist.service';
import Artist from '../models/artist.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',

})
export class TestComponent implements OnInit {

  public newArtist: Artist = new Artist();

  artistList: Artist[];
  artistList2: Artist[] = [];
  editedArtists: Artist[] = [];
  songSearchResult: Object = [];
  artistSearchResult: Object = [];

  constructor(private artistService: ArtistService, private http: HttpClient) { }

  ngOnInit(): void {

    this.getArtist('Metallica');

  }
  
  //Returns all artists in the database
  getAllArtists() {
    this.artistService.getAllArtists().subscribe(artists => {
      this.artistList = artists;
      // console.log('Artists: ', this.artistList);
    });
  }

  // Gets an artist from local DB or from lastFM.
  // Takes the name of the artist as a parameter
  getArtist(name: string) {
    this.artistService.getArtist(name).subscribe(artist => {
      this.artistList2 = artist;
      // console.log(this.artistList2);
    });
  }

  // Creates an artist and stores it in the database, then gets all artists.
  // Takes in the artist as a parameter
  createArtist(artist: Artist) {
    this.artistService.createArtist(artist);
    // this.getAllArtists();
  }

  // To get top 50 from lastFM, takes country as parameter
  getTop50(country: string) {
    this.http.get('http://localhost:8084/api/lfm/getTop50/' + country)
      .subscribe(data => {
        this.songSearchResult = data;
        console.log(this.songSearchResult);
      });
  }

  // For retrieving artists from lastFM, probably not needed.
  retreiveArtists(name: string) {
    this.http.get('http://localhost:8084/api/lfm/artist/' + name)
      .subscribe(data => {
        this.artistSearchResult = data;
        console.log(this.artistSearchResult);
      });
  }
}