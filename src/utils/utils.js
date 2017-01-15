module.exports = {
	getLocalStorage(item) {
		return localStorage.getItem(item);
	},
	extend(_to,_from) {
		for(var key in _from) {
			_to[key] = _from[key];
		}
		return _to;
 	},
    sortByKey(array, key) {
        return array.sort(function(a, b) {
            let x = a[key];
            let y = b[key];
            return (x < y) ? -1 : ((x > y) ? 1 : 0 );
        })
    }
}
