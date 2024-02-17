import { LSystem } from "./lsystem";
import { Rule } from "./rule";

/**
 * @type { LSystem[] }
 */
export const trees = [
    new LSystem('F', [
        new Rule('F', 'FD[++F-F+F][-F-FF]U')
    ])
];