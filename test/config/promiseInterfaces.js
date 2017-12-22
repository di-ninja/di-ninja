/* eslint-env mocha */

import bluebird from 'bluebird'

export default ({di, assert}) => {
  return function () {
    di.config('promiseInterfaces', [ bluebird ]);

    function A(b){
      this.b = b;
    }
    function B(){
      return new bluebird((resolve, reject)=>{
        resolve('b');
      });
    }

    di.addRules({
      'A': {
        classDef: A,
        params: ['B'],
      },
      'B': {
        classDef: B,
        asyncResolve: true,
      },
    });


    describe('promiseInterface', function () {
      it('should recognize provided interface and return instanceof Promise', function () {
        const instance = di.get('A')
        assert.instanceOf(instance, Promise)
      })
    })
  }
}
