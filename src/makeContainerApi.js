export default function makeContainerApi(container){
	const di = (...args)=>{
		return container.decorator(...args);
	};
	di.container = container;
	di.get = container.get.bind(container);
	di.exists = container.exists.bind(container);
	di.factory = container.factory.bind(container);
	di.classFactory = container.classFactory.bind(container);
	di.valueFactory = container.valueFactory.bind(container);
	di.value = container.value.bind(container);
	di.interface = container.interface.bind(container);
	di.require = container.require.bind(container);
	di.addRule = container.addRule.bind(container);
	di.addRules = container.addRules.bind(container);
	di.config = container.config.bind(container);
	di.wrap = container.wrap.bind(container);
	return di;
}
