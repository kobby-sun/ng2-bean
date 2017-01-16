import { Response } from '@angular/http';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export function polling(func, before: Function, router: Router, tick: Function, tick_param: any = null, freq: number = 10000, error: Function = null, complete: Function = null): Subscriber<Response> {
  let req: Function
  let pass: Function
  return Observable.create((observer: Subscriber<Response>) => {
    req = function () {
      if (before) before();
      var subscription = func().subscribe(result => {

        observer.next(result);
        subscription.unsubscribe();
      }, err => {
        observer.next(err);
        subscription.unsubscribe();
      }, () => {
        subscription.unsubscribe();
      });
    }

    pass = function () {
      observer.next(null);
    }

    req()
    // var timerId = setInterval(req, freq);

    let routerSub = router == null ? null : router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        //   console.log('> router changed, observer complete')
        // console.log('observer.closed', observer.closed)
        observer.complete();
      }
    })

    return function () {
      // console.log('> observer complete')
      // console.log('observer.closed', observer.closed)
      if (routerSub != null)
        routerSub.unsubscribe()
      if (!observer.closed)
        observer.complete();
      // clearInterval(timerId);
    }
  }).subscribe(
    function (x) {
      if (tick(x, tick_param))
        setTimeout(req, freq)
      else
        setTimeout(pass, freq)
      // console.log('Next: ', x);
    },
    function (err) {
      // console.log('Error: ', err);
      if (error != null) error(err)
    },
    function () {
      // console.log('Completed');
      if (complete != null) complete()
    });
}