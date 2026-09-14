import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
    moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
    transformIgnorePatterns: ['/node_modules/(?!bcrypt-ts)'],
};

export default createJestConfig(config);
