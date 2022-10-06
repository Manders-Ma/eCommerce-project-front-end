import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable ,of} from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient:HttpClient) { }

  getCreditCardMonths(startMonth: number) : Observable<number[]>{
    let data:number[] = [];
    // build an array for "Month" dropdown list
    // start at desired startMonth and loop until 12
    for (let theMonth = startMonth; theMonth<=12; theMonth++) {
      data.push(theMonth);
    }

    // The "of" operator will wrap an object as an Observable.
    return of(data);

  }

  getCreditCardYears() : Observable<number[]>{
    let data:number[] = [];
    // build an array for "Year" dropdown list
    // start at desired current year and loop for next 10
    const startYear:number = new Date().getFullYear();
    const endYear:number = startYear + 10;
    for (let theYear = startYear; theYear<=endYear; theYear++) {
      data.push(theYear);
    }

    // The "of" operator will wrap an object as an Observable.
    return of(data);
  }

  getCountries() : Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: String) : Observable<State[]>{
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    )
  }
}

interface GetResponseCountries {
  _embedded:{
    countries:Country[];
  }
}

interface GetResponseStates {
  _embedded:{
    states:State[];
  }
}
