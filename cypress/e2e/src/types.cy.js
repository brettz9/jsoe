import Types, {
  getPropertyValueFromLegend
} from '../../../instrumented/types.js';
// import Types, {
//   getPropertyValueFromLegend
// } from '../../../src/types.js'; // Test Cypress TS

describe('`getPropertyValueFromLegend`', function () {
  beforeEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });
  it('throws if no property on supplied element', function () {
    const legend = document.createElement('legend');
    document.body.append(legend);

    expect(() => {
      getPropertyValueFromLegend(legend);
    }).to.throw('No property on the supplied legend element');
  });

  it('throws if no property text content is found', function () {
    const legend = document.createElement('legend');
    const span = document.createElement('span');
    span.dataset.prop = 'true';
    legend.append(span);
    document.body.append(legend);
    expect(() => {
      getPropertyValueFromLegend(legend);
    }).to.throw('No property with text present on the supplied legend element');
  });
});

describe('`Types.getTypeForRoot`', function () {
  it('`getTypeForRoot` with null root', function () {
    expect(Types.getTypeForRoot(null)).to.equal('null');
  });
});

describe('`Types.getFormControlFromRootAncestor`', function () {
  it('`getFormControlFromRootAncestor` with non-root ancestor', function () {
    expect(Types.getFormControlFromRootAncestor(
      'missing'
    )).to.equal(null);
  });
});

describe('`Types.getTypeOptionsForFormatAndState`', function () {
  it(
    '`getTypeOptionsForFormatAndState` with bad states for format',
    function () {
      expect(() => {
        Types.getTypeOptionsForFormatAndState(
          'json', 'nonexistent'
        );
      }).to.throw('Unexpected type for format and state');

      expect(() => {
        Types.getTypeOptionsForFormatAndState(
          'indexedDBKey', 'nonexistent'
        );
      }).to.throw('Unexpected type for format and state');
    }
  );
});

describe('`Types.getValueForString`', function () {
  it('`getValueForString` throws with bad state for format', function () {
    expect(() => {
      Types.getValueForString('test', {
        format: 'json',
        state: 'badFormat'
      });
    }).to.throw('Could not get types for format and state');
  });
});
