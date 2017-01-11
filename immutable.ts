import { List, Map } from 'immutable';

declare var _: any;

export interface Undoable {
    revert()
    commit()
    undo()
    redo()
}

export class Entity implements Undoable {
    private history: any
    private historyIndex = 0;



    constructor(data: any = undefined) {
        this.history = [Map<string, any>(data)];
    }

    get(key: string) {
        return this.history[this.historyIndex].get(key)
    }

    get iterator() {
        return this.data
    }

    get data() {
        return this.history[this.historyIndex]
    }

    get js() {
        return this.data.toJS()
    }

    set(key: string, value: any) {
        this.history.push(this.data.set(key, value))
        this.historyIndex++;
    }

    revert() {
        this.historyIndex = 0
    }

    commit() {
        this.history = this.history.slice(-1);
        this.historyIndex = 0
    }

    undo() {
        if (this.historyIndex > 0)
            this.historyIndex--
    }

    redo() {
        if (this.historyIndex != this.history.length - 1)
            this.historyIndex++
    }
}

export class Collection implements Undoable {

    private history: any;// = [List([])];
    private historyIndex = 0;

    constructor(private key: string = 'id', data: Array<any> = []) {
        this.history = [List(data || [])];
    }

    private operation(fn) {
        this.history = this.history.slice(0, this.historyIndex + 1);

        var newVersion = fn(this.history[this.historyIndex]);

        this.history.push(newVersion);
        this.historyIndex++;
    }

    get length() {
        return this.data.size
    }

    get js() {
        return this.data.toJS()
    }

    get data() {
        return this.history[this.historyIndex]
    }

    revert() {
        this.historyIndex = 0
        this.data.forEach((o) => {
            o.revert()
        })
    }

    commit() {
        this.history = this.history.slice(-1);
        this.historyIndex = 0
        this.data.forEach((o) => {
            o.commit()
        })
    }

    undo() {
        if (this.historyIndex > 0)
            this.historyIndex--
    }

    redo() {
        if (this.historyIndex != this.history.length - 1)
            this.historyIndex++
    }

    add(o) {
        this.operation(function (data) {
            // return data.push(Map(o));
            return data.push(o);
        });
    }

    update(o) {
        let key = this.key
        this.operation(function (data) {
            let idx = _.findIndex(this.history, function (z) { return z[key] == o[key]; });

            return data.update(idx, function (v) {
                return Map(o)
            });
        });
    }

    remove(id) {
        let key = this.key
        this.operation(function (data) {
            return data.filter(function (o) {
                return o[key] !== id;
            });
        });
    }

    clear() {
        this.operation(function (data) {
            return [];
        });
    }
}
