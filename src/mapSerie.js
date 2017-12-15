const nativePromise = Promise;

export default function mapSerie(arr, callback, PromiseInterface = nativePromise, PromiseFactory = nativePromise){
	return arr.reduce(
		(promise, item) =>
			promise.then(result => {
				let promise = callback(item);
				if(!(promise instanceof PromiseInterface)){
					promise = PromiseFactory.resolve(promise);
				}
				return promise.then(Array.prototype.concat.bind(result))
			}),
		PromiseFactory.resolve([])
	);
}
