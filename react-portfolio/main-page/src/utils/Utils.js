 var _shallowEqual = function(objA: mixed, objB: mixed): boolean {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
};

var _shallowCompare = function (instance, nextProps, nextState) {
  return (
    !_shallowEqual(instance.props, nextProps) ||
    !_shallowEqual(instance.state, nextState)
  );
};

var _isArrayEmpty = function(value){
  if(!Array.isArray(value)){
    return true;
  }
  return value.length > 0 ? false : true;
};

export default {
  shallowEqual: _shallowEqual,
  shallowCompare: _shallowCompare,
  isArrayEmpty: _isArrayEmpty,
}
