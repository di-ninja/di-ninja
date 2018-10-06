# Di-Ninja [![Di-Ninja ICON](https://raw.githubusercontent.com/di-ninja/di-ninja/master/icon/icon.png)](https://github.com/di-ninja/di-ninja#)

[![npm version](https://badge.fury.io/js/di-ninja.svg)](https://www.npmjs.com/package/di-ninja)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Unix Build](https://travis-ci.org/di-ninja/di-ninja.svg?branch=master)](https://travis-ci.org/di-ninja/di-ninja)
[![Windows Build](https://ci.appveyor.com/api/projects/status/github/di-ninja/di-ninja?branch=master&svg=true)](https://ci.appveyor.com/project/surikat/di-ninja/branch/master)
[![Dependencies](https://david-dm.org/di-ninja/di-ninja.svg)](https://david-dm.org/di-ninja/di-ninja#info=dependencies)
[![devDependencies](https://david-dm.org/di-ninja/di-ninja/dev-status.svg)](https://david-dm.org/di-ninja/di-ninja/#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/di-ninja/di-ninja/badge.svg)](https://snyk.io/test/github/di-ninja/di-ninja)
[![NPM Status](http://img.shields.io/npm/dm/di-ninja.svg?style=flat)](https://www.npmjs.com/package/di-ninja)

The Dependency-Injection Framework for JavaScript NodeJS and Browser.

## Installation
```
$ npm i di-ninja
```

## Goals
  * Implement [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) by [Composition-Root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/) design pattern, allowing to keep all things decoupled and to wire application components and config at one unique root place.

  * Replace the singleton anti-pattern with dependency-injection by refacto export of instances to export of classes and factories.
  
  * Get a pure JavaScript non-dogmatic cross-transpiller [Dependency-Injection](https://en.wikipedia.org/wiki/Dependency_injection) framework.

  * Encourage adherence to the best practices of Object Oriented design
  ( [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)),
  [IoC](https://en.wikipedia.org/wiki/Inversion_of_control),
  [Dependency-Injection](https://en.wikipedia.org/wiki/Dependency_injection),
  [Composition-Root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/),
  [Strategy](https://en.wikipedia.org/wiki/Strategy_pattern) ...).
  
  * Improve code testability.
  
  * Extend the Art of JavaScript development.

## Paradigm - Dependency Injection vs Modules

Why to not simply just use *ES6 import* or *CommonJS require* ?  
Di-Ninja don't pretend to replace these features, that would be useless.  
Using import/export for getting class or factory function is the good way to use it, that's why it was made for.  
But using modules to export [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) is an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)
and leading to [global state](https://softwareengineering.stackexchange.com/questions/148108/why-is-global-state-so-evil).
It predisposes application to more need for refacto in future, less testability (unable without hack).  
How to know when to use *dependency injection* over *import/require*, it's very simple:  
when it's about the implementation, always use dependency injection, even if it's a factory that is exported,
else if it's not an instance but a stateless input/output function with a general purpose,
usually coming from a third party library, you can use import. In case of doubt always use dependency injection !


## Documentation

### Summary

1. [Getting Started](#1-getting-started)

2. [Dependencies declarations approaches](#2-dependencies-declarations-approaches)
	1. [Composition Root](#21-composition-root)
	2. [Decorator injection approach](#22-decorator-injection-approach)
		1. [abstract class](#221-abstract-class)
		2. [reference class](#222-reference-class)

3. [Dependencies Resolution](#3-dependencies-resolution)
	1. [Recursive classes or factories](#31-recursive-classes-or-factories)
	2. [Recursive params](#32-recursive-params)
	3. [Types of params](#33-types-of-params)
		1. [interface](#331-interface)
		2. [value](#332-value)
		3. [factory](#333-factory)
		5. [valueFactory](#334-valuefactory)
		6. [classFactory](#335-classfactory)
		4. [require](#336-require)

4. [Rules](#4-rules)
	
	1. [dependencies](#41-dependencies)
		1. [params](#411-params)
		2. [calls](#412-calls)
		3. [lazyCalls](#413-lazycalls)
	
	2. [instantiation](#42-instantiation)
		1. [classDef](#421-classdef)
		2. [instanceOf](#422-instanceof)
		3. [substitutions](#423-substitutions)
	
	3. [single instance](#43-single-instance)
		1. [shared](#431-shared)
		2. [singleton](#432-singleton)
		3. [sharedInTree](#433-sharedintree)
	
	4. [rule inheritance](#44-rule-inheritance)
		1. [inheritInstanceOf](#441-inheritinstanceof)
		2. [inheritPrototype](#442-inheritprototype)
		3. [inheritMixins](#443-inheritmixins)
		4. [decorator](#444-decorator)

	5. [asynchrone dependencies resolution](#45-asynchrone-dependencies-resolution)
		1. [asyncResolve](#451-asyncresolve)
		2. [asyncCallsSerie](#452-asynccallsserie)
		3. [asyncCallsParamsSerie](#453-asynccallsparamsserie)
		
	6. [dependency file location](#46-dependency-file-location)
		1. [autoload](#461-autoload)
		2. [path](#462-path)


5. [Container](#5-container)

	1. [rules](#51-rules)
	2. [rulesDefault](#52-rulesdefault)
	
	3. [dependencies](#53-dependencies)
	4. [autoloadPathResolver](#54-autoloadpathresolver)
	5. [autoloadExtensions](#55-autoloadextensions)
	6. [autoloadFailOnMissingFile](#56-autoloadfailonmissingfile)
	
	7. [defaultVar](#57-defaultvar)
	8. [defaultRuleVar](#58-defaultrulevar)
	9. [defaultDecoratorVar](#59-defaultdecoratorvar)
	10. [defaultArgsVar](#510-defaultargsvar)
	
	11. [defaultFactory](#511-defaultfactory)
	12. [defaultFunctionWrapper](#512-defaultfunctionwrapper)
	
	13. [promiseFactory](#513-promisefactory)
	14. [promiseInterfaces](#514-promiseinterfaces)
	
	15. [interfacePrototype](#515-interfaceprototype)
	16. [interfaceTypeCheck](#516-interfacetypecheck)
	
	17. [globalKey](#517-globalkey)
	
	18. [ruleCache](#518-rulecache)
	19. [polyfillRequireContext](#519-polyfillrequirecontext)

6. [Examples](#6-examples)

### 1. Getting Started
```javascript
import container from 'di-ninja'

const di = container()

di.addRules(rules)

di.get('MyClassName')
```


### 2. Dependencies declarations approaches

To define dependencies, you can use [Composition-Root](#21-composition-root) or [Decorator injection approach](#22-decorator-injection-approach) for each components individually.  
Differents approaches can be used for differents methods injections on same component.  
Dependencies definition can be overrided, the last call of addRule or @di decorator will take precedence.

#### 2.1 Composition-Root

The Composition Root is the highest level of your application, the top overlay.  
It's here that you will configure many rules for your components and wire them together.  
Using only the Composition Root design pattern has the advantage to let your components totaly unopinionated,
all your classes and factories can keep uncoupled from the dependency injector (di-ninja).

example with ES6 class syntax
```javascript
class A{
  constructor(b){
    this.b = b
  }
}
class B{
  constructor(){
    this.foo = bar
  }
}

di.addRules({
  'A': {
    classDef: A,
    params: [ 'B' ],
  },
  'B': {
    classDef: B,
  },
}
})

di.get('A')
```

example with function as constructor or factory
```javascript

//function as a constructor
function A(b){
  this.b = b
}

//function as a factory
function B(){
  const object = { foo: 'bar' }
  
  // if we return an object or other value than undefined,
  // this function will be treated by javascript as a factory
  
  return object
}

di.addRules({
  'A': {
    classDef: A,
    params: [ 'B' ],
  },
  'B': {
    classDef: B,
  },
})

di.get('A')
```


#### 2.2 Decorator injection approach

The Decorator injection approach let your components define their own dependencies.  
These dependencies declarations can rely on container level defined abstractions (recommanded),
or on direct class or factory definition.  
It can be used in addition to the Composition-Root and replace the rule's key [`params`](#411-params) and also the parameters of call argument for rule's key [`calls`](#412-calls) and [`lazyCalls`](#413-lazycalls).

##### 2.2.1 abstract class

example with ES6 class syntax
```javascript
di.addRule('B',{
  classDef: B,
})

@di('A',[ 'B' ])
class A{
  constructor(b){
    this.b = b
  }
}

di.get('A')
```

example with function as constructor or factory
```javascript
di.addRule('B',{
  classDef: B,
})

function A(b){
  this.b = b
}
di( 'A', ['B'] )( A )

di.get('A')
```

##### 2.2.2 reference class
```javascript
@di('A',[ B ])
class A{
  constructor(b){
    this.b = b
  }
}

di.get('A')
```

### 3. Dependencies Resolution
The dependencies are resolved according to rule's key [`params`](#411-params) and parameters of call argument for rule's key [`calls`](#412-calls) and [`lazyCalls`](#413-lazycalls).

#### 3.1 Recursive classes or factories
You can use factories or classes, and obviously, all dependencies are resolved recursively.
```javascript
class A{
  constructor(b){
    this.b = b
  }
}
class B{
  constructor(c){
    this.c = c
  }
}
function C(){
  return 'Hello world !'
}
di.addRules({
  A: {
    classDef: A,
    params: [ 'B' ],
  },
  B: {
    classDef: B,
    params: [ 'C' ],
  },
  C: {
    classDef: C,
  },
})

const a = di.get('A') //will resolve C and pass it's return to new B, then it will pass the new B to new A

//it will be equivalent to
const a = new A( new B( C() ) )
```

#### 3.2 Recursive params
You can nest dependencies declarations to infinite. It's very common use for config.  
(for others params behaviors see [`params`](#411-params))

```javascript
class A{
  constructor(config, aSecondInstanceOfB){
    this.b = config.wathever.anotherKey.b
    this.b2 = aSecondInstanceOfB
  }
}
class B{}
di.addRules({
  A: {
    classDef: A,
    params: [ {
      wathever: {
        anotherKey: {
          b: 'B'
        },
      },
    }, 'B' ],
  },
  B: {
    classDef: B,
  },
})

const a = di.get('A')

//it will be equivalent to
const a = new A( {
  wathever: {
    anotherKey: {
      b: new B(),
    },
  },
}, new B() )
```

#### 3.3. Types of params
You can wrap each value of param with a di-ninja class that will tell container how to resolve the dependency.  
By default all values and subvalues of params are traversed when it's an Object or Array,
are wrapped with `classFactory` when it's a function, and else by `interface`.  
All these behaviors can be configured, but the default config is well and the documentation rely on it.
(see
[`defaultVar`](#57-defaultvar),
[`defaultRuleVar`](#58-defaultrulevar),
[`defaultDecoratorVar`](#59-defaultdecoratorvar),
[`defaultArgsVar`](#510-defaultargsvar),  
[`defaultFactory`](#511-defaultfactory),
[`defaultFunctionWrapper`](#512-defaultfunctionwrapper))

(for others params behaviors see [`params`](#411-params))

##### 3.3.1 interface
Container will resolve dependency as, an instance of class or a value from factory, defined by corresponding rule's key.  
This is the default wrapper for string.
```javascript
class A{
  constructor(b){
    this.b = b
  }
}
class B{}

di.addRule('A', { classDef: A })
di.addRule('B', { classDef: B })

di.addRule('A', { params: [ di.interface('B') ] })

//with default config, previous rule will be equivalent to next one
di.addRule('A', { params: [ 'B' ] })


const a = di.get('A')

//will be equivalent to
const a = new A( new B() )
```

##### 3.3.2 value
Container will resolve dependency with the specified value. The value type can be anything: scalar, object, array, function...
```javascript
class A{
  constructor(bar){
    this.foo = bar
  }
}

di.addRule('A', {
  classDef: A,
  params: [ di.value('bar') ],
})

const a = di.get('A')

//will be equivalent to
const a = new A( 'bar' )
```

##### 3.3.3 factory
The behavior of this method can be configured with container config's key [`defaultFactory`](#511-defaultfactory).  
By default it's an alias for [`valueFactory`](#334-valuefactory).

##### 3.3.4 valueFactory
Container will resolve dependency with the value returned by the given function.
```javascript
class A{
  constructor(bar){
    this.foo = bar
  }
}

function getFoo(){
  return 'bar'
}

di.addRule('A', {
  classDef: A,
  params: [ di.factory( getFoo ) ],
})

const a = di.get('A')

//will be equivalent to
const a = new A( getFoo() )
```

##### 3.3.5 classFactory
Container will resolve dependency with an instance of the referenced class (or the returned value of a factory).  
This is the default wrapper for classes references.
```javascript
class A{
  constructor(b){
    this.b = b
  }
}
class B{}

di.addRule('A', { classDef: A })

di.addRule('A', { params: [ di.classFactory(B) ] })

//with default config, previous rule will be equivalent to next one
di.addRule('A', { params: [ B ] })


const a = di.get('A')

//will be equivalent to
const a = new A( new B() )
```

##### 3.3.4 require
Container will resolve dependency with an instance (or value returned by the function)
of the class (or factory) (CJS export or ES6 export default) exported by specified file.  
You can use rules to configure it.  
The behavior of this method differ according to environment:  
in all environment it will rely on preloaded require.context (see [`dependencies`](#53-dependencies))
wich is the only way to include dependency in webpack (because of static require resolution),
for node, if the dependency it's not registred, it will require the specified file and register it.
```javascript
di.addRules({
  'A': {
    classDef: A,
    params: [ di.require('path/to/my-file') ],
  },
  'path/to/my-file': {
    /* ... */
  },
)

const a = di.get('A')
```


### 4. Rules
The rules define resolutions behaviors of the classes or factories and their dependencies.
```javascript
const rules = {}

//1st way to define rules
const di = container()
di.addRules(rules)

//2nd way to define rules
const di = container({
  rules,
})
```

#### 4.1. dependencies
The following rule's keys are about classes or factories dependencies.
```javascript
//you can use class
class A{
  constructor(b, c, d){
    this.b = b
    this.c = c
    this.d = d
  }
}

//or instance factory
function A(b, c, d){
  this.b = b
  this.c = c
  this.d = d
}

//or factory
function A(b, c, d){
  const anotherValue = {
    b: b,
    c: c,
    d: d,
  }
  return anotherValue
}
```

##### 4.1.1 params
type: **array**  
containing nested dependencies

The rule's key `params` define what will be injected to class constructor or factory.
The keys can be nested (see [Recursive params](#32-recursive-params)).
The resolutions behavior depends of [Types of params](#33-types-of-params).

```javascript
class A{
  constructor(b, c, d){
    this.b = b
    this.c = c
    this.d = d
  }
}

di.addRule('A', { params: ['B','C','D'] })

```

You can override params defined in rule on manual call:
```javascript
di.get('A', ['E','F','G'])

```

##### 4.1.2 calls
type: **array**  
stack of call array with 1st item for method name or callback and 2nd item an array of params for methods (working same as [`params`](#411-params)).

Stack of methods to call after instance creation.  
If some circular dependencies are detected, some items of calls stack will be placed automatically in [`lazyCalls`](#413-lazycalls).

```javascript
class A{
  method1(dep1){
    this.dep1 = dep1
  }
  method2(dep2){
    this.dep2 = dep2
  }
  method3(dep3){
    this.dep3 = dep3
  }
}
di.addRule('A', {
  classDef: A,
  calls: [
    
    [ 'method1', [ 'dep1' ] ],
    [ 'method2', [ 'dep2' ] ],
    
    [
      function(a, dep3){
        a.method3(dep3)
      },
      [ 'dep3' ]
    ],
    
  ],
})

```

##### 4.1.3 lazyCalls
type: **array** 

Same as [`calls`](#412-calls), but run after dependency has been distributed to needing instances, this helper offer a simple way to solving circular dependency problem.

#### 4.2. instantiation
The following rule's keys are about instantiations of classes and factories.

##### 4.2.1 classDef
type: **function**
class or factory

The `classDef` key reference the class that will be used for instantiation.  
It's used for use reference to class direcly in rule, you can do without if you configure container [`dependencies`](#53-dependencies) with require.context.
```javascript
class A{}

di.addRule('A',{ classDef: A ])

assert( di.get('A') instanceof A )
```

##### 4.2.2 instanceOf
type: **string**
interface name

Refers to the name of another rule containing [`classDef`](#421-classdef) or `instanceOf`, this is resolved recursively.
```javascript
di.addRule('A',{ classDef: A })
di.addRule('B',{ instanceOf: 'A' })

assert( di.get('B') instanceof A )
```

##### 4.2.3 substitutions
type: **object** | **array**

Substitutions, as indicated by it's name,
substitutes a dependency defined by [`params`](#411-params), [`calls`](#412-calls) (and [`lazyCalls`](#413-lazycalls)).
If an object is provided, the substitutions operate by associative key, else, if an array is provided, the substitution will be done only for `params` and will be index based.  
By associative key, all dependencies of the rule's named as the key will be replaced by specified other rule's name.

index based
```javascript
@di('A', [ 'B' ])
class A{
  constructor(B){
    this.B = B
  }
}

di.addRule('A',{
  substitutions: [ 'C' ],
})

assert( di.get('A').B instanceof C )
```

associative key
```javascript
@di('A', [ { config: { subkey: 'B' } } ])
class A{
  constructor(config){
    this.B = config.subkey.B
  }
}
di.addRule('A',{
  substitutions: { 'B': 'C' },
})

assert( di.get('A').B instanceof C )
```

associative key for calls
```javascript
class A{
  setDep(config){
    this.dep = config.dep
  }
}
di.addRule('A',{
  calls: [
    [ 'setDep', [ { dep: 'B' } ] ],
  ],
  substitutions: { 'B': 'C' },
})

assert( di.get('A').dep instanceof C )
```


#### 4.3. single instance
The following rule's keys are about sharing single instances.

##### 4.3.1 shared
type: **boolean** (default false)

When `shared` is set to `true`, the instance of the classe or the factory return defined by the rule will be shared for the whole application.
```javascript
class A{
  constructor(b){
    this.b = b
  }
}
class B{}

di.addRules({
  'A': {
    params: [ 'B' ],
  },
  'B': {
    shared: true,
  },
})

const a1 = di.get('A')
const a2 = di.get('A')
assert( a1 !== a2 )

assert( a1.b === a2.b )

const b1 = di.get('B')
const b2 = di.get('B')
assert( b1 === b2 )

```

##### 4.3.2 singleton
type: **object** | **array** | **scalar**

If specified it will be registred as shared instance of the dependency for the whole application.
```javascript
class A{
  constructor(b){
    this.b = b
  }
}
class B{}

const b = new B()

di.addRules({
  'A': {
    params: [ 'B' ],
  },
  'B': {
    singleton: b,
  },
})

const a1 = di.get('A')
const a2 = di.get('A')
assert( a1 !== a2 )

assert( a1.b === a2.b === b )

const b1 = di.get('B')
const b2 = di.get('B')
assert( b1 === b2 === b )

```

##### 4.3.3 sharedInTree
In some cases, you may want to share a a single instance of a class between every class in one tree but if another instance of the top level class is created, have a second instance of the tree.

For instance, imagine a MVC triad where the model needs to be shared between the controller and view, but if another instance of the controller and view are created, they need a new instance of their model shared between them.

The best way to explain this is a practical demonstration:
```javascript
class A {    
  constructor(b, c){
    this.b = b
    this.c = c
  }
}

class B {
  constructor(d){
    this.d = d
  }
}

class C {
  constructor(d){
    this.d = d
  }
}

class D {}

di.addRule('A', {
  'sharedInTree': ['D'],
})

const a = di.get('A')

// Anywhere that asks for an instance D within the tree that existis within A will be given the same instance:
// Both the B and C objects within the tree will share an instance of D
assert( a.b.d === a.c.d )

// However, create another instance of A and everything in this tree will get its own instance of D:
const a2 = di.get('A')
assert( a2.b.d === a2.c.d )

assert( a.b.d !== a2.b.d )
assert( a.c.d !== a2.c.d )

```

By using `sharedInTree` it's possible to mark D as shared within each instance of an object tree.
The important distinction between this and global shared objects is that this object is only shared within a single instance of the object tree. 


#### 4.4. rule inheritance
The following rule's keys are about rule inheritance.  
There are three way to herit rule, the priority order of override is
[`inheritInstanceOf`](#441-inheritinstanceof),
overrided by [`inheritPrototype`](#442-inheritprototype), 
overrided by [`inheritMixins`](#443-inheritmixins), 
and finally the rule itself wich is composed by rule definition and [`decorator`](#444-decorator).
Priority between rule and decorator depends of calls order, the last take precedence, traditionally it's the rule.  
Most of rules options are replaced except some options that will be merged:
[`sharedInTree`](#433-sharedintree), [`substitutions`](#423-substitutions),
[`calls`](#412-calls) and [`lazyCalls`](#413-lazycalls).

See also [`rulesDefault`](#52-rulesDefault) in container config section.

##### 4.4.1 inheritInstanceOf
type: **boolean** (default true)  
Enable inheritance of rules from instanceOf parents classes.

```javascript
class X{
  constructor(x){
    this.x = x
  }
}
    
di.addRules({
  'X':{
    classDef: X,
    params: [ di.value('ok') ],
    shared: true,
  },
  'Y':{
    instanceOf: 'X',
    inheritInstanceOf: true,
  },
})

assert( di.get('Y').x === 'ok' )
assert( di.get('Y') === di.get('Y') )

```

##### 4.4.2 inheritPrototype
type: **boolean** (default false)  

Enable inheritance of rules from ES6 extended parents classes.  
[`decorator`](#444-decorator) must be enabled to parents rules you want to extend from.
```javascript
class Z{
  constructor(...params){
    this.params = params
  }
}
class ZX extends Z{}

di.addRules({
  'Z': {
    classDef: Z,
    params: [ di.value(1), di.value(2), di.value(3) ],
    decorator: true, //needed for parent class by extended using inheritPrototype
  },
  'Z2': {
    classDef: ZX,
    inheritPrototype: true,
  },
})

const z   = di.get('Z').getParams()
const z2  = di.get('Z2').getParams()
assert.deepEqual(z2, z)

```

##### 4.4.3 inheritMixins
type: **array**

Enable inheritance from a list of specified rules.
```javascript
class A{
  constructor(...params){
    this.params = params
  }
  getParams(){
    return this.params
  }
}
class B{
  constructor(...params){
    this.params = params
  }
  getParams(){
    return this.params
  }
}

di.addRules({
  'A':{
    classDef: A,
    params: [ di.value('a') ],
  },
  'B':{
    classDef: B,
    inheritMixins: [ 'A' ],
  },
})

const a = di.get('A').getParams()
const b = di.get('B').getParams()
assert.deepEqual(b, a)  
```

##### 4.4.4 decorator
type: **boolean** (default false)

When set to `true`, a [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) property
will be set on class or factory function, allowing to use [`inheritPrototype`](#442-inheritprototype).
If the [decorator injection approach](#22-decorator-injection-approach) is used, it's not necessary to configure this rule,
because the Symbol will be set whatever the decorator key value is.  
This is required to enable [`inheritPrototype`](#442-inheritprototype) feature.

#### 4.5. asynchronous dependencies resolution
The following rule's keys allow you to manage the asynchronous dependencies resolution flow.  
When a dependency return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
and this promise is waited for resolution by [`asyncResolve`](#541-asyncresolve),
the outputed object of `di.get()` method will be a Promise object,
wich will be resolved by the expected object.

##### 4.5.1 asyncResolve
type: **boolean** (default false)

When set to `true`, if a factory return a Promise, the dependency tree will wait for it's resolution,
and then call the requiring dependency with the Promise's resolved value.  
Promise is detected with instanceof operator, if you want to use a specific Promise polyfill (eg: [bluebird](http://bluebirdjs.com)) you can use
the [`promiseFactory`](#513-promisefactory) and [`promiseInterfaces`](#514-promiseinterfaces) container's config options.

```javascript
function A(b, c){
  this.b = b
  this.c = c
}
async function B(){
  return 'b'
}
async function C(){
  return 'c'
}

di.addRules({
  'A': {
    classDef: A,
    params: ['B','C'],
  },
  'B': {
    classDef: B,
    asyncResolve: true,
  },
  'C': {
    classDef: C,
    asyncResolve: false, //default
  },
})

di.get('A').then(a => {
  assert(a.b === 'b')
  assert(a.c instanceof Promise)
})

```

##### 4.5.2 asyncCallsSerie
type: **boolean** (default false)

When set to `true`, defer [`calls`](#412-calls) resolution sequentially
when the method or callback require a dependency returning a Promise and for wich [`asyncResolve`](#451-asyncresolve) rule option setted to true.

```javascript
class A{
  setB(d){
    this.b = ++d.i
  }
  setC(d){
    this.c = ++d.i
  }
}

function B(d){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(d)
    }, 200)
  })
}
function C(d){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(d)
    }, 100)
  })
}

function D(){
  this.i = 0
}

di.addRules({
  'A': {
    classDef: A,
    calls: [
      ['setB', ['B'] ],
      ['setC', ['C'] ],
    ],
    sharedInTree: ['D'],
    asyncCallsSerie: false, //default
  },
  'A2': {
    instanceOf: 'A',
    asyncCallsSerie: true,
  },
  
  'B': {
    classDef: B,
    params: ['D'],
    asyncResolve: true,
  },
  'C': {
    classDef: C,
    params: ['D'],
    asyncResolve: true,
  },
  'D':{
    classDef: D,
  },
  
  
})

di.get('A').then( a => {
  assert.strictEqual(a.b, 2)
  assert.strictEqual(a.c, 1)
} )

di.get('A2').then( a => {
  assert.strictEqual(a.b, 1)
  assert.strictEqual(a.c, 2)
} )
```

##### 4.5.3 asyncCallsParamsSerie
type: **boolean** (default false)

When set to `true`, ensure that the dependencies stacks for all [`calls`](#412-calls) of a dependency are resolved sequentially according to order of calls,
when the method or callback require a dependency returning a Promise and for wich [`asyncResolve`](#451-asyncresolve) rule option setted to true.
Setted to true, it will implicitly set [`asyncCallsSerie`](#452-asynccallsserie) to true.

```javascript
class A{
  setB(b){
    this.b = b
  }
  setC(c){
    this.c = c
  }
}

function B(d){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(++d.i)
    }, 200)
  })
}
function C(d){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(++d.i)
    }, 100)
  })
}

function D(){
  this.i = 0
}

di.addRules({
  'A': {
    classDef: A,
    calls: [
      ['setB', ['B'] ],
      ['setC', ['C'] ],
    ],
    asyncCallsParamsSerie: true,
    sharedInTree: ['D'],
  },
  'B': {
    classDef: B,
    params: ['D'],
    asyncResolve: true,
  },
  'C': {
    classDef: C,
    params: ['D'],
    asyncResolve: true,
  },
  'D':{
    classDef: D,
  },
})

di.get('A').then( a => {
  assert(a.b === 1)
  assert(a.c === 2)
})

```

#### 4.6 dependency file location
The following rule's keys are about dependency file location.  

##### 4.6.1 autoload
type: **boolean** (default false)

When set to `true`, check for allready registred dependency and if not, in node, try to require it,
if dependency is not found it can (maybe) throw an Error according to [`autoloadFailOnMissingFile`](#56-autoloadfailonmissingfile) container config.  
The require path resolution is based first on [`path`](#462-path) rule option if defined,
then on [`instanceOf`](#422-instanceof) rule option if defined (if instanceOf point to a rule with it's own path it will get it),
and finally on the key of the rule.
This require path can be post-processed using [`autoloadPathResolver`](#54-autoloadpathresolver) container config.  
The colons character `:` can be used to get a subkey of exported,
and you can use it multiple times in same expression to get nested value.
When [`path`](#462-path) is defined it will implicitly set autoload to true.

```javascript
di.addRules({
  'http:Server':{
    autoload: true,
  },
  '#server': {
    instanceOf: 'http:Server',
    autoload: true,
  },
  '#server2': {
    path: 'http:Server',
  },
  
})

assert( di.get('http:Server') instanceof require('http').Server )
assert( di.get('#server') instanceof require('http').Server )
assert( di.get('#server2') instanceof require('http').Server )
```

##### 4.6.2 path
type: **string**  

The require path can be post-processed by [`autoloadPathResolver`](#54-autoloadpathresolver) container config.  
When defined it will implicitly set [`autoload`](#461-autoload) to true.  
You can traverse exported and get specific key using colons character `:`.  
You can't use relative path, if you want to include relative path, your application source files for exemple,
you have to alias directories (or files) using [`autoloadPathResolver`](#54-autoloadpathresolver) feature.  
See [`autoload`](#461-autoload) section for more details on the requiring behavior based on implicit path with instanceOf and rule's key.

```javascript
di.addRules({
  '#server': {
    path: 'http:Server',
  },
})

assert( di.get('#server') instanceof require('http').Server )
```


### 5. Container
The container config options manage the container behavior and the way that the rules are resolving.
```javascript
import container from 'di-ninja'

//set config on container creation
const di = container(config)

//or using config method
const di = container()
di.config(config)
di.config('aConfigKey', aConfigValue)
```
Order of config calls doesn't matter except for options [`dependencies`](#53-dependencies) and [`rules`](#51-rules) wich must be called at end.
If key/value config object is provided as config param, options will be treated in the correct order.

#### 5.1 rules
See [`rules`](#4-rules) section.
```javascript
di.config({
  rules
})

//or
di.config('rules',rules)

//or
di.addRules(rules)
di.addRule('#myClassName', rule)
```

#### 5.2 rulesDefault
Default values for rules, each rule will be extended from this setup, values will be overidded or merged.  
See [rule inheritance](#44-rule-inheritance) documentation section for more details on extending.
See [`rules`](#4-rules) section for rules options.
```javascript
di.config('rulesDefault',rulesDefault)
```

#### 5.3 dependencies
Dependencies is intendeed to allow you to "inject" require's context directories as preload dependencies.
It work using the webpack `require.context` feature,
but a node polyfill called `container.context` is provided with di-ninja allowing you to build isomorphic architecture.  
see also [`polyfillRequireContext`](#519-polyfillrequirecontext)

NodeJS example
```javascript
import container from 'di-ninja'

const di = container({
  rules:{
    'app/A': {
      
    },
    'app/B': {
      
    },
    'app/B/C': {
      
    },
  },
  
  dependencies: {
    
    'app' : container.context('./src', true, /\.js$/),
    
    'A': container.require('./src/A'),
    
    'B': container.dependency(require('./src/B')),
    
  },
})

assert( di.get('app/A') instanceof require('./src/A').default )

assert( di.get('app/B') instanceof require('./src/B').default )

assert( di.get('app/B/C') instanceof require('./src/B/C').default )

assert( di.get('A') instanceof require('./src/A').default )

assert( di.get('B') instanceof require('./src/B').default )

```


Isomorphic example  
Use the same code for browser compilation via webpack than on server-side with nodejs.  

in webpack.config.js

```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APP_ENV: JSON.stringify('browser')
      }
    }),
  ],
  /* ... */
}

```

and in your dependency-injection config file
```javascript
import container from 'di-ninja'

if(process.env.APP_ENV !== 'browser'){
  //we are not in webpack/browser but in nodejs/server-side
  require.context = container.context
}

const di = container({
  rules:{
    'app/A': {
      
    },
    'app/B': {
      
    },
    'app/B/C': {
      
    },
    
  },
  
  dependencies: {
    'app' : require.context('./src', true, /\.js$/),    
    
    'A': container.dependency( require('./src/A') ),
    
    'B': container.dependency( require('./src/B') ),
  },
})

assert( di.get('app/A') instanceof require('./src/A').default )

assert( di.get('app/B') instanceof require('./src/B').default )

assert( di.get('app/B/C') instanceof require('./src/B/C').default )

assert( di.get('A') instanceof require('./src/A').default )

assert( di.get('B') instanceof require('./src/B').default )
```


#### 5.4 autoloadPathResolver
Rule's path post-processor callback function or alias map object.

with callback
```javascript
di.config('autoloadPathResolver', (path)=>{
  switch(path){
    case 'framework':
      path = 'express'
    break
  }
  return path
})
```

with alias map object
```javascript
import path from 'path'
const aliasMap = {
  'app': path.resolve(__dirname, './src'),
}

di.config('autoloadPathResolver', aliasMap)


//will implicitly set the following predefined callback, here is the magic under the hood
di.config('autoloadPathResolver', (path)=>{
  Object.keys(aliasMap).forEach(alias=>{
    const realPath = aliasMap[alias]
    if(path == alias){
      path = realPath
    }
    else if(path.substr(0,alias.length+1)==alias+'/'){
      path = realPath+path.substr(alias.length)
    }
  })
  return path
})
```

#### 5.5 autoloadExtensions
You can use Array or RegExp.
```javascript
di.config('autoloadExtensions', ['js', 'jsx'])

di.config('autoloadExtensions', new RegExp('\.(js|jsx)$'))
```


#### 5.6 autoloadFailOnMissingFile
Possible values are string `path`, `true` or `false`.  
Setted to false, it will never throw error on missing dependency.  
Setted to true, it will always throw an error on missing dependency.  
Setted to `path`, it will throw error only if a dependency with a specified rule's option [`path`](#462-path) is specified.
The default value is `path`.  

```javascript
di.config('autoloadFailOnMissingFile', true)
```

#### 5.7 defaultVar
Value by default for
[`defaultRuleVar`](#58-defaultrulevar),
[`defaultDecoratorVar`](#59-defaultdecoratorvar),
and [`defaultArgsVar`](#510-defaultargsvar).

This is about implicit wrapping of [`params`](#411-params), [`calls`](#412-calls) and [`lazyCalls`](#413-lazycalls).

Possible values are `interface` or `value`.  
Default is `interface`.  

`interface` mean that all scalar values will be implicitly wrapped by di.interface(), it will be resolved as class.
`value` mean that all scalar values will be wrapped by di.value(), it will be left as untouched.

interface example
```javascript
di.config('defaultVar', 'interface') //default

di.addRule('A', {
  params: [
    {
      B :        'B',
      message :  di.value( 'Hello world !' ),
      config :  di.value({
        option1: value1
        /* ... */
      }),
    }
  ]
})
```


value example
```javascript
di.config('defaultVar', 'value')

di.addRule('A', {
  params: [
    {
      B :        di.interface('B'),
      message :  'Hello world !',
      config :  di.value({
        option1: value1
        /* ... */
      }),
    }
  ]
})
```

#### 5.8 defaultRuleVar
Implicit wrapping for scalar values defined from [`rules`](#4-rules).  
see [`defaultVar`](#57-defaultvar).


#### 5.9 defaultDecoratorVar
Implicit wrapping for scalar values defined from [`decorator`](#444-decorator).  
see [`defaultVar`](#57-defaultvar).


#### 5.10 defaultArgsVar
Implicit wrapping for scalar values defined from manual call (see [`params`](#411-params)).  
see [`defaultVar`](#57-defaultvar).

#### 5.11 defaultFactory
default wrapper class to instanciate for di.factory() method.

#### 5.12 defaultFunctionWrapper
Implicit wrapping for function or class values.  
Possible values are ClassFactory or ValueFactory.  
The default value is ClassFactory.

ClassFactory example
```javascript
import ClassFactory from 'di-ninja/dist/classFactory'
di.config('defaultFunctionWrapper', ClassFactory) //default

class B{}

di.addRule('A', {
  params: [
    B,
    di.valueFactory( () => {
      return 'Hello world !'
    } )
  ],
})
```

ValueFactory example
```javascript
import ValueFactory from 'di-ninja/dist/valueFactory'
di.config('defaultFunctionWrapper', ValueFactory)

class B{}

di.addRule('A', {
  params: [
    di.classFactory( B ),
    () => {
      return 'Hello world !'
    }
  ],
})
```

#### 5.13 promiseFactory
default: Promise (global)  
`promiseFactory` option let you modify the way DiNinja create Promise for handle [`asyncResolve`](#451-asyncresolve).  
For example, you can use it with bluebird.  
The common way is to use it in combination with [`promiseInterfaces`](#514-promiseinterfaces) option.

```javascript
import bluebird from 'bluebird'

di.config('promiseFactory', bluebird)

function A (b) {
  this.b = b
}
function B () {
  return new Promise((resolve, reject) => {
	resolve('b')
  })
}

di.addRules({
  'A': {
	classDef: A,
	params: ['B']
  },
  'B': {
	classDef: B,
	asyncResolve: true
  }
})

assert( di.get('A') instanceof bluebird )

```

#### 5.14 promiseInterfaces
default: Promise (global)  
`promiseInterfaces` option let you modify the way DiNinja recognize Promise.  
For example, you can use it with bluebird.  
The common way is to use it in combination with [`promiseFactory`](#513-promisefactory) option.  
The [`promiseFactory`](#513-promisefactory) option will automatically be pushed to promiseInterfaces.

```javascript
import bluebird from 'bluebird'

di.config('promiseInterfaces', [ bluebird, Promise /* let the standard Promise be identified */ ])

function A(b){
  this.b = b
}
function B(){
  return new bluebird((resolve, reject)=>{
    resolve('b')
  })
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
})

assert( di.get('A') instanceof Promise )

```

#### 5.15 interfacePrototype
Enable you to use [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based
interface reference instead of string as dependency key, allowing you to use runtime [`interfaceTypeCheck`](#516-interfacetypecheck).
```javascript
import {
  InterfacePrototype,
  instanceOf,
  Interface,
} from 'interface-prototype'

di.config('interfacePrototype', InterfacePrototype)
    
const I = new Interface();

@di('A')
@instanceOf(I)
class A{}

@di('B')
@instanceOf(I)
class B{}

di.addRules({
	[I]: {
		classDef: A,
	}
})

@di('D', [I])
class D {
  constructor(i){
    this.i = i;
  }
}

assert(di.get('A') instanceof I)
assert(di.get('B') instanceof I)

assert(di.get(I) instanceof A)
assert( !( di.get(I) instanceof B ))

assert(di.get('D').i instanceof A)
 
```

#### 5.16 interfaceTypeCheck
type: **boolean** (default false)

Enable check for "implemented" interface using [`interfacePrototype`](#515-interfaceprototype).
If a manually provided dependency doesn't "implement" the required "interface", it will throw an error.  
In combination with [interface-prototype](https://github.com/di-ninja/interface-prototype),
this enable runtime type-check and custom type-check for all type of variables.  


#### 5.17 globalKey
type: **string** | **boolean** (default false)  
When setted to true it will be transformed to string 'di'.  
If provided, global.globalKey (on node) or window.globalKey (on browser) will be set to the instance of container.
```javascript
container({
  globalKey: 'di',
})

di.get('A')
```

#### 5.18 ruleCache
type: **boolean** (default true)  
Enable cache for built rules, optimizing the future calls of `di.get()`.  
You can set it to false when you have rules dynamically modified after some `di.get()` calls.
```javascript
di.config('ruleCache', false)

di.addRule('A', { params: [ 'B' ] })

const a1 = di.get('A')

di.addRule('A', { params: [ 'C' ] })

const a2 = di.get('A')
```

#### 5.19 polyfillRequireContext
type: **boolean** (default false)  
This is an experimental feature, so be carefull.  
It will automatically polyfill the [webpack's `require.context` method](https://webpack.js.org/guides/dependency-management/#require-context) to nodejs environment.  
It's an helper to enforce easy isomorphism (cross-environment).  
See also [`dependencies`](#53-dependencies) for the hack-less technic

### 6 Examples

Here is a list of examples of complex di-ninja implementations with dependencies wired by directories:
1. [di-ninja-nodejs-example](https://github.com/di-ninja/di-ninja-nodejs-example) (using di-ninja node polyfill for `require.context()`)
2. [di-ninja-webpack-example](https://github.com/di-ninja/di-ninja-webpack-example) (using `require.context()` native method of webpack)
3. [di-ninja-reactnative-example](https://github.com/di-ninja/di-ninja-reactnative-example) (using [babel-plugin-require-context-polyfill](https://github.com/di-ninja/babel-plugin-require-context-polyfill))


## About
Built with [babel](https://babeljs.io/) and ❤️ but use is unopinionated ;)  
Work with NodeJS, [Webpack](https://webpack.js.org/), React-Native and UMD/AMD (requirejs).
Inspired by [strategy](https://github.com/redcatphp/strategy) for php, itself based on [dice](https://r.je/dice.html) design.
