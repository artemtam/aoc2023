import { test, expect } from 'bun:test';

import { solvePart1, solvePart2 } from './solution.ts';

const inputFile = Bun.file(import.meta.dir + '/input.txt');
const input = await inputFile.text();

test('part 1', () => {
    expect(solvePart1(input)).toEqual(68923);
})

test('part 2', () => {
    expect(solvePart2(input)).toEqual(200044);
})


