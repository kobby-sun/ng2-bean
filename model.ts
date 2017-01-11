import { List, Map } from 'immutable';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';


export interface Undoable {
    commit()
    revert()
    // undo()
    // redo()
}

export class Collection implements Undoable {
    _data: List<any>;

    add(o) {
        this._data = this._data.push(o)

    }

    get iterator() {
        return this._data
    }

    get js() {
        return this._data.toJS()
    }

    get length() {
        return this._data.size
    }

    update(id, value) {
        let key = this.key
        this.iterator.findIndex(function (item) {
            return item.raw.get(key) === id;
        }), function (item) {
            Object.keys(value).forEach(function (k) {
                var val = value[k];
                item.raw.set(k, val)
            });
            return item
        }
    }

    remove(id) {
        let key = this.key
        this._data = this._data.filter(function (item) { return item[key] !== id }).toList();
    }

    clear() {
        this._data = this._data.clear();
    }

    commit() {
        this._data.forEach(o => o.commit())
        this.data = this._data.toJS()
    }

    revert() {
        this._data.forEach(o => o.revert())
        this._data = List(this.data || []);
    }

    constructor(protected data: any = undefined, private key: string = 'id') {
        this._data = List(data || []);
    }

    form: any;
}

export class Entity implements Undoable {

    _data: Map<string, any>;

    children: Collection = new Collection()
    fg: FormGroup;

    static genProps(data) {
        Object.keys(data).forEach(k => {
            Object.defineProperty(Entity.prototype, k, {
                get: function () {
                    return this.get(k);
                },
                set: function (value) {
                    this.set(k, value);
                },
                enumerable: true,
                configurable: true
            });
        })
    }

    // [index: string]: any;

    get(key: string) {
        return <any>this._data.get(key);
    }
    set(key: string, value: any) {
        this._data = this._data.set(key, value)
    }

    constructor(protected data: any = undefined) {
        this._data = Map<string, any>(data);
    }

    get raw() {
        return this._data
    }

    get js() {
        return this._data.toJS()
    }

    commit() {
        this.data = this._data.toJS()
        if (this.children) this.children.commit()
    }

    revert() {
        this._data = Map<string, any>(this.data);
        if (this.children) this.children.revert()
    }
}
