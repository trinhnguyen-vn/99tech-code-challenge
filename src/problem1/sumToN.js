const sumToNIterative = (n) => {
    let sum = 0
    const absN = Math.abs(n);
    for (let i = 1; i <= absN; i++) {
        sum += i
    }
    return n > 0 ? sum : -sum
};

const sumToNRecursive = (n) => {
    if (n === 0) {
        return 0;
    }
    return n > 0 ? n + sumToNRecursive(n - 1) : n + sumToNRecursive(n + 1);
}

const sumToNFormula = (n) => n > 0 ? n / 2 * (n + 1) : n / 2 * (Math.abs(n) + 1)

console.log(sumToNIterative(4));
console.log(sumToNRecursive(4));
console.log(sumToNFormula(4));

console.log(sumToNIterative(-4));
console.log(sumToNRecursive(-4));
console.log(sumToNFormula(-4));
