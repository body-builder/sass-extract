import path from 'path';
import { renderFunctions } from './helpers/testSets';
import { normalizePath } from '../src/util';

const sourceFile = path.join(__dirname, 'scss', 'comments.scss');

describe('comments', () => {
  describe.each(renderFunctions)('%s', (renderFuncType, renderFunc) => {
    let rendered;

    beforeAll(async () => {
      rendered = await renderFunc({
        file: sourceFile,
      });
    });

    it('has correct shape in general', () => {
      expect(rendered).toEqual({
        css: expect.any(Buffer),
        stats: expect.any(Object),
        vars: {
          global: {
            $number1: expect.any(Object),
            $number2: expect.any(Object),
            $color: expect.any(Object),
          },
        },
      });
    });

    it('extracts $number1 correctly', () => {
      expect(rendered.vars.global.$number1).toMatchSassNumber(sourceFile, {
        value: 100,
        unit: 'px',
        declarations: expect.toMatchDeclarations([
          {
            expression: '100px',
            sourceFile,
          },
        ]),
      });
    });

    it('extracts $number2 correctly', () => {
      expect(rendered.vars.global.$number2).toMatchSassNumber(sourceFile, {
        value: 200,
        unit: 'px',
        declarations: expect.toMatchDeclarations([
          {
            expression: '$number1 * 2',
            sourceFile,
          },
        ]),
      });
    });

    it('extracts $color correctly', () => {
      expect(rendered.vars.global.$color).toMatchSassColor(sourceFile, {
        value: {
          r: 255,
          g: 0,
          b: 0,
          a: 1,
          hex: '#ff0000',
        },
        declarations: expect.toMatchDeclarations([
          {
            expression: 'red',
            sourceFile,
          },
        ]),
      });
    });
  });
});
