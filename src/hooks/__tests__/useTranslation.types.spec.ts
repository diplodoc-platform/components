import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from 'typescript';
import {expect, test} from '@playwright/test';

test('emitted translation declarations do not leak an unbound namespace type', () => {
    const source = readFileSync(join(__dirname, '../useTranslation.ts'), 'utf8');
    const declaration = ts.transpileDeclaration(source, {
        fileName: 'useTranslation.ts',
        compilerOptions: {isolatedDeclarations: true},
        reportDiagnostics: true,
    });
    expect(declaration.diagnostics).toEqual([]);
    expect(declaration.outputText).toContain('ReturnType<typeof useTranslationI18N>');

    const root = mkdtempSync(join(tmpdir(), 'components-public-translation-'));
    try {
        const contract = join(root, 'contract.d.ts');
        const dependency = join(root, 'translation.d.ts');
        writeFileSync(
            dependency,
            `
            export declare function useTranslation<Ns extends string = string>(
                namespace?: Ns
            ): {t: (key: Ns) => string};
        `,
        );
        const diagnostics = (text: string, dependencyPath = dependency) => {
            writeFileSync(contract, text);
            const program = ts.createProgram([contract], {
                strict: true,
                skipLibCheck: false,
                noEmit: true,
                types: [],
                esModuleInterop: true,
                module: ts.ModuleKind.NodeNext,
                moduleResolution: ts.ModuleResolutionKind.NodeNext,
                target: ts.ScriptTarget.ES2022,
                paths: {'react-i18next': [dependencyPath]},
            });
            return ts.getPreEmitDiagnostics(program).map((item) => ({
                code: item.code,
                message: ts.flattenDiagnosticMessageText(item.messageText, '\n'),
            }));
        };
        expect(diagnostics(declaration.outputText)).toEqual([]);
        const actual = ts.resolveModuleName(
            'react-i18next',
            join(__dirname, '../useTranslation.ts'),
            {moduleResolution: ts.ModuleResolutionKind.NodeNext, module: ts.ModuleKind.NodeNext},
            ts.sys,
        ).resolvedModule;
        expect(actual).toBeDefined();
        expect(diagnostics(declaration.outputText, actual!.resolvedFileName)).toEqual([]);
        // The previously published declaration referenced a generic outside its scope.
        expect(diagnostics('export declare function broken(): Ns;')).toContainEqual({
            code: 2304,
            message: "Cannot find name 'Ns'.",
        });
    } finally {
        rmSync(root, {recursive: true, force: true});
    }
});
