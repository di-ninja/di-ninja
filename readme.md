# DI-Ninja [![DI-Ninja ICON](https://raw.githubusercontent.com/di-ninja/di-ninja/master/icon/icon.png)](https://github.com/di-ninja/di-ninja#)

Universal JavaScript Dependency-Injection framework for node and browser.

## Installation
```
$ npm i di-ninja
```

## Goals
  * Implement [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) using [Composition Root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/) design pattern, allowing to keep all things decoupled and to wire application components and config at one unique root place.

  * Replace the singleton anti-pattern with dependency-injection by refacto export of instances to export of classes and factories.
  
  * Get a pure JavaScript non-dogmatic cross-transpiller [Dependency-Injection](https://en.wikipedia.org/wiki/Dependency_injection) framework.

  * Encourage adherence to the best practices of Object Oriented design
  ( [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)),
  [IoC](https://en.wikipedia.org/wiki/Inversion_of_control),
  [Dependency-Injection](https://en.wikipedia.org/wiki/Dependency_injection),
  [Composition Root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/),
  [Strategy](https://en.wikipedia.org/wiki/Strategy_pattern) ...).
  
  * Improve code testability.
  
  * Extend the Art of JavaScript development.

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
	
	2. [instance](#42-instance)
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
		
	6. [dependency file location](#46-dependency-file-location)
		1. [autoload](#461-autoload)
		2. [path](#462-path)


5. [Container](#5-container)

	1. [rules](#51-rules)
	2. [rulesDefault](#52-rulesdefault)
	
	3. [autoloadFailOnMissingFile](#53-autoloadfailonmissingfile)
	4. [dependencies](#54-dependencies)
	5. [autoloadExtensions](#55-autoloadextensions)
	6. [autoloadPathResolver](#56-autoloadpathresolver)
	
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
	

### 1. Getting Started
```javascript
import container from 'di-ninja'

const di = container();

di.addRules(rules);

di.get('MyClassName');
```


### 2. Dependencies declarations approaches

To define dependencies, you can use [Composition-Root](#21-composition-root) or [Decorator injection approach](#22-decorator-injection-approach) for each components individually.  
Differents approaches can be used for differents methods injections on same component.  
Dependencies definition can be overrided, the last call of addRule or @di decorator will take precedence.

#### 2.1 Composition-Root

The Composition Root is the highest level of your application, the top overlay.  
It's here that you will configure many rules for your components and wire them together.  
Using only the Composition Root design pattern has the advantage to let you have totaly unopinionated components,
all your classes and factories can keep uncoupled from the dependency injector (di-ninja).


```javascript
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

#### 2.2 Decorator injection approach

The Decorator injection approach let your components define their own dependencies.  
These dependencies declarations can rely on container level defined abstractions (recommanded),
or on direct class or factory definition.  
It can be used in addition to the Composition-Root and replace the rule's key "[params](#411-params)" and also the parameters of call argument for rule's key "[calls](#412-calls)" and "[lazyCalls](#413-lazycalls)".

##### 2.2.1 abstract class
```javascript
di.addRule('B',{
  classDef: B,
})

@di('A',[ 'B' ])
class A{
  constructor(b){
    this.b = b;
  }
}

di.get('A')
```

##### 2.2.2 reference class
```javascript
@di('A',[ B ])
class A{
  constructor(b){
    this.b = b;
  }
}

di.get('A')
```

### 3. Dependencies Resolution
The dependencies are resolved according to rule's key "[params](#411-params)" and parameters of call argument for rule's key "[calls](#412-calls)" and "[lazyCalls](#413-lazycalls)".

#### 3.1 Recursive classes or factories
You can use factories or classes, and obviously, all dependencies are resolved recursively.
```javascript
class A{
	constructor(b){
		this.b = b;
	}
}
class B{
	constructor(c){
		this.c = c;
	}
}
function C(){
	return 'Hello world !';
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
});

const a = di.get('A'); //will resolve C and pass it's return to new B, then it will pass the new B to new A

//it will be equivalent to
const a = new A( new B( C() ) );
```

#### 3.2 Recursive params
You can nest dependencies declarations to infinite. It's very common use for config.  
(for others params behaviors see [params](#411-params))

```javascript
class A{
	constructor(config, aSecondInstanceOfB){
		this.b = config.wathever.anotherKey.b;
		this.b2 = aSecondInstanceOfB;
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
});

const a = di.get('A');

//it will be equivalent to
const a = new A( {
	wathever: {
		anotherKey: {
			b: new B(),
		},
	},
}, new B() );
```

#### 3.3. Types of params
You can wrap each value of param with a di-ninja class that will tell container how to resolve the dependency.  
By default all values and subvalues of params are traversed when it's an Object or Array,
are wrapped with "classFactory" when it's a function, and else by "interface".  
All these behaviors can be configured, but the default config is well and the documentation rely on it.
(see
[defaultVar](#57-defaultvar),
[defaultRuleVar](#58-defaultrulevar),
[defaultDecoratorVar](#59-defaultdecoratorvar),
[defaultArgsVar](#510-defaultargsvar),	
[defaultFactory](#511-defaultfactory),
[defaultFunctionWrapper](#512-defaultfunctionwrapper))

(for others params behaviors see [params](#411-params))

##### 3.3.1 interface
Container will resolve dependency as, an instance of class or a value from factory, defined by corresponding rule's key.  
This is the default wrapper for string.
```javascript
class A{
	constructor(b){
		this.b = b;
	}
}
class B{}

di.addRule('A', { classDef: A });
di.addRule('B', { classDef: B });

di.addRule('A', { params: [ di.interface('B') ] });

//with default config, previous rule will be equivalent to next one
di.addRule('A', { params: [ 'B' ] });


const a = di.get('A');

//will be equivalent to
const a = new A( new B() );
```

##### 3.3.2 value
Container will resolve dependency with the specified value. The value type can be anything: scalar, object, array, function...
```javascript
class A{
	constructor(bar){
		this.foo = bar;
	}
}

di.addRule('A', {
	classDef: A,
	params: [ di.value('bar') ],
});

const a = di.get('A');

//will be equivalent to
const a = new A( 'bar' );
```

##### 3.3.3 factory
The behavior of this method can be configured with container config's key [defaultFactory](#511-defaultfactory).  
By default it's an alias for [valueFactory](#334-valueFactory).

##### 3.3.4 valueFactory
Container will resolve dependency with the value returned by the given function.
```javascript
class A{
	constructor(bar){
		this.foo = bar;
	}
}

function getFoo(){
	return 'bar';
}

di.addRule('A', {
	classDef: A,
	params: [ di.factory( getFoo ) ],
});

const a = di.get('A');

//will be equivalent to
const a = new A( getFoo() );
```

##### 3.3.5 classFactory
Container will resolve dependency with an instance of the referenced class (or the returned value of a factory).  
This is the default wrapper for classes references.
```javascript
class A{
	constructor(b){
		this.b = b;
	}
}
class B{}

di.addRule('A', { classDef: A });

di.addRule('A', { params: [ di.classFactory(B) ] });

//with default config, previous rule will be equivalent to next one
di.addRule('A', { params: [ B ] });


const a = di.get('A');

//will be equivalent to
const a = new A( new B() );
```

##### 3.3.4 require
Container will resolve dependency with an instance (or value returned by the function)
of the class (or factory) (CJS export or ES6 export default) exported by specified file.  
You can use rules to configure it.  
The behavior of this method differ according to environnement:  
in all environnement it will rely on preloaded require.context (see [dependencies](#54-dependencies))
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
);

const a = di.get('A');
```


### 4. Rules
The rules define resolutions behaviors of the classes or factories and their dependencies.
```javascript
const rules = {};

//1st way to define rules
const di = container();
di.addRules(rules);

//2nd way to define rules
const di = container({
	rules,
});
```

#### 4.1. dependencies
The following rule's key are about classes or factories dependencies.
```javascript
//you can use class
class A{
	constructor(b, c, d){
		this.b = b;
		this.c = c;
		this.d = d;
	}
}

//or instance factory
function A(b, c, d){
	this.b = b;
	this.c = c;
	this.d = d;
}

//or factory
function A(b, c, d){
	const anotherValue = {
		b: b,
		c: c,
		d: d,
	};
	return anotherValue;
}
```

##### 4.1.1 params
type: **array**  
containing nested dependencies

The rule's key "params" define what will be injected to class constructor or factory.
The keys can be nested (see [Recursive params](#32-recursive-params)).
The resolutions behavior depends of [Types of params](#33-types-of-params).

```javascript
class A{
	constructor(b, c, d){
		this.b = b;
		this.c = c;
		this.d = d;
	}
}

di.addRule('A', { params: ['B','C','D'] });

```

You can override params defined in rule on manual call:
```javascript
di.get('A', ['E','F','G']);

```

##### 4.1.2 calls
type: **array**  
stack of call array with 1st item for method name or callback and 2nd item an array of params for methods (working same as [params](#411-params)).

Stack of methods to call after instance creation.  
If some circular dependencies are detected, some items of calls stack will be placed automatically in [lazyCalls](#413-lazycalls).

```javascript
class A{
	method1(dep1){
		this.dep1 = dep1;
	}
	method2(dep2){
		this.dep2 = dep2;
	}
	method3(dep3){
		this.dep3 = dep3;
	}
}
di.addRule('A', {
	classDef: A,
	calls: [
		
		[ 'method1', [ 'dep1' ] ],
		[ 'method2', [ 'dep2' ] ],
		
		[
			function(a, dep3){
				a.method3(dep3);
			},
			[ 'dep3' ]
		],
		
	],
});

```

##### 4.1.3 lazyCalls
Same as [calls](#412-calls), but run after dependency has been distributed to needing instances, this helper offer a simple way to solving circular dependency problem.

#### 4.2. instance
...
```javascript

```

##### 4.2.1 classDef
...
```javascript

```

##### 4.2.2 instanceOf
...
```javascript

```

##### 4.2.3 substitutions
...
```javascript

```


#### 4.3. single instance
...
```javascript

```

##### 4.3.1 shared
...
```javascript

```

##### 4.3.2 singleton
...
```javascript

```

##### 4.3.3 sharedInTree
...
```javascript

```


#### 4.4. rule inheritance
...
```javascript

```

##### 4.4.1 inheritInstanceOf
...
```javascript

```

##### 4.4.2 inheritPrototype
...
```javascript

```

##### 4.4.3 inheritMixins
...
```javascript

```

##### 4.4.4 decorator
...
```javascript

```

#### 4.5. asynchrone dependencies resolution
...
```javascript

```

##### 4.5.1 asyncResolve
...
```javascript

```

##### 4.5.2 asyncCallsSerie
...
```javascript

```

#### 4.6 dependency file location
...
```javascript

```

##### 4.6.1 autoload
...
```javascript

```

##### 4.6.2 path
...
```javascript

```


### 5. Container
...
```javascript

```

#### 5.1 rules
...
```javascript

```

#### 5.2 rulesDefault
...
```javascript

```

#### 5.3 autoloadFailOnMissingFile
...
```javascript

```

#### 5.4 dependencies
...
```javascript

```

#### 5.5 autoloadExtensions
...
```javascript

```

#### 5.6 autoloadPathResolver
...
```javascript

```

#### 5.7 defaultVar
...
```javascript

```

#### 5.8 defaultRuleVar
...
```javascript

```

#### 5.9 defaultDecoratorVar
...
```javascript

```

#### 5.10 defaultArgsVar
...
```javascript

```

#### 5.11 defaultFactory
...
```javascript

```

#### 5.12 defaultFunctionWrapper
...
```javascript

```

#### 5.13 promiseFactory
...
```javascript

```

#### 5.14 promiseInterfaces
...
```javascript

```

#### 5.15 interfacePrototype
...
```javascript

```

#### 5.16 interfaceTypeCheck
...
```javascript

```

#### 15.17 globalKey
...
```javascript

```


## About
Built with babel but use is unopinionated. Browser usage is optimized for webpack.
Can be used with [interface-prototype](https://github.com/di-ninja/interface-prototype),
you can get pre-wired implementation from [omniverse](https://github.com/di-ninja/omniverse) library.
Inspired by [strategy](https://github.com/redcatphp/strategy) for PHP, itself based on [dice](https://r.je/dice.html) design.
