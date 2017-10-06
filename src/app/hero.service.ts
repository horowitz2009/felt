import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { environment } from '../environments/environment';

import 'rxjs/add/operator/toPromise';

import { Hero } from './hero';

@Injectable()
export class HeroService {
  private heroesUrl = environment.apiUrl + 'heroes';  // URL to web api

  constructor(private http: Http) { }

  getHeroes(): Promise<Array<Hero>> {
    return this.http
      .get(this.heroesUrl)
      .toPromise()
      .then((response) => {
        return response.json().data as Hero[];
      })
      .catch(this.handleError);
  }

  getHero(id: number): Promise<Hero> {

    return this.http
      .get(this.heroesUrl + "/" + id)
      .toPromise()
      .then((response) => {
        return response.json() as Hero;
      })
      .catch(this.handleError);
  }

  save(hero: Hero): Promise<Hero> {
    if (hero.id) {
      return this.put(hero);
    }
    return this.post(hero);
  }

  delete(hero: Hero): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http
      .delete(url, { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  // Add new Hero
  private post(hero: Hero): Promise<Hero> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.heroesUrl, JSON.stringify(hero), { headers: headers })
      .toPromise()
      .then(res => {
    	  console.log("RESULT: " + res.json());
    	  let json = res.json();
    	  if (json.data)
    		  return json.data as Hero;
    	  else
    	      return this.getHero(json);
    	  })
      .catch(this.handleError);
  }

  // Update existing Hero
  private put(hero: Hero): Promise<Hero> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http
      .put(url, JSON.stringify(hero), { headers: headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
