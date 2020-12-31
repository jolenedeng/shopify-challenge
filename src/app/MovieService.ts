import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MovieData} from './app.component';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient) {
  }

  private rootURL = '/api';

  public getMovies(searchTerm: string): Observable<MovieData[]> {
    return this.http.post(this.rootURL + '/searchMovies', {searchTerm})
      .pipe(
        map((data: any) => {
          const result: any = JSON.parse(data);
          if (result['Response'] === 'False') {
            return [];
          }
          return this.toMovieData(result['Search']);
        })
      );
  }

  private toMovieData(movies: any[]): MovieData[] {
    return movies.map((movie: any) => {
      return {
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        imdbID: movie.imdbID
      };
    });
  }
}
