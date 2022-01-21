import Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default {
    sort(tests) {
        // Test structure information
        // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
        const copyTests = Array.from(tests);
        copyTests.sort((a,b) => (a.path > b.path) ? 1 : ((b.path > a.path) ? -1 : 0))        
        return copyTests;
    }
}
