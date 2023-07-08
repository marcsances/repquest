import {CrudDB, Entity} from "./crud_db";

export class JSONDb<T extends Entity> implements CrudDB<T> {
    private readonly entityName: string;

    constructor(entityName: string) {
        this.entityName = entityName;
    }

    create(value: T): Promise<boolean> {
        let records_data = localStorage.getItem(this.entityName);
        let records: string[];
        if (!records_data) {
            records = [this.entityName];
        } else {
            records = [...JSON.parse(records_data) as string[], this.entityName];
        }
        localStorage.setItem(this.entityName + "_" + value.id, JSON.stringify(value));
        localStorage.setItem(this.entityName, JSON.stringify(records));
        return Promise.resolve(true);
    }

    getAll(): Promise<T[]> {
        let records_data = localStorage.getItem(this.entityName);
        if (!records_data) {
            return Promise.resolve([]);
        }
        return Promise.resolve((JSON.parse(records_data) as string[])
            .map((it) => JSON.parse(localStorage.getItem(this.entityName + "_" + it) || "") as T));
    }

    getById(id: string): Promise<T> {
        const record = localStorage.getItem(this.entityName + "_" + id);
        if (!record) return Promise.reject("not found");
        return Promise.resolve(JSON.parse(record) as T);
    }

    remove(id: string): Promise<boolean> {
        localStorage.removeItem(this.entityName + "_" + id);
        return Promise.resolve(true);
    }

    update(value: T): Promise<boolean> {
        const record = localStorage.getItem(this.entityName + "_" + value.id);
        if (!record) return Promise.reject("not found");
        localStorage.setItem(this.entityName + "_" + value.id, JSON.stringify(value));
        return Promise.resolve(false);
    }

}