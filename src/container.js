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

let interfacePrototypeDefault;

export default class Container{
	
	static setInterfacePrototypeDefault(interfacePrototype){
		interfacePrototypeDefault = interfacePrototype;
	}
	static getInterfacePrototypeDefault(interfacePrototype){
		return interfacePrototypeDefault;
	}
	
	constructor({
		rules = {},
		
		rulesDefault = {},
		
		autoloadFailOnMissingFile = 'path',
		dependencies = {},
		autoloadExtensions = ['js'],
		autoloadPathResolver = (path)=>path,
		
		defaultVar = 'interface',
		defaultRuleVar = null,
		defaultDecoratorVar = null,
		defaultArgsVar = null,
		
		defaultFactory = ValueFactory,
		defaultFunctionWrapper = ClassFactory,
		
		globalKey = false,
		
		promiseFactory = Promise,
		promiseInterfaces = [ Promise ],
		
		interfacePrototype = undefined,
		interfaceTypeCheck = false,
		
	} = {}){
		
		this.symClassName = Symbol('className');
		this.symInterfaces = Symbol('types');
		this.providerRegistry = {};
		this.instanceRegistry = {};
		
		this.requires = {};
		this.autoloadExtensions = autoloadExtensions;
		this.autoloadFailOnMissingFile = autoloadFailOnMissingFile;
		this.dependencies = dependencies;
		this.setAutoloadPathResolver(autoloadPathResolver);
		this.loadExtensionRegex = new RegExp('\.('+this.autoloadExtensions.join('|')+')$');
		
		this.defaultRuleVar = defaultRuleVar || defaultVar;
		this.defaultDecoratorVar = defaultDecoratorVar || defaultVar;
		this.defaultArgsVar = defaultArgsVar || defaultVar;
		
		this.defaultFactory = defaultFactory;
		this.defaultFunctionWrapper = defaultFunctionWrapper;
		
		this.allowedDefaultVars = ['interface','value'];
		this.validateDefaultVar(defaultVar, 'defaultVar');
		this.validateDefaultVar(this.defaultRuleVar, 'defaultRuleVar');
		this.validateDefaultVar(this.defaultDecoratorVar, 'defaultDecoratorVar');
		this.validateDefaultVar(this.defaultArgsVar, 'defaultArgsVar');
		
		if(promiseInterfaces.indexOf(promiseFactory) === -1){
			promiseInterfaces.unshift(promiseFactory);
		}
		this.PromiseInterface = promiseInterface(promiseInterfaces);
		this.PromiseFactory = promiseFactory;
		
		this.interfacePrototype = interfacePrototype || interfacePrototypeDefault;
		
		if(globalKey){
			this.setGlobalKey(globalKey);
		}
		
		this.rulesDefault = {
			
			inheritInstanceOf: true,
			inheritPrototype: false,
			inheritMixins: [],
			
			shared: false,
			instanceOf: undefined,
			classDef: undefined,
			params: undefined,
			
			calls: [],
			lazyCalls: [],
			
			substitutions: [],
			sharedInTree: [],
			
			singleton: undefined,
			
			asyncResolve: false,
			asyncCallsSerie: false,
			
			decorator: false,
			
			autoload: false,
			path: undefined,
			
		};
		this.setRulesDefault(rulesDefault);
		this.rules = {};
		
		this.loadDependencies();
		this.addRules(rules);
		
	}
	
	config(key, value){
		if(typeof key === 'object'){
			Object.keys(key).forEach(k=>this.config(k, key[k]));
			return;
		}
		switch(key){
			case 'autoloadFailOnMissingFile ':
			case 'autoloadExtensions':
			case 'defaultVar':
			case 'defaultRuleVar':
			case 'defaultDecoratorVar':
			case 'defaultArgsVar':
			case 'interfacePrototype':
			case 'interfaceTypeCheck':
				this[key] = value;
			break;
			case 'globalkey':
				this.setGlobalKey(value);
			break;
			case 'autoloadPathResolver':
				this.setAutoloadPathResolver(value);
			break;
			case 'rulesDefault':
				this.setRulesDefault(value);
			break;
			break;
			default:
				throw new Error('Unexpected config key '+key);
			break;
		}
	}
	
	setRulesDefault(rulesDefault){
		this.rulesDefault = {
			...this.rulesDefault,
			...rulesDefault,
		};
	}
	
	setAutoloadPathResolver(autoloadPathResolver){
		
		if(typeof autoloadPathResolver == 'object'){
			
			const aliasMap = autoloadPathResolver;
			autoloadPathResolver = (path)=>{
				Object.keys(aliasMap).forEach(alias=>{
					const realPath = aliasMap[alias];
					if(path == alias){
						path = realPath;
					}
					else if(path.substr(0,alias.length+1)==alias+'/'){
						path = realPath+path.substr(alias.length);
					}
				});
				return path;
			};
		}
		
		this.autoloadPathResolver = autoloadPathResolver;
	}
	
	setGlobalKey(globalKey){
		if(globalKey===true){
			globalKey = 'di';
		}
		global[globalKey] = makeContainerApi(this);
	}
	
	loadPaths(dirs){
		Object.keys(dirs).forEach(dirKey=>{
			const context = dirs[dirKey];
			
			if(context instanceof Dependency){
				this.requires[dirKey] = context.getDependency();
				return;
			}
						
			context.keys().forEach((filename)=>{
				
				let key = filename;
				if(key.substr(0,2)=='./'){
					key = key.substr(2);
				}
				
				key = dirKey+'/'+key.substr(0, key.lastIndexOf('.') || key.length);
				if(key.split('/').pop()=='index'){
					key = key.substr(0, key.lastIndexOf('/'));
				}
				this.requires[key] = context(filename);
			});
		});
	}
	
	
	addRules(rules){
		if(typeof rules == 'function'){
			rules = rules(this);
		}
		Object.getOwnPropertyNames(rules).forEach(interfaceName => this.addRule(interfaceName, rules[interfaceName], false));
		Object.getOwnPropertySymbols(rules).forEach(interfaceName => this.addRule(interfaceName, rules[interfaceName], false));
		this.rulesDetectLazyLoad();
	}
	addRule(interfaceName, rule, detectLazyLoad = true){
		if(typeof rule == 'function'){
			rule = rule(this);
		}
		
		if(this.rules[interfaceName] === undefined){
			this.rules[interfaceName] = this.mergeRule({}, this.rulesDefault);
		}
		
		this.rules[interfaceName] = this.mergeRule(this.rules[interfaceName], rule);
		this.processRule(interfaceName);
		
		rule = this.rules[interfaceName];
		
		let { classDef } = rule;
		if(classDef){
			if(classDef instanceof ClassDef){
				classDef = classDef.getClassDef();
			}
			this.registerRequire(interfaceName, classDef);
		}
		
		if(detectLazyLoad){
			this.rulesDetectLazyLoad();
		}
		
	}
	
	validateDefaultVar(value, property){
		if(this.allowedDefaultVars.indexOf(value)===-1){
			throw new Error('invalid type "'+value+'" specified for '+property+', possibles values: '+this.allowedDefaultVars.join(' | '));
		}
	}
	
	loadDependencies(){
		this.loadPaths(this.dependencies);
		this.registerRequireMap(this.requires);
	}
	rulesDetectLazyLoad(){
		Object.keys(this.rules).forEach(key=>{
			this.ruleLazyLoad(key);
		});
	}
	
	ruleLazyLoad(key, stack=[]){
		const calls = [];
		const lazyCalls = [];
		
		const rule = this.rules[key];
		
		if(!rule.calls){
			return;
		}
		
		rule.calls.forEach(callVal => {
			if(typeof callVal == 'function'){
				callVal = [callVal];
			}
			const [method, params = []] = callVal;
			if( this.ruleCheckCyclicLoad(params, [ key ]) ){
				lazyCalls.push(callVal);
			}
			else{
				calls.push(callVal);
			}
		});
		
		rule.calls = calls;
		rule.lazyCalls = (rule.lazyCalls || []).concat(lazyCalls);
	}
	ruleCheckCyclicLoad(params, stack=[]){		
		return Object.keys(params).some(k=>{
			const param = params[k];
			const v = this.wrapVarType(param, this.defaultRuleVar);
			if(v instanceof Interface){
				const interfaceName = v.getName();
				
				if(!this.resolveInstanceOf(interfaceName, [], false)){
					//not found, unable to check now
					return false;
				}
				
				const paramRule = this.getRule(interfaceName);
				
				if(stack.indexOf(interfaceName)!==-1){
					return true;
				}
				
				stack.push(interfaceName);
								
				let cyclic;

				if(paramRule.params){
					cyclic = this.ruleCheckCyclicLoad(paramRule.params, stack);
				}

				if(!cyclic){
					cyclic = paramRule.calls.some(callV=>{
						const [method, params = [] ] = callV;
						return this.ruleCheckCyclicLoad(params, stack);
					});
				}
				
				return cyclic;
				
			}
			if(typeof v == 'object' && v !== null && !(v instanceof Var)){
				return this.ruleCheckCyclicLoad(v, stack);
			}
		});
	}
	
	processRule(key, stack = []){
		if(this.rules[key] === undefined){
			this.rules[key] = this.mergeRule({}, this.rulesDefault);
		}
		const rule = this.rules[key];
		if(rule.instanceOf){
			if(stack.indexOf(key)!==-1){
				throw new Error('Cyclic interface definition error in '+JSON.stringify(stack.concat(key),null,2));
			}
			stack.push(key);
			this.processRule(rule.instanceOf, stack);
		}
		if(rule.singleton){
			rule.classDef = function(){
				return rule.singleton;
			};
		}
		if(typeof rule.classDef == 'string'){
			const classDefName = rule.classDef;
			rule.classDef = (...args)=>{
				const classDefinition = this.get(classDefName);
				return new classDefinition(...args);
			};
		}
		if(this.validateAutoloadFileName(key)){
			if(rule.autoload){
				const path = rule.path || key;
				const req = this.requireDep(key, path);
				if(req){
					this.registerRequire(key, req);
				}
			}
		}
	}
	
	validateAutoloadFileName(name){
		if(typeof name == 'string' && name.substr(0,1)==='#'){
			return false;
		}
		return true;
	}
	
	requireDep(key, requirePath){
		if(this.requires[key]){
			return this.requires[key];
		}
		
		requirePath = this.autoloadPathResolver(requirePath);
		
		const found = this.autoloadExtensions.concat('').some( ext => {
			
			const pathFragments = requirePath.split(':');
			
			
			let path = pathFragments.shift();
			if(ext){
				path += '.'+ext;
			}
			
			
			if(this.depExists(path)){
				let required = this.depRequire(path);
								
				if(pathFragments.length){
					pathFragments.forEach( subKey => {
						if(typeof required !== 'undefined' && required !== null){
							required = required[subKey];
						}
					});
				}
				
				
				this.requires[key] = required;
				
				return true;
			}
			
		});
		if( ! found && ((this.autoloadFailOnMissingFile==='path' && requirePath) || this.autoloadFailOnMissingFile===true) ){
			throw new Error('Missing expected dependency injection file "'+requirePath+'"');
		}
		
		return this.requires[key];
	}
	
	
	registerRequireMap(requires){
		Object.keys(requires).forEach((name)=>{
			this.registerRequire(name,requires[name]);
		});
	}
	registerRequire(name,r){
		if(typeof r == 'object' && typeof r.default == 'function'){
			r = r.default;
		}
		if(typeof r !== 'function'){
			return;
		}
		const rule = this.getRuleBase(name);
		if(rule.decorator && r[this.symClassName]){
			r = class extends r{};
		}
		
		if(rule.decorator){
			this.decorator(name)(r);
		}
		else{
			this.registerClass(name, r);
		}
	}
	
	wrap(types = [], wrap = true, interfaceName){
		return (target, method)=>{
			target[method] = this.decoratorMethod(target, method, types, wrap);
			return target;
		};
	}
	decorator(...args){
		return (target, method)=>{
			if(method === undefined){
				const [ className, types = [] ] = args;
				this.decoratorClass(target, className, types);
			}
			else{
				const [ types = [], wrap = false, interfaceName ] = args;
				target[method] = this.decoratorMethod(target, method, types, wrap);
			}
			return target;
		};
	}
	decoratorClass(target, className, types){
		this.defineSym(target, this.symClassName, className);
		
		this.registerClass(className, target);
		
		if(typeof types == 'function'){
			types = types();
		}
		types = types.map(type => this.wrapVarType(type, this.defaultDecoratorVar));
		
		if (target[this.symInterfaces]) {
			types = types.concat(target[this.symInterfaces]);
		}
		this.defineSym(target, this.symInterfaces, types);
		
		return target;
	}
	decoratorMethod(target, method, types, wrap, interfaceName){
		if(typeof types == 'function'){
			types = types();
		}
		types = types.map(type => this.wrapVarType(type, this.defaultDecoratorVar));
		
		const fn = target[method];
		
		if(wrap){
			
			const self = this;
			return function(){
				const rule =  self.getRuleBase(interfaceName || target[self.symClassName]);
				const params = types.map( param => self.getParam(param, rule, {}, self.defaultRuleVar) );
				const resolvedParams = structuredResolveParamsInterface(types, params);
				return fn.apply(this, resolvedParams);
			};
			
		}
		else{
		
			if (fn[this.symInterfaces]) {
				types = types.concat(fn[this.symInterfaces]);
			}
			this.defineSym(fn, this.symInterfaces, types);
		
			return fn;
		}
	}
	
	exists(name){
		return Boolean(this.rules[name]);
	}
	
	get(interfaceDef, args, sharedInstances = {}, stack = []){
		return this.provider(interfaceDef)(args, sharedInstances, stack);
	}
	provider(interfaceName){
		
		if(typeof interfaceName == 'function'){
			interfaceName = interfaceName[this.symClassName];
			if(!interfaceName){
				throw new Error('Unregistred class '+interfaceName.constructor.name);
			}
		}
		
		if(interfaceName instanceof Interface){
			interfaceName = interfaceName.getName();
		}
		
		
		if(!this.providerRegistry[interfaceName]){
			this.providerRegistry[interfaceName] = this.makeProvider(interfaceName);
		}
		return this.providerRegistry[interfaceName];
	}
	
	makeProvider(interfaceName){
		const rule = this.getRule(interfaceName);
		const classDef = this.resolveInstanceOf(interfaceName);
		return (args, sharedInstances, stack)=>{
			
			//check for shared after params load
			if(this.instanceRegistry[interfaceName]){
				return this.instanceRegistry[interfaceName];
			}
			
			sharedInstances = Object.assign({}, sharedInstances);
			rule.sharedInTree.forEach(shareInterface => {
				if(!sharedInstances[shareInterface]){
					sharedInstances[shareInterface] = new SharedInstance(shareInterface, this);
				}
			});
			
			let params;
			let defaultVar;
			if(args){
				params = args;
				defaultVar = this.defaultArgsVar;
			}
			else{
				params = rule.params || classDef[this.symInterfaces] || [];
				defaultVar = this.defaultRuleVar;
			}
			
			const resolvedParams = params.map((interfaceDef, index)=>{
				return this.getParam(interfaceDef, rule, sharedInstances, defaultVar, index, stack);
			});
			
			//recheck for shared after params load
			if(this.instanceRegistry[interfaceName]){
				return this.instanceRegistry[interfaceName];
			}
			
			const makeInstance = (resolvedParams)=>{
				
				resolvedParams = structuredResolveParamsInterface(params, resolvedParams);
				
				if(this.interfaceTypeCheck){
					structuredInterfacePrototype(rule.params || classDef[this.symInterfaces] || [], resolvedParams);
				}
				
				
				const instance = new classDef(...resolvedParams);
				
				const finalizeInstanceCreation = ()=>{
					if(rule.shared){
						this.registerInstance(interfaceName, instance);
					}
					
					const callsReturn = this.runCalls(rule.lazyCalls, instance, rule, sharedInstances);
					if(callsReturn instanceof this.PromiseInterface){
						return callsReturn.then(()=>instance);
					}
					
					return instance;
				};
				
				const callsReturn = this.runCalls(rule.calls, instance, rule, sharedInstances);
				if(callsReturn instanceof this.PromiseInterface){
					return callsReturn.then(()=>finalizeInstanceCreation());
				}
				
				return finalizeInstanceCreation();
			};
			if(structuredHasPromise(params, resolvedParams, this.PromiseInterface)){
				return structuredPromiseAllRecursive(params, resolvedParams, this.PromiseInterface, this.PromiseFactory ).then(resolvedParams=>{
					return makeInstance(resolvedParams);
				});
			}
			
			return makeInstance(resolvedParams);
		};
	}
	
	getSubstitutionParam(interfaceDef, rule, index){
		const substitutions = this.wrapVarType(rule.substitutions, this.defaultRuleVar);
		
		if(typeof index !== 'undefined' && substitutions[index]){
			interfaceDef = substitutions[index];
			interfaceDef = this.wrapVarType(interfaceDef, this.defaultRuleVar, true);
		}
		
		if(interfaceDef instanceof Interface){
			const interfaceName = interfaceDef.getName();
			if(substitutions[interfaceName]){
				interfaceDef = substitutions[interfaceName];
				interfaceDef = this.wrapVarType(interfaceDef, this.defaultRuleVar, true);
			}
			
		}
		return interfaceDef;
	}
	getParam(interfaceDef, rule, sharedInstances = {}, defaultVar = 'interface', index = undefined, stack = []){
		
		interfaceDef = this.wrapVarType(interfaceDef, defaultVar);
		
		interfaceDef = this.getSubstitutionParam(interfaceDef, rule, index);
		
		if(interfaceDef instanceof Factory){
			return interfaceDef.callback(sharedInstances);
		}
		if(interfaceDef instanceof Value){
			return interfaceDef.getValue();
		}
		if(interfaceDef instanceof Require){
			return interfaceDef.require();
		}
		
		if(interfaceDef instanceof Interface){
			
			const interfaceName = interfaceDef.getName();
			
			
			stack = stack.slice(0);
			if(stack.indexOf(interfaceName)!==-1){
				throw new Error('Cyclic dependency error in '+JSON.stringify(stack.concat(interfaceName),null,2));
			}
			stack.push(interfaceName);
			
			let instance;
			
			if(sharedInstances[interfaceName]){
				instance = sharedInstances[interfaceName].get(sharedInstances, stack);
			}
			else{
				instance = this.get(interfaceName, undefined, sharedInstances, stack);
			}
			
			const instanceRule = this.getRule(interfaceName);
			
			//if(!instanceRule.asyncResolve && instance instanceof this.PromiseInterface){
			if(!instanceRule.asyncResolve){
				return new Sync(instance);
			}
			
			return instance;
		}
		
		if(typeof interfaceDef == 'object' && !(interfaceDef instanceof Var)){
			const o = {};
			Object.keys(interfaceDef).forEach(k => {
				o[k] = this.getParam(interfaceDef[k], rule, sharedInstances, defaultVar, undefined, stack);
			});
			return o;
		}
	
		return interfaceDef;
	}
	
	wrapVarType(type, defaultVar, resolveFunction){
		if(resolveFunction && typeof type == 'function'){
			type = type();
		}
		if(type instanceof Var){
			return type;
		}
		if(this.isInterfacePrototype(type)){
			return this.interfaceClass( type.toString(), type );
		}
		switch(defaultVar){
			case 'interface':
				if(typeof type == 'object' && type !== null){
					const o = {};
					Object.keys(type).forEach(key=>{
						const v = type[key];
						o[key] = typeof v == 'object' && v !== null && !(v instanceof Var) ? this.wrapVarType(v, defaultVar) : v;
					});
					return o;
				}
				if(typeof type == 'function'){
					return new this.defaultFunctionWrapper(type);
				}
				return this.interface(type);
			break;
			case 'value':
				return this.value(type);
			break;
		}
		return type;
	}
	
	isInterfacePrototype(type){
		return this.interfacePrototype !== undefined && type.prototype instanceof this.interfacePrototype;
	}
	
	registerInstance(name, instance){
		this.instanceRegistry[name] = instance;
	}
	
	getRuleBase(interfaceName){
		const ruleBase = this.mergeRule({}, this.rulesDefault);
		ruleBase.interfaceName = interfaceName; //for info
		if(interfaceName){
			this.mergeRule(ruleBase, this.rules[interfaceName] || {});
		}
		return ruleBase;
	}
	
	getRule(interfaceName){
		const rule = this.mergeRule({}, this.rulesDefault);
		rule.interfaceName = interfaceName; //for info
		if(!interfaceName){
			return rule;
		}
		
		const ruleBase = this.getRuleBase(interfaceName);
		
		let stack = [];
		
		this.resolveInstanceOf(interfaceName, stack);
		
		const rules = [];
		
		let fullStack;
		
		if(ruleBase.inheritInstanceOf){ 
			fullStack = new Set( stack.slice(0, -1) );
		}
		else{
			fullStack = new Set( stack.slice(0, 1) );
		}
		
		
		if(ruleBase.inheritPrototype){
			stack.reverse().forEach((c)=>{
				if(typeof c == 'function'){
					let parentProto = c;
					let className;
					while(parentProto){
						className = parentProto[this.symClassName];
						if(className){
							fullStack.add(className);
						}
						parentProto = Reflect.getPrototypeOf(parentProto);
					}
				}
			});
		}
		fullStack = Array.from(fullStack).reverse();
		
		fullStack.forEach((className)=>{
			const mergeRule = this.rules[className];
				
			if(mergeRule.inheritMixins){
				this.mixinsRule(rule, mergeRule.inheritMixins);
			}
			
			this.mergeRule(rule, mergeRule);
		});
		
		return rule;
	}
	
	mixinsRule(rule, mixinsGroup){
		const mixinsGroups = this.ruleCollectExtendsRecursive(mixinsGroup).reverse();
		mixinsGroups.forEach(mixinGroup =>
			mixinGroup.forEach( mixin => {
				const mergeRule = this.rules[mixin];
				this.mergeRule(rule, mergeRule, false)
			} )
		);
	}
	ruleCollectExtendsRecursive(mixinGroup, mixinsGroups = []){
		if(!(mixinGroup instanceof Array)){
			mixinGroup = [mixinGroup];
		}
		mixinsGroups.push(mixinGroup);
		mixinGroup.forEach(mixin => {
			const rule = this.rules[mixin];
			if(rule && rule.mixins){
				this.ruleCollectExtendsRecursive(rule.mixins, mixinsGroups);
			}
		});
		return mixinsGroups;
	}

	registerClass(name, target){
		if(!this.rules[name]){
			this.rules[name] = {};
		}
		this.rules[name].classDef = target;
	}
	
	mergeRule(extendRule, rule, mergeExtend = true){
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
			asyncResolve,
			asyncCallsSerie,
			asyncCallsParamsSerie,
			decorator,
			autoload,
			path,
		} = rule;
		if(classDef !== undefined){
			extendRule.classDef = classDef;
		}
		if(shared !== undefined){
			extendRule.shared = shared;
		}
		if(inheritInstanceOf !== undefined){
			extendRule.inheritInstanceOf = inheritInstanceOf;
		}
		if(inheritPrototype !== undefined){
			extendRule.inheritPrototype = inheritPrototype;
		}
		if(decorator !== undefined){
			extendRule.decorator = decorator;
		}
		if(autoload !== undefined){
			extendRule.autoload = autoload;
		}
		if(path !== undefined){
			extendRule.path = path;
		}
		if(instanceOf !== undefined){
			extendRule.instanceOf = instanceOf;
		}
		if(asyncResolve !== undefined){
			extendRule.asyncResolve = asyncResolve;
		}
		if(asyncCallsSerie !== undefined){
			extendRule.asyncCallsSerie = asyncCallsSerie;
		}
		if(asyncCallsParamsSerie !== undefined){
			extendRule.asyncCallsParamsSerie = asyncCallsParamsSerie;
		}

		if(calls !== undefined){
			extendRule.calls = ( extendRule.calls || [] ).concat(calls);
		}
		if(lazyCalls !== undefined){
			extendRule.lazyCalls = ( extendRule.lazyCalls || [] ).concat(lazyCalls);
		}
		
		if(mergeExtend && inheritMixins !== undefined){
			extendRule.inheritMixins = inheritMixins.slice(0);
		}
		
		if(params !== undefined){
			extendRule.params = params;
		}
		if(substitutions !== undefined){
			if(!extendRule.substitutions){
				extendRule.substitutions = {};
			}
			Object.assign(extendRule.substitutions, substitutions);
		}
		if(sharedInTree !== undefined){
			if(!extendRule.sharedInTree){
				extendRule.sharedInTree = [];
			}
			extendRule.sharedInTree = Array.from( new Set([...extendRule.sharedInTree, ...sharedInTree]) );
		}
		extendRule.singleton = singleton;
		return extendRule;
	}
	
	mergeRules(extendRules, rules){
		Object.keys(rules).forEach((k)=>{
			if(!extendRules[k]){
				extendRules[k] = {};
			}
			extendRules[k] = this.mergeRule(extendRules[k], rules[k]);
		});
		return extendRules;
	}
	
	runCalls(calls, instance, rule, sharedInstances){
		let hasAsync;
		
		let callers = calls.map((c)=> ()=> {
			
			if(typeof c == 'function'){
				c = [c];
			}
			
			const [
				method,
				params = instance[method][this.symInterfaces] || [],
				asyncResolve = rule.asyncResolve 
			] = c;
			
			const makeCall = (resolvedParams)=>{				
				resolvedParams = structuredResolveParamsInterface(params, resolvedParams);
				let callReturn;
				if(typeof method == 'function'){
					callReturn = method(instance, ...resolvedParams);
				}
				else{
					callReturn = instance[method](...resolvedParams);
				}
				if(!asyncResolve){
					callReturn = new Sync(callReturn);
				}
				return callReturn;
			};
						
			const resolvedParams = params.map(param => {
				return this.getParam(param, rule, sharedInstances, this.defaultRuleVar);
			});
			if(structuredHasPromise(params, resolvedParams, this.PromiseInterface)){
				hasAsync = true;
				return () => structuredPromiseAllRecursive(params, resolvedParams, this.PromiseInterface, this.PromiseFactory).then(resolvedParams=>{
					return makeCall(resolvedParams);
				});
			}
			else{
				return () => makeCall(resolvedParams);
			}
			
		});
		
		const asyncCallsParamsSerie = rule.asyncCallsParamsSerie;
		const asyncCallsSerie = rule.asyncCallsSerie || asyncCallsParamsSerie;
		
		const makeCalls = (callers)=>{
			
			let callersReturn;
			if(hasAsync){
				if(asyncCallsSerie){
					callersReturn = mapSerie(callers, (caller)=>{
						return caller();
					}, this.PromiseInterface, this.PromiseFactory);
				}
				else{
					callersReturn = this.PromiseFactory.all( callers.map((caller)=>{
						return caller();
					}) );
				}
			}
			else{
				callersReturn = callers.map((caller)=>{
					const callerReturn = caller();
					if(callerReturn instanceof this.PromiseInterface){
						hasAsync = true;
					}
					return callerReturn;
				});
				if(hasAsync){
					callersReturn = this.PromiseFactory.all(callersReturn);
				}
			}
			return callersReturn;
		}
		
		if(asyncCallsParamsSerie){
			callers = mapSerie(callers, (caller)=>{
				caller = caller()();
				return caller;
			}, this.PromiseInterface, this.PromiseFactory);
			return callers.then( callers => makeCalls( callers.map(caller => () => caller ) ) ) ;
		}
		else{
			callers = callers.map((caller)=>caller());
			return makeCalls(callers);
		}
		
	}
		
	defineSym(target, symname, value){
		Object.defineProperty(target, symname, {
			value: value,
			enumerable: false,
			configurable: true,
		});
	}
	
	resolveInstanceOf(str, stack = [], required = true){
		if(typeof str == 'string' || typeof str == 'symbol'){
			if(stack.indexOf(str)!==-1){
				throw new Error('Cyclic interface definition error in '+JSON.stringify(stack.concat(str),null,2));
			}
			stack.push(str);
			const rule = this.rules[str];
			let resolved = false;
			if(rule){
				if(rule.instanceOf){
					resolved = rule.instanceOf;
				}
				else if(rule.classDef){
					resolved = rule.classDef;
				}
			}
			if(!resolved){
				if(!required){
					return false;
				}
				throw new Error('Interface definition '+(typeof str == 'symbol' ? 'symbol' : '"'+str+'"' )+' not found, di load stack: '+JSON.stringify(stack, null, 2));
			}
			return this.resolveInstanceOf(resolved, stack, required);
		}
		stack.push(str);
		return str;
	}
	
	factory(callback){
		return new this.defaultFactory(callback);
	}
	valueFactory(callback){
		return new ValueFactory(callback);
	}
	classFactory(callback){
		return new ClassFactory(callback);
	}
	interface(name){
		return new Interface(name);
	}
	interfaceClass(name,interfaceClass){
		return new InterfaceClass(name, interfaceClass);
	}
	value(value){
		return new Value(value);
	}
	require(dep){
		return new Require(dep);
	}
	
	dependency(dep){
		return new Dependency(dep);
	}
	
	classDef(callback){
		return new ClassDef(callback);
	}
}
