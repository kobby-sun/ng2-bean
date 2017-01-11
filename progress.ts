const NProgress = require('nprogress')

export function start() {
    NProgress.start();
}
export function done() {
    NProgress.done();
}
export function set(perc) {
    NProgress.set(perc);
}
export function inc() {
    NProgress.inc();
}