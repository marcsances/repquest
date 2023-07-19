export enum OneRm {
    EPLEY,
    BRZYCKI
}

export const getOneRm = (weight: number, reps: number, formula: OneRm) => {
    if (formula === OneRm.EPLEY) {
        return Math.round(weight * (1 + reps / 30));
    }
    return Math.round(weight * (36 / (37 - reps)));
}