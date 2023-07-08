export interface Entity {
    id: string;
}

export interface CrudDB<T extends Entity> {
    getAll: () => Promise<T[]>;
    getById: (id: string) => Promise<T>;
    create: (value: T) => Promise<boolean>;
    update: (value: T) => Promise<boolean>;
    remove: (id: string) => Promise<boolean>;
}