import { randomInt } from 'node:crypto'

// Код из письма - единственное, что отделяет чужого от чужой учётной записи,
// поэтому он берётся из криптографического генератора: Math.random предсказуем.
export const generateCode = () => String(randomInt(100000, 1000000))
