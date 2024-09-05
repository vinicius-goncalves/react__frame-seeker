export function convertToPercentage(minValue: number, maxValue: number) {
    return Number(((minValue / maxValue) * 100).toFixed(2));
}
