const intersect = (set1: unknown[], set2: unknown[]) => {
    return set1.filter((it) => set2.includes(it));
}

export const includesAll = (set: unknown[], values: unknown[]) => {
    return values.filter((it) => set.includes(it)).length === values.length;
}

export default intersect;
