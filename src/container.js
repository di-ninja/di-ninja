import PATH from 'path'

import mapSerie from './mapSerie'

import Var from './var'
import Factory from './factory'
import ValueFactory from './valueFactory'
import ClassFactory from './classFactory'
import Value from './value'
import Interface from './interface'
import InterfaceClass from './interfaceClass'
import Require from './require'

import SharedInstance from './sharedInstance'

import ClassDef from './classDef'

import Dependency from './dependency'

import makeContainerApi from './makeContainerApi'

import Sync from './sync'
import structuredHasPromise from './structuredHasPromise'
import structuredPromiseAllRecursive from './structuredPromiseAllRecursive'
import structuredResolveParamsInterface from './structuredResolveParamsInterface'

import structuredInterfacePrototype from './structuredInterfacePrototype'

import promiseInterface from './promiseInterface'

import isWin32AbsolutePath from './isWin32AbsolutePath'

import LazyRequire from './lazyRequire'

const SEP = PATH.sep
const SEP_BACK = SEP !== '/'

let interfacePrototypeDefault
const configMethods = new Map([
  ['rulesDefault', 'setRulesDefault'],

  ['autoloadFailOnMissingFile', 'setAutoloadFailOnMissingFile'],
  ['autoloadExtensions', 'setAutoloadExtensions'],
  ['autoloadPathResolver', 'setAutoloadPathResolver'],

  ['defaultVar', 'setDefaultVar'],
  ['defaultRuleVar', 'setDefaultRuleVar'],
  ['defaultDecoratorVar', 'setDefaultDecoratorVar'],
  ['defaultArgsVar', 'setDefaultArgsVar'],

  ['defaultFactory', 'setDefaultFactory'],
  ['defaultFunctionWrapper', 'setDefaultFunctionWrapper'],

  ['globalKey', 'setGlobalKey'],

  ['interfacePrototype', 'setInterfacePrototype'],
  ['interfaceTypeCheck', 'setInterfaceTypeCheck'],

  ['ruleCache', 'setRuleCache'],

  // order matters (sometimes a little performance gain) for theses methods
  ['promiseFactory', 'setPromiseFactory'],
  ['promiseInterfaces', 'setPromiseInterfaces'],

  // order matters for theses methods
  ['dependencies', 'setDependencies'],
  ['rules', 'addRules'],

  ['polyfillRequireContext', 'setPolyfillRequireContext'],
  
  ['lazyRequire', 'setLazyRequire']
])
const allowedDefaultVars = ['interface', 'value']

export default class Container {
  static setInterfacePrototypeDefault (interfacePrototype) {
    interfacePrototypeDefault = interfacePrototype
  }
  static getInterfacePrototypeDefault (interfacePrototype) {
    return interfacePrototypeDefault
  }

  constructor (config = {}) {
    this.symClassName = Symbol('className')
    this.symInterfaces = Symbol('types')
    this.providerRegistry = {}
    this.instanceRegistry = {}
    this.requires = {}
    this.dependencies = {}
    this.directoryLoaders = {}
    this.rules = {}
    this.rulesCache = {}
    this.rulesDefault = {

      inheritInstanceOf: true,
      inheritPrototype: false,
      inheritMixins: [],

      shared: false,
      instanceOf: false,
      classDef: false,
      params: false,

      calls: [],
      lazyCalls: [],

      substitutions: [],
      sharedInTree: [],

      singleton: false,

      asyncResolve: false,
      asyncCallsSerie: false,
      asyncCallsParamsSerie: false,

      decorator: false,

      autoload: undefined,
      path: undefined

    }

    this.config(config, true)
  }

  config (key, value) {
    if (typeof key === 'object') {
      const config = key
      const init = value
      configMethods.forEach((method, key) => {
        if (init || config.hasOwnProperty(key)) {
          this[method](config[key])
        }
      })
      return
    }
    const method = configMethods.get(key)
    this[method](value)
  }

  setRuleCache (ruleCache = true) {
    this.ruleCache = ruleCache
  }

  setDefaultFactory (defaultFactory = ValueFactory) {
    this.DefaultFactory = defaultFactory
  }
  setDefaultFunctionWrapper (defaultFunctionWrapper = ClassFactory) {
    this.DefaultFunctionWrapper = defaultFunctionWrapper
  }

  setInterfaceTypeCheck (interfaceTypeCheck = false) {
    this.interfaceTypeCheck = interfaceTypeCheck
  }

  setInterfacePrototype (interfacePrototype) {
    this.interfacePrototype = interfacePrototype || interfacePrototypeDefault
  }

  setAutoloadFailOnMissingFile (autoloadFailOnMissingFile = 'path') {
    this.autoloadFailOnMissingFile = autoloadFailOnMissingFile
  }
  setDependencies (dependencies) {
    if (dependencies === undefined) {
      return
    }
    Object.assign(this.dependencies, dependencies)
    this.loadPaths(this.dependencies)
    this.registerDirectories(this.dependencies)
    this.registerRequireMap(this.requires)
  }

  setPromiseFactory (promiseFactory = Promise) {
    this.PromiseFactory = promiseFactory
  }
  setPromiseInterfaces (promiseInterfaces = [ Promise ]) {
    if (!promiseInterfaces.includes(this.PromiseFactory)) {
      promiseInterfaces.unshift(this.PromiseFactory)
    }
    this.PromiseInterface = promiseInterface(promiseInterfaces)
  }

  setPolyfillRequireContext (polyfill = true) {}
  
  setLazyRequire (enable = false) {}

  setRulesDefault (rulesDefault = {}) {
    Object.assign(this.rulesDefault, rulesDefault)
  }

  setAutoloadExtensions (autoloadExtensions = ['js']) {
    this.autoloadExtensions = autoloadExtensions
    if (this.autoloadExtensions instanceof Array) {
      this.loadExtensionRegex = new RegExp('.(' + this.autoloadExtensions.join('|') + ')$')
    } else {
      this.loadExtensionRegex = this.autoloadExtensions
    }
  }

  setAutoloadPathResolver (autoloadPathResolver = (path) => path) {
    if (typeof autoloadPathResolver === 'object') {
      const aliasMap = autoloadPathResolver
      autoloadPathResolver = (path) => {
        Object.keys(aliasMap).forEach(alias => {
          const realPath = PATH.normalize(aliasMap[alias])
          if (path === alias) {
            path = realPath
          } else {
            const dir = path.substr(0, alias.length + 1)
            if (dir === alias + '/' || (SEP_BACK && dir === alias + SEP)) {
              path = PATH.join(realPath, path.substr(alias.length))
            }
          }
        })
        return path
      }
    }

    this.autoloadPathResolver = autoloadPathResolver
  }

  setGlobalKey (globalKey = false) {
    if (!globalKey) {
      return
    }
    if (globalKey === true) {
      globalKey = 'di'
    }
    global[globalKey] = makeContainerApi(this)
  }

  loadPaths (dirs) {
    Object.keys(dirs).forEach(dirKey => {
      const context = dirs[dirKey]

      if (context instanceof Dependency) {
        this.setRequire(dirKey, context.getDependency())
        return
      }

      context
        .keys()
        .sort((a, b) => {
          if (a.substr(a.lastIndexOf('/')) === 'index') {
            return true
          }
          if (b.substr(b.lastIndexOf('/')) === 'index') {
            return false
          }
          return a > b
        })
        .forEach((filename) => {
          let key = filename.replace(/\\/g, '/')
          if (key.substr(0, 2) === './') {
            key = key.substr(2)
          }

          key = dirKey + '/' + key.substr(0, key.lastIndexOf('.') || key.length)
          const ctxFilename = context(filename)

          this.setRequire(key, ctxFilename)

          const pathFragments = key.split('/')
          const lastPathFragment = pathFragments.pop()
          if (lastPathFragment === 'index' || lastPathFragment === pathFragments.pop()) {
            this.setRequire(key.substr(0, key.lastIndexOf('/')), ctxFilename)
          }
        })
    })
  }

  registerDirectories (dependencies) {
    const directoryLoaders = this.directoryLoaders
    Object.keys(dependencies).forEach(dirKey => {
      const context = dependencies[dirKey]

      if (context instanceof Dependency) {
        return
      }

      directoryLoaders[dirKey] = (options, diParams = []) => {
        const {
          params = [],
          sharedAsync = undefined,
          curry = false,
          ignore = [],
          getter = (key, params) => {
            if (ignore.includes(key)) {
              return () => {}
            }
            return () => this.get(dirKey + '/' + key, params)
          }
        } = options

        const deps = [...params, ...diParams]

        const makeGetterMap = () => {
          let makeGetter
          if (curry) {
            makeGetter = name => (...merge) => {
              merge.forEach((mergeParam, i) => {
                if (typeof mergeParam === 'object' && mergeParam !== null) {
                  if (deps[i] === undefined) {
                    deps[i] = {}
                  }
                  Object.keys(mergeParam).forEach(key => {
                    deps[i][key] = this.value(mergeParam[key])
                  })
                }
              })
              return getter(name, deps)
            }
          } else {
            makeGetter = name => getter(name, deps)
          }

          const getterMap = {}
          context
            .keys()
            .sort((a, b) => {
              if (a.substr(a.lastIndexOf('/')) === 'index') {
                return true
              }
              if (b.substr(b.lastIndexOf('/')) === 'index') {
                return false
              }
              return a > b
            })
            .forEach((filename) => {
              let key = filename.replace(/\\/g, '/')
              if (key.substr(0, 2) === './') {
                key = key.substr(2)
              }

              // key = dirKey + '/' + key.substr(0, key.lastIndexOf('.') || key.length)
              key = key.substr(0, key.lastIndexOf('.') || key.length)

              getterMap[key] = makeGetter(key)

              const pathFragments = key.split('/')
              const lastPathFragment = pathFragments.pop()
              if (lastPathFragment === 'index' || lastPathFragment === pathFragments.pop()) {
                const key2 = key.substr(0, key.lastIndexOf('/'))
                getterMap[key2] = makeGetter(key2)
              }
            })

          return getterMap
        }

        if (sharedAsync) {
          const depPromises = []
          sharedAsync.forEach((asyncDeps, i) => {
            Object.keys(asyncDeps).forEach(k => {
              depPromises.push(
                Promise.resolve(this.get(asyncDeps[k])).then(resolved => {
                  if (!deps[i]) {
                    deps[i] = {}
                  }
                  deps[i][k] = this.value(resolved)
                })
              )
            })
          })
          return Promise.all(depPromises).then(() => {
            return makeGetterMap()
          })
        } else {
          return makeGetterMap()
        }
      }
    })
  }

  addRules (rules = {}) {
    if (typeof rules === 'function') {
      rules = rules(this)
    }
    Reflect.ownKeys(rules).forEach(interfaceName => this.addRule(interfaceName, rules[interfaceName], false))
    this.rulesDetectLazyLoad()
  }
  addRule (interfaceName, rule, detectLazyLoad = true) {
    if (typeof rule === 'function') {
      rule = rule(this)
    }

    if (this.rules[interfaceName] === undefined) {
      this.rules[interfaceName] = {}
    }

    this.rules[interfaceName] = this.mergeRule(this.rules[interfaceName], rule)
    this.processRule(interfaceName)

    rule = this.rules[interfaceName]

    let { classDef } = rule
    if (classDef) {
      if (classDef instanceof ClassDef) {
        classDef = classDef.getClassDef()
      }
      this.registerRequire(interfaceName, classDef)
    }

    if (detectLazyLoad) {
      this.rulesDetectLazyLoad()
    }
  }

  setDefaultVar (value) {
    this._setDefaultVar(value, 'defaultVar')
  }
  setDefaultRuleVar (value) {
    this._setDefaultVar(value, 'defaultRuleVar')
  }
  setDefaultDecoratorVar (value) {
    this._setDefaultVar(value, 'defaultDecoratorVar')
  }
  setDefaultArgsVar (value) {
    this._setDefaultVar(value, 'defaultArgsVar')
  }

  _setDefaultVar (value, property) {
    if (value === undefined) {
      value = this.defaultVar || 'interface'
    }
    if (!allowedDefaultVars.includes(value)) {
      throw new Error('invalid type "' + value + '" specified for ' + property + ', possibles values: ' + allowedDefaultVars.join(' | '))
    }
    this[property] = value
  }

  rulesDetectLazyLoad () {
    Object.keys(this.rules).forEach(key => {
      this.ruleLazyLoad(key)
    })
  }

  ruleLazyLoad (key, stack = []) {
    const calls = []
    const lazyCalls = []

    const rule = this.rules[key]

    if (!rule.calls) {
      return
    }

    rule.calls.forEach(callVal => {
      if (typeof callVal === 'function') {
        callVal = [callVal]
      }
      const [, params = []] = callVal
      if (this.ruleCheckCyclicLoad(params, [ key ])) {
        lazyCalls.push(callVal)
      } else {
        calls.push(callVal)
      }
    })

    rule.calls = calls
    rule.lazyCalls = (rule.lazyCalls || []).concat(lazyCalls)
  }
  ruleCheckCyclicLoad (params, stack = []) {
    return Object.keys(params).some(k => {
      const param = params[k]
      const v = this.wrapVarType(param, this.defaultRuleVar)
      if (v instanceof Interface) {
        const interfaceName = v.getName()

        if (!this.resolveInstanceOf(interfaceName, [], false)) {
          // not found, unable to check now
          return false
        }

        const paramRule = this.buildRule(interfaceName)

        if (stack.includes(interfaceName)) {
          return true
        }

        stack.push(interfaceName)

        let cyclic

        if (paramRule.params) {
          cyclic = this.ruleCheckCyclicLoad(paramRule.params, stack)
        }

        if (!cyclic) {
          cyclic = paramRule.calls.some(callV => {
            const [ , params = [] ] = callV
            return this.ruleCheckCyclicLoad(params, stack)
          })
        }

        return cyclic
      }
      if (typeof v === 'object' && v !== null && !(v instanceof Var)) {
        return this.ruleCheckCyclicLoad(v, stack)
      }
    })
  }

  processRule (key, stack = []) {
    if (this.rules[key] === undefined) {
      this.rules[key] = {}
    }
    const rule = this.mergeRule(this.mergeRule({}, this.rulesDefault), this.rules[key])
    if (rule.instanceOf) {
      if (stack.includes(key)) {
        throw new Error('Cyclic interface definition error in ' + JSON.stringify(stack.concat(key), null, 2))
      }
      stack.push(key)
      this.processRule(rule.instanceOf, stack)
    }
    if (rule.directory) {
      const {
        path,
        ...options
      } = rule.directory
      this.rules[key].classDef = this.directoryLoader(path, options)
    }
    if (rule.singleton) {
      this.rules[key].classDef = function () {
        return rule.singleton
      }
    }
    if (typeof rule.classDef === 'string') {
      const classDefName = rule.classDef
      this.rules[key].classDef = (...args) => {
        const ClassDefinition = this.get(classDefName)
        return new ClassDefinition(...args)
      }
    }
    if ((rule.autoload && !rule.classDef) || rule.path) {
      let path = rule.path
      if (!path) {
        if (rule.instanceOf) {
          if (this.rules[rule.instanceOf]) {
            return
          }
          path = rule.instanceOf
        } else if (this.validateAutoloadFileName(key)) {
          path = key
        } else {
          return
        }
      }
      if(this.lazyRequire){
        this.rules[key].classDef = new LazyRequire(this, key, path, rule.path)
      }
      else{
        const req = this.requireDep(key, path, rule.path)
        if (req) {
          this.registerRequire(key, req)
        }
      }
    }
  }

  validateAutoloadFileName (name) {
    if (typeof name === 'string' && name.substr(0, 1) === '#') {
      return false
    }
    return true
  }

  requireDep (key, requirePath, rulePath) {
    const cached = this.getRequire(key)
    if (cached) {
      return cached
    }

    requirePath = this.autoloadPathResolver(requirePath)
    if (typeof requirePath === 'symbol') return

    let required
    const found = this.autoloadExtensions.concat('').some(ext => {
      let prefix = ''
      const pathFragments = requirePath.split(':')
      if (isWin32AbsolutePath(requirePath)) {
        prefix = pathFragments.shift() + ':'
      }

      let path = prefix + pathFragments.shift()
      if (ext) {
        path += '.' + ext
      }

      if (this.depExists(path)) {
        required = this.depRequire(path)

        if (pathFragments.length) {
          pathFragments.forEach(subKey => {
            if (typeof required !== 'undefined' && required !== null) {
              required = required[subKey]
            }
          })
        }

        this.setRequire(key, required)

        return true
      }
    })
    if (!found && ((this.autoloadFailOnMissingFile === 'path' && rulePath) || this.autoloadFailOnMissingFile === true)) {
      throw new Error('Missing expected dependency injection file "' + requirePath + '" for rule key "' + key + '"')
    }

    return required
  }

  setRequire (key, required) {
    key = PATH.normalize(key)
    this.requires[key] = required
  }
  getRequire (key) {
    key = PATH.normalize(key)
    return this.requires[key]
  }

  registerRequireMap (requires) {
    Object.keys(requires).forEach((name) => {
      this.registerRequire(name, requires[name])
    })
  }
  registerRequire (name, r) {
    if (typeof name === 'string') {
      name = name.replace(/\\/g, '/')
    }
    if (typeof r === 'object' && typeof r.default === 'function') {
      r = r.default
    }
    if (typeof r !== 'function') {
      return
    }
    const rule = this.getRuleBase(name)
    if (rule.decorator && r[this.symClassName]) {
      r = class extends r {}
    }

    if (rule.decorator) {
      this.decorator(name)(r)
    } else {
      this.registerClass(name, r)
    }
    
    return r
  }

  wrap (types = [], wrap = true, interfaceName) {
    return (target, method) => {
      target[method] = this.decoratorMethod(target, method, types, wrap)
      return target
    }
  }
  decorator (...args) {
    return (target, method) => {
      if (method === undefined) {
        const [ className, types = [] ] = args
        this.decoratorClass(target, className, types)
      } else {
        const [ types = [], wrap = false ] = args
        target[method] = this.decoratorMethod(target, method, types, wrap)
      }
      return target
    }
  }
  decoratorClass (target, className, types) {
    this.defineSym(target, this.symClassName, className)

    this.registerClass(className, target)

    if (typeof types === 'function') {
      types = types()
    }
    types = types.map(type => this.wrapVarType(type, this.defaultDecoratorVar))

    if (target[this.symInterfaces]) {
      types = types.concat(target[this.symInterfaces])
    }
    this.defineSym(target, this.symInterfaces, types)

    return target
  }
  decoratorMethod (target, method, types, wrap, interfaceName) {
    if (typeof types === 'function') {
      types = types()
    }
    types = types.map(type => this.wrapVarType(type, this.defaultDecoratorVar))

    const fn = target[method]

    if (wrap) {
      const self = this
      return function () {
        const rule = self.getRuleBase(interfaceName || target[self.symClassName])
        const params = types.map(param => self.getParam(param, rule, {}, self.defaultRuleVar))
        const resolvedParams = structuredResolveParamsInterface(types, params)
        return Reflect.apply(fn, this, resolvedParams)
      }
    } else {
      if (fn[this.symInterfaces]) {
        types = types.concat(fn[this.symInterfaces])
      }
      this.defineSym(fn, this.symInterfaces, types)

      return fn
    }
  }

  exists (name) {
    return Boolean(this.rules[name])
  }

  get (interfaceDef, args, sharedInstances = {}, stack = []) {
    return this.provider(interfaceDef)(args, sharedInstances, stack)
  }
  provider (interfaceName) {
    if (typeof interfaceName === 'function' && this.isInterfacePrototype(interfaceName)) {
      interfaceName = interfaceName.toString()
    }

    if (typeof interfaceName === 'function') {
      interfaceName = interfaceName[this.symClassName]
      if (!interfaceName) {
        throw new Error('Unregistred class ' + interfaceName.constructor.name)
      }
    }

    if (interfaceName instanceof Interface) {
      interfaceName = interfaceName.getName()
    }

    if (!this.providerRegistry[interfaceName]) {
      this.providerRegistry[interfaceName] = this.makeProvider(interfaceName)
    }
    return this.providerRegistry[interfaceName]
  }

  makeProvider (interfaceName) {
    const rule = this.getRule(interfaceName)
    let ClassDef = rule.resolvedInstanceOf
    return (args, sharedInstances, stack) => {
      // check for shared after params load
      if (this.instanceRegistry[interfaceName]) {
        return this.instanceRegistry[interfaceName]
      }

      sharedInstances = Object.assign({}, sharedInstances)
      rule.sharedInTree.forEach(shareInterface => {
        if (!sharedInstances[shareInterface]) {
          sharedInstances[shareInterface] = new SharedInstance(shareInterface, this)
        }
      })

      let params
      let defaultVar
      if (args) {
        params = args
        defaultVar = this.defaultArgsVar
      } else {
        params = rule.params || ClassDef[this.symInterfaces] || []
        defaultVar = this.defaultRuleVar
      }

      const resolvedParams = params.map((interfaceDef, index) => {
        return this.getParam(interfaceDef, rule, sharedInstances, defaultVar, index, stack)
      })

      // recheck for shared after params load
      if (this.instanceRegistry[interfaceName]) {
        return this.instanceRegistry[interfaceName]
      }

      const makeInstance = (resolvedParams) => {
        resolvedParams = structuredResolveParamsInterface(params, resolvedParams)
        
        if(ClassDef instanceof LazyRequire){
          ClassDef = ClassDef.require()
        }
        
        if (this.interfaceTypeCheck) {
          structuredInterfacePrototype(rule.params || ClassDef[this.symInterfaces] || [], resolvedParams)
        }

        const instance = new ClassDef(...resolvedParams)

        const finalizeInstanceCreation = () => {
          if (rule.shared) {
            this.registerInstance(interfaceName, instance)
          }

          const callsReturn = this.runCalls(rule.lazyCalls, instance, rule, sharedInstances)
          if (callsReturn instanceof this.PromiseInterface) {
            return callsReturn.then(() => instance)
          }

          return instance
        }

        const callsReturn = this.runCalls(rule.calls, instance, rule, sharedInstances)
        if (callsReturn instanceof this.PromiseInterface) {
          return callsReturn.then(() => finalizeInstanceCreation())
        }

        return finalizeInstanceCreation()
      }
      if (structuredHasPromise(params, resolvedParams, this.PromiseInterface)) {
        return structuredPromiseAllRecursive(params, resolvedParams, this.PromiseInterface, this.PromiseFactory).then(resolvedParams => {
          return makeInstance(resolvedParams)
        })
      }

      return makeInstance(resolvedParams)
    }
  }

  getSubstitutionParam (interfaceDef, rule, index) {
    const substitutions = this.wrapVarType(rule.substitutions, this.defaultRuleVar)

    if (typeof index !== 'undefined' && substitutions[index]) {
      interfaceDef = substitutions[index]
      interfaceDef = this.wrapVarType(interfaceDef, this.defaultRuleVar, true)
    }

    if (interfaceDef instanceof Interface) {
      const interfaceName = interfaceDef.getName()
      if (substitutions[interfaceName]) {
        interfaceDef = substitutions[interfaceName]
        interfaceDef = this.wrapVarType(interfaceDef, this.defaultRuleVar, true)
      }
    }
    return interfaceDef
  }
  getParam (interfaceDef, rule, sharedInstances = {}, defaultVar = 'interface', index = undefined, stack = []) {
    interfaceDef = this.wrapVarType(interfaceDef, defaultVar)

    interfaceDef = this.getSubstitutionParam(interfaceDef, rule, index)

    if (interfaceDef instanceof Factory) {
      return interfaceDef.callback(sharedInstances)
    }
    if (interfaceDef instanceof Value) {
      return interfaceDef.getValue()
    }
    if (interfaceDef instanceof Require) {
      return interfaceDef.require()
    }
    if (interfaceDef instanceof Interface) {
      const interfaceName = interfaceDef.getName()

      stack = stack.slice(0)
      if (stack.includes(interfaceName)) {
        throw new Error('Cyclic dependency error in ' + JSON.stringify(stack.concat(interfaceName), null, 2))
      }
      stack.push(interfaceName)

      let instance

      if (sharedInstances[interfaceName]) {
        instance = sharedInstances[interfaceName].get(sharedInstances, stack)
      } else {
        instance = this.get(interfaceName, undefined, sharedInstances, stack)
      }

      const instanceRule = this.getRule(interfaceName)

      // if(!instanceRule.asyncResolve && instance instanceof this.PromiseInterface){
      if (!instanceRule.asyncResolve) {
        return new Sync(instance)
      }

      return instance
    }

    if (typeof interfaceDef === 'object' && !(interfaceDef instanceof Var)) {
      if (interfaceDef instanceof Array) {
        return interfaceDef.map(interfaceDefVal => {
          return this.getParam(interfaceDefVal, rule, sharedInstances, defaultVar, undefined, stack)
        })
      } else {
        const o = {}
        Object.keys(interfaceDef).forEach(k => {
          o[k] = this.getParam(interfaceDef[k], rule, sharedInstances, defaultVar, undefined, stack)
        })
        return o
      }
    }

    return interfaceDef
  }

  wrapVarType (type, defaultVar, resolveFunction) {
    if (resolveFunction && typeof type === 'function') {
      type = type()
    }
    if (type instanceof Var) {
      return type
    }
    if (this.isInterfacePrototype(type)) {
      return this.interfaceClass(type.toString(), type)
    }
    switch (defaultVar) {
      case 'interface':
        if (typeof type === 'object' && type !== null) {
          if (type instanceof Array) {
            return type.map(v => {
              return typeof v === 'object' && v !== null && !(v instanceof Var) ? this.wrapVarType(v, defaultVar) : v
            })
          } else {
            const o = {}
            Object.keys(type).forEach(key => {
              const v = type[key]
              o[key] = typeof v === 'object' && v !== null && !(v instanceof Var) ? this.wrapVarType(v, defaultVar) : v
            })
            return o
          }
        }
        if (typeof type === 'function') {
          return new this.DefaultFunctionWrapper(type)
        }
        return this.interface(type)
      case 'value':
        return this.value(type)
    }
    return type
  }

  isInterfacePrototype (type) {
    return this.interfacePrototype !== undefined && type.prototype instanceof this.interfacePrototype
  }

  registerInstance (name, instance) {
    this.instanceRegistry[name] = instance
  }

  getRuleBase (interfaceName) {
    const ruleBase = this.mergeRule({}, this.rulesDefault)
    ruleBase.interfaceName = interfaceName // for info
    if (interfaceName) {
      this.mergeRule(ruleBase, this.rules[interfaceName] || {})
    }
    return ruleBase
  }

  getRule (interfaceName) {
    if (this.ruleCache && this.rulesCache[interfaceName]) {
      return this.rulesCache[interfaceName]
    }
    const rule = this.buildRule(interfaceName)
    if (this.ruleCache) {
      this.rulesCache[interfaceName] = rule
    }
    return rule
  }

  buildRule (interfaceName) {
    const rule = this.mergeRule({}, this.rulesDefault)
    rule.interfaceName = interfaceName // for info
    if (!interfaceName) {
      return rule
    }

    const ruleBase = this.getRuleBase(interfaceName)

    let stack = []

    const resolvedInstanceOf = this.resolveInstanceOf(interfaceName, stack)

    let fullStack

    if (ruleBase.inheritInstanceOf) {
      fullStack = new Set(stack.slice(0, -1))
    } else {
      fullStack = new Set(stack.slice(0, 1))
    }

    if (ruleBase.inheritPrototype) {
      stack.reverse().forEach((c) => {
        if (typeof c === 'function') {
          let parentProto = c
          let className
          while (parentProto) {
            className = parentProto[this.symClassName]
            if (className) {
              fullStack.add(className)
            }
            parentProto = Reflect.getPrototypeOf(parentProto)
          }
        }
      })
    }
    fullStack = Array.from(fullStack).reverse()
    fullStack.forEach((className) => {
      const mergeRule = this.rules[className]
      if (mergeRule.inheritMixins) {
        this.mixinsRule(rule, mergeRule.inheritMixins)
      }

      this.mergeRule(rule, mergeRule)
    })

    rule.resolvedInstanceOf = resolvedInstanceOf

    return rule
  }

  mixinsRule (rule, mixinsGroup) {
    const mixinsGroups = this.ruleCollectExtendsRecursive(mixinsGroup).reverse()
    mixinsGroups.forEach(mixinGroup =>
      mixinGroup.forEach(mixin => {
        const mergeRule = this.rules[mixin]
        this.mergeRule(rule, mergeRule, false)
      })
    )
  }
  ruleCollectExtendsRecursive (mixinGroup, mixinsGroups = []) {
    if (!(mixinGroup instanceof Array)) {
      mixinGroup = [mixinGroup]
    }
    mixinsGroups.push(mixinGroup)
    mixinGroup.forEach(mixin => {
      const rule = this.rules[mixin]
      if (rule && rule.mixins) {
        this.ruleCollectExtendsRecursive(rule.mixins, mixinsGroups)
      }
    })
    return mixinsGroups
  }

  registerClass (name, target) {
    if (!this.rules[name]) {
      this.rules[name] = {}
    }
    this.rules[name].classDef = target
  }

  mergeRule (extendRule, rule, mergeExtend = true) {
    let {
      shared,
      inheritInstanceOf,
      inheritPrototype,
      inheritMixins,
      instanceOf,
      params,
      calls,
      lazyCalls,
      substitutions,
      sharedInTree,
      classDef,
      singleton,
      directory,
      asyncResolve,
      asyncCallsSerie,
      asyncCallsParamsSerie,
      decorator,
      autoload,
      path
    } = rule
    if (classDef !== undefined) {
      extendRule.classDef = classDef
    }
    if (directory !== undefined) {
      extendRule.directory = directory
    }
    if (shared !== undefined) {
      extendRule.shared = shared
    }
    if (inheritInstanceOf !== undefined) {
      extendRule.inheritInstanceOf = inheritInstanceOf
    }
    if (inheritPrototype !== undefined) {
      extendRule.inheritPrototype = inheritPrototype
    }
    if (decorator !== undefined) {
      extendRule.decorator = decorator
    }
    if (autoload !== undefined) {
      extendRule.autoload = autoload
    }
    if (path !== undefined) {
      extendRule.path = path
    }
    if (instanceOf !== undefined) {
      extendRule.instanceOf = instanceOf
    }
    if (asyncResolve !== undefined) {
      extendRule.asyncResolve = asyncResolve
    }
    if (asyncCallsSerie !== undefined) {
      extendRule.asyncCallsSerie = asyncCallsSerie
    }
    if (asyncCallsParamsSerie !== undefined) {
      extendRule.asyncCallsParamsSerie = asyncCallsParamsSerie
    }

    if (calls !== undefined) {
      extendRule.calls = (extendRule.calls || []).concat(calls)
    }
    if (lazyCalls !== undefined) {
      extendRule.lazyCalls = (extendRule.lazyCalls || []).concat(lazyCalls)
    }

    if (mergeExtend && inheritMixins !== undefined) {
      extendRule.inheritMixins = inheritMixins.slice(0)
    }

    if (params !== undefined) {
      extendRule.params = params
    }
    if (substitutions !== undefined) {
      if (!extendRule.substitutions) {
        extendRule.substitutions = {}
      }
      Object.assign(extendRule.substitutions, substitutions)
    }
    if (sharedInTree !== undefined) {
      if (!extendRule.sharedInTree) {
        extendRule.sharedInTree = []
      }
      extendRule.sharedInTree = Array.from(new Set([...extendRule.sharedInTree, ...sharedInTree]))
    }
    extendRule.singleton = singleton
    return extendRule
  }

  mergeRules (extendRules, rules) {
    Object.keys(rules).forEach((k) => {
      if (!extendRules[k]) {
        extendRules[k] = {}
      }
      extendRules[k] = this.mergeRule(extendRules[k], rules[k])
    })
    return extendRules
  }

  runCalls (calls, instance, rule, sharedInstances) {
    let hasAsync

    let callers = calls.map((c) => () => {
      if (typeof c === 'function') {
        c = [c]
      }

      let [
        method,
        params,
        asyncResolve = rule.asyncResolve
      ] = c

      if (params === undefined) {
        if (typeof method !== 'function') {
          params = instance[method][this.symInterfaces]
        }
        if (params === undefined) {
          params = []
        }
      }

      const makeCall = (resolvedParams) => {
        resolvedParams = structuredResolveParamsInterface(params, resolvedParams)
        let callReturn
        if (typeof method === 'function') {
          callReturn = method(instance, ...resolvedParams)
        } else {
          callReturn = instance[method](...resolvedParams)
        }
        if (!asyncResolve) {
          callReturn = new Sync(callReturn)
        }
        return callReturn
      }

      const resolvedParams = params.map(param => {
        return this.getParam(param, rule, sharedInstances, this.defaultRuleVar)
      })
      if (structuredHasPromise(params, resolvedParams, this.PromiseInterface)) {
        hasAsync = true
        return () => structuredPromiseAllRecursive(params, resolvedParams, this.PromiseInterface, this.PromiseFactory).then(resolvedParams => {
          return makeCall(resolvedParams)
        })
      } else {
        return () => makeCall(resolvedParams)
      }
    })

    const asyncCallsParamsSerie = rule.asyncCallsParamsSerie
    const asyncCallsSerie = rule.asyncCallsSerie || asyncCallsParamsSerie

    const makeCalls = (callers) => {
      let callersReturn
      if (hasAsync) {
        if (asyncCallsSerie) {
          callersReturn = mapSerie(callers, (caller) => {
            return caller()
          }, this.PromiseInterface, this.PromiseFactory)
        } else {
          callersReturn = this.PromiseFactory.all(callers.map((caller) => {
            return caller()
          }))
        }
      } else {
        callersReturn = callers.map((caller) => {
          const callerReturn = caller()
          if (callerReturn instanceof this.PromiseInterface) {
            hasAsync = true
          }
          return callerReturn
        })
        if (hasAsync) {
          callersReturn = this.PromiseFactory.all(callersReturn)
        }
      }
      return callersReturn
    }

    if (asyncCallsParamsSerie) {
      callers = mapSerie(callers, (caller) => {
        caller = caller()()
        return caller
      }, this.PromiseInterface, this.PromiseFactory)
      return callers.then(callers => makeCalls(callers.map(caller => () => caller)))
    } else {
      callers = callers.map((caller) => caller())
      return makeCalls(callers)
    }
  }

  defineSym (target, symname, value) {
    Reflect.defineProperty(target, symname, {
      value: value,
      enumerable: false,
      configurable: true
    })
  }

  resolveInstanceOf (str, stack = [], required = true) {
    if (typeof str === 'string' || typeof str === 'symbol') {
      if (stack.includes(str)) {
        throw new Error('Cyclic interface definition error in ' + JSON.stringify(stack.concat(str), null, 2))
      }
      stack.push(str)
      const rule = this.rules[str]
      let resolved = false
      if (rule) {
        if (rule.instanceOf) {
          resolved = rule.instanceOf
        } else if (rule.classDef) {
          resolved = rule.classDef
        }
      }
      if (!resolved) {
        if (!required) {
          return false
        }
        throw new Error('Interface definition ' + (typeof str === 'symbol' ? 'symbol' : '"' + str + '"') + ' not found, di load stack: ' + JSON.stringify(stack, null, 2))
      }
      return this.resolveInstanceOf(resolved, stack, required)
    }
    stack.push(str)
    return str
  }

  makeRegisterFactory (prefixPath, dependencies = [], asyncSharedDepsArray = undefined, curry = false, ignore = ['then']) {
    const di = this
    return function (...params) {
      const deps = [...dependencies, ...params]
      function makeProxy () {
        let make
        if (curry) {
          make = name => (...merge) => {
            merge.forEach((mergeParam, i) => {
              if (typeof mergeParam === 'object' && mergeParam !== null) {
                if (deps[i] === undefined) {
                  deps[i] = {}
                }
                Object.keys(mergeParam).forEach(key => {
                  deps[i][key] = di.value(mergeParam[key])
                })
              }
            })
            return di.get(prefixPath + name, deps)
          }
        } else {
          make = name => di.get(prefixPath + name, deps)
        }

        return new Proxy({}, {
          get (o, k) {
            if (ignore.includes(k)) {
              return
            }
            if (o[k] === undefined) {
              o[k] = make(k)
            }
            return o[k]
          }
        })
      }

      if (asyncSharedDepsArray) {
        const depPromises = []
        asyncSharedDepsArray.forEach((asyncSharedDeps, i) => {
          Object.keys(asyncSharedDeps).forEach(k => {
            depPromises.push(
              Promise.resolve(di.get(asyncSharedDeps[k])).then(resolved => {
                if (!deps[i]) {
                  deps[i] = {}
                }
                deps[i][k] = di.value(resolved)
              })
            )
          })
        })
        return Promise.all(depPromises).then(() => {
          return makeProxy()
        })
      } else {
        return makeProxy()
      }
    }
  }

  directoryLoader (dir, options) {
    return (...diParams) => {
      function getterMapToRegistry (getterMap) {
        const registry = {}
        Object.entries(getterMap).forEach(([key, getter]) => {
          Object.defineProperty(registry, key, {
            get: function () {
              return getter()
            }
          })
        })
        return registry
      }

      const loader = this.directoryLoaders[dir]
      if (!loader) {
        throw new Error('Directory not found "' + dir + '"')
      }
      const getterMap = loader(options, diParams)

      if (getterMap instanceof Promise) {
        return getterMap.then(getterMapResolved => {
          return getterMapToRegistry(getterMapResolved)
        })
      } else {
        return getterMapToRegistry(getterMap)
      }
    }
  }

  factory (callback) {
    return new this.DefaultFactory(callback)
  }
  valueFactory (callback) {
    return new ValueFactory(callback)
  }
  classFactory (callback) {
    return new ClassFactory(callback)
  }
  interface (name) {
    return new Interface(name)
  }
  interfaceClass (name, interfaceClass) {
    return new InterfaceClass(name, interfaceClass)
  }
  value (value) {
    return new Value(value)
  }
  require (dep) {
    return new Require(dep)
  }

  dependency (dep) {
    return new Dependency(dep)
  }

  classDef (callback) {
    return new ClassDef(callback)
  }
}
