import { Injectable } from '@angular/core';

import { Observable ,of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor() { }

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
}
