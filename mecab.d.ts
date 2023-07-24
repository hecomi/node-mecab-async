import type {ExecOptions, ExecSyncOptionsWithBufferEncoding} from 'child_process';

type MeCabData = {
    kanji: string;
    lexical: string;
    compound: string;
    compound2: string;
    compound3: string;
    conjugation: string;
    inflection: string;
    original: string;
    reading: string;
    pronunciation: string;
};

interface MeCabPrototype {
    command: string;
    options: ExecOptions & ExecSyncOptionsWithBufferEncoding;
    parser: (data: string[]) => MeCabData | null;
    _format(arr: string[][]): MeCabData[];
    _shellCommand(str: string): string;
    _parseMeCabResult(result: string): string[][];
    parse(str: string, callback: (err: Error | null, result: string[][]) => void): void;
    parseSync(str: string): string[][];
    parseFormat(str: string, callback: (err: Error | null, result: MeCabData[]) => void): void;
    parseSyncFormat(str: string): MeCabData[];
    _wakatsu(arr: string[][]): string[];
    wakachi(str: string, callback: (err: Error | null, result: string[]) => void): void;
    wakachiSync(str: string): string[];
}

declare const MeCab: MeCabPrototype;

export = MeCab;
