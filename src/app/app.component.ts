import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, skip, switchMap} from 'rxjs/operators';
import {MovieService} from './MovieService';

export interface MovieData {
  title: string;
  year: number;
  poster: string;
  imdbID: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  public movieDataResults$: Observable<MovieData[]>;
  public nominations: MovieData[] = [];
  public showFinalNominations: boolean;

  constructor(private movieService: MovieService) {
    this.movieDataResults$ = this.searchTerm$.pipe(
      skip(1),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        return this.fetchMovieTitles(searchTerm);
      })
    );
  }

  public showNominationsBanner(): boolean {
    return this.isNominationsListFull() && !this.showFinalNominations;
  }

  public viewNominationResults(): void {
    this.showFinalNominations = true;
  }

  public resetNominations(): void {
    this.nominations = [];
    this.backToNominations();
  }

  public backToNominations(): void {
    this.searchTerm$.next(undefined);
    this.showFinalNominations = false;
  }

  public isNominationsListFull(): boolean {
    return this.nominations.length === 5;
  }

  public disableNominationsButton(imdbID: string): boolean {
    return this.isNominated(imdbID) || this.isNominationsListFull();
  }

  public isNominated(imdbID: string): boolean {
    return this.nominations.find((data: MovieData) => data.imdbID === imdbID) !== undefined;
  }

  public addNomination(movie: MovieData): void {
    if (!this.isNominated(movie.imdbID) && !this.isNominationsListFull()) {
      this.nominations.push(movie);
    }
  }

  public removeNomination(movie: MovieData): void {
    this.nominations = this.nominations.filter((nominated: MovieData) => nominated.imdbID !== movie.imdbID);
  }

  public updateSearchTerm(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  public fetchMovieTitles(searchTerm: string): Observable<MovieData[]> {
    return this.movieService.getMovies(searchTerm);
  }
}
