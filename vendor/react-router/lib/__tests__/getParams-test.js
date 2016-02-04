'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _PatternUtils = require('../PatternUtils');

describe('getParams', function () {
  describe('when a pattern does not have dynamic segments', function () {
    var pattern = '/a/b/c';

    describe('and the path matches', function () {
      it('returns an empty object', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, pattern)).toEqual({});
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/d/e/f')).toBe(null);
      });
    });
  });

  describe('when a pattern has dynamic segments', function () {
    var pattern = '/comments/:id.:ext/edit';

    describe('and the path matches', function () {
      it('returns an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/comments/abc.js/edit')).toEqual({ id: 'abc', ext: 'js' });
      });
    });

    describe('and the pattern is optional', function () {
      var pattern = '/comments/(:id)/edit';

      describe('and the path matches with supplied param', function () {
        it('returns an object with the params', function () {
          _expect2['default'](_PatternUtils.getParams(pattern, '/comments/123/edit')).toEqual({ id: '123' });
        });
      });

      describe('and the path matches without supplied param', function () {
        it('returns an object with an undefined param', function () {
          _expect2['default'](_PatternUtils.getParams(pattern, '/comments//edit')).toEqual({ id: undefined });
        });
      });
    });

    describe('and the pattern and forward slash are optional', function () {
      var pattern = '/comments(/:id)/edit';

      describe('and the path matches with supplied param', function () {
        it('returns an object with the params', function () {
          _expect2['default'](_PatternUtils.getParams(pattern, '/comments/123/edit')).toEqual({ id: '123' });
        });
      });

      describe('and the path matches without supplied param', function () {
        it('returns an object with an undefined param', function () {
          _expect2['default'](_PatternUtils.getParams(pattern, '/comments/edit')).toEqual({ id: undefined });
        });
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/users/123')).toBe(null);
      });
    });

    describe('and the path matches with a segment containing a .', function () {
      it('returns an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/comments/foo.bar/edit')).toEqual({ id: 'foo', ext: 'bar' });
      });
    });
  });

  describe('when a pattern has characters that have special URL encoding', function () {
    var pattern = '/one, two';

    describe('and the path matches', function () {
      it('returns an empty object', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/one, two')).toEqual({});
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/one two')).toBe(null);
      });
    });
  });

  describe('when a pattern has dynamic segments and characters that have special URL encoding', function () {
    var pattern = '/comments/:id/edit now';

    describe('and the path matches', function () {
      it('returns an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/comments/abc/edit now')).toEqual({ id: 'abc' });
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/users/123')).toBe(null);
      });
    });

    describe('and the path contains multiple special URL encoded characters', function () {
      var pattern = '/foo/:component';

      describe('and the path matches', function () {
        it('returns the correctly decoded characters', function () {
          _expect2['default'](_PatternUtils.getParams(pattern, '/foo/%7Bfoo%24bar')).toEqual({ component: '{foo$bar' });
        });
      });
    });
  });

  describe('when a pattern has a *', function () {
    describe('and the path matches', function () {
      it('returns an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams('/files/*', '/files/my/photo.jpg')).toEqual({ splat: 'my/photo.jpg' });
        _expect2['default'](_PatternUtils.getParams('/files/*', '/files/my/photo.jpg.zip')).toEqual({ splat: 'my/photo.jpg.zip' });
        _expect2['default'](_PatternUtils.getParams('/files/*.jpg', '/files/my/photo.jpg')).toEqual({ splat: 'my/photo' });
        _expect2['default'](_PatternUtils.getParams('/files/*.jpg', '/files/my/new\nline.jpg')).toEqual({ splat: 'my/new\nline' });
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams('/files/*.jpg', '/files/my/photo.png')).toBe(null);
      });
    });
  });

  describe('when a pattern has a **', function () {
    describe('and the path matches', function () {
      it('return an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams('/**/f', '/foo/bar/f')).toEqual({ splat: 'foo/bar' });
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams('/**/f', '/foo/bar/')).toBe(null);
      });
    });
  });

  describe('when a pattern has an optional group', function () {
    var pattern = '/archive(/:name)';

    describe('and the path matches', function () {
      it('returns an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/archive/foo')).toEqual({ name: 'foo' });
        _expect2['default'](_PatternUtils.getParams(pattern, '/archive')).toEqual({ name: undefined });
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/archiv')).toBe(null);
      });
    });
  });

  describe('when a param has dots', function () {
    var pattern = '/:query/with/:domain';

    describe('and the path matches', function () {
      it('returns an object with the params', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/foo/with/foo.app')).toEqual({ query: 'foo', domain: 'foo.app' });
        _expect2['default'](_PatternUtils.getParams(pattern, '/foo.ap/with/foo')).toEqual({ query: 'foo.ap', domain: 'foo' });
        _expect2['default'](_PatternUtils.getParams(pattern, '/foo.ap/with/foo.app')).toEqual({ query: 'foo.ap', domain: 'foo.app' });
      });
    });

    describe('and the path does not match', function () {
      it('returns null', function () {
        _expect2['default'](_PatternUtils.getParams(pattern, '/foo.ap')).toBe(null);
      });
    });
  });
});