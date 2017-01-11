declare var Rx: any;

export function polling(func, before, tick, freq = 10000) {
        return Rx.Observable.create(function (observer) {

                function requestData() {
                        if (before) before();
                        var subscription = func().subscribe(result => {

                                observer.onNext(result);
                                subscription.unsubscribe();
                        }, err => {
                                observer.onNext(err);
                                subscription.unsubscribe();
                        }, () => {
                                subscription.unsubscribe();
                        });
                }

                requestData()
                var timerId = setInterval(requestData, freq);

                return function () {
                        observer.onCompleted();
                        clearInterval(timerId);
                }
        }).subscribe(
                function (x) {
                        tick(x)
                        // console.log('Next: ', x);
                },
                function (err) {
                        console.log('Error: ', err);
                },
                function () {
                        // console.log('Completed');
                });;
}