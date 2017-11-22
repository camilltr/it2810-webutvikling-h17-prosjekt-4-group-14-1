import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    animations: [
        trigger('Animation', [
            state('small', style({
                transform: 'scale(1)',
            })),
            transition('* <=> *', animate('1000ms ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(0%)', offset: 0}),
                style({opacity: 0.5, transform: 'translateY(0px)',  offset: 0.5}),
                style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
            ]))),
        ])
    ]
})

export class SearchComponent implements OnInit {
    value = '';
    artistSearchResult: Artist[] = [];

    // list of options for the sortBy field
    sortItems = [
        {value: '', viewValue: 'None'},
        {value: 'name', viewValue: 'Name'},
        {value: 'popularity', viewValue: 'Popularity'}
    ];
    // default sort value
    selectedSortValue: string;
    currentSortValue: string = '';

    // filter selection
    filterSelect = new FormControl();
    filterList = ['Rock', 'Pop', 'Rap'];
    // default filter values
    selectedFilters = ['Rock', 'Pop', 'Rap'];
    currentFilters: string[];

    state: 'small';
    // Assigning how many elements that should be displayed in a row
    column: number = this.setColumns();
    // List for displaying items in elements
    displayedElements: Artist[] = [];
    // Defines how many elements that should be displayed at a time
    limit = 15;
    constructor(private artistService: ArtistService) {}

    getArtist(): void {
        let tempData = [];
        this.artistService.getArtist(this.value).subscribe(data => {
            for (let key in data) {
                tempData.push(data[key]);
            }
            if (this.currentSortValue === 'popularity') {
                console.log('sorting by popularity');
                tempData.sort((n1, n2): number => {
                    return n2.popularity - n1.popularity;
                });
                console.log(tempData);
            } else if (this.currentSortValue !== '') {
                console.log('sorting by ' + this.currentSortValue);
                tempData.sort((n1, n2): number => {
                    if (n1[this.currentSortValue] > n2[this.currentSortValue]) {
                        return 1;
                    }
                    if (n1[this.currentSortValue] < n2[this.currentSortValue]) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                console.log(tempData);
            }
            this.artistSearchResult = tempData;
        });
    }

    changedSort(event) {
        this.currentSortValue = event.value;
        if (this.value.length > 0) {
            this.getArtist();
        }
    }

    changedFiler(event) {
        this.currentFilters = event.value;
    }

    sortBy(name) {
        this.artistSearchResult.sort((n1, n2): number => {
            if (n1[name] > n2[name]) {
                return 1;
            }
            if (n1[name] < n2[name]) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    onKey(event: any) {
        if (event.keyCode === 13) {
            this.getArtist();
            return;
        }
        this.value = event.target.value;
    }

    animateMe() {
        this.state = ('small');
    }
    addItems() {
        for (let i = 0; i < this.artistSearchResult.length; i++) {
            if (this.artistSearchResult.length !== this.displayedElements.length) {
                this.displayedElements.push(this.artistSearchResult[i]);
                this.animateMe();
            }
        }
    }
    // Runs each time you scroll
    onScroll() {
        // Detects when you reach the bottom, and then adds 5 more results.
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            this.limit = this.limit + 5;
            this.addItems();
        }
    }
    // Making grid list responsive
    onResize(event) {
        const element = event.target.innerWidth;
        if (element > 1500) {
            this.column = 5;
        } else if (element > 1200) {
            this.column = 4;
        } else if (element > 900) {
            this.column = 3;
        } else if (element > 600) {
            this.column = 2;
        } else if (element > 300) {
            this.column = 1;
        }
    }
    setColumns(): number {
        const width = document.documentElement.clientWidth;
        if (width > 1500) {
            return 5;
        } else if (width > 1200) {
            return 4;
        } else if (width > 900) {
            return 3;
        } else if (width > 600) {
            return 2;
        } else if (width > 300) {
            return 1;
        }
    }
    ngOnInit() {
        this.addItems();
        this.animateMe();
    }
}
