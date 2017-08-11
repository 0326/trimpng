(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":3}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":4}],3:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":55,"../modules/es6.string.iterator":58,"../modules/web.dom.iterable":59}],4:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":11,"../../modules/es6.object.assign":57}],5:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":25}],8:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":46,"./_to-iobject":48,"./_to-length":49}],9:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":10,"./_wks":53}],10:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],11:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],12:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":5}],13:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],14:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":18}],15:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":19,"./_is-object":25}],16:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],17:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":11,"./_ctx":12,"./_global":19,"./_hide":21}],18:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],19:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],20:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],21:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":14,"./_object-dp":33,"./_property-desc":40}],22:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":19}],23:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],24:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":10}],25:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],26:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":21,"./_object-create":32,"./_property-desc":40,"./_set-to-string-tag":42,"./_wks":53}],27:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":17,"./_has":20,"./_hide":21,"./_iter-create":26,"./_iterators":29,"./_library":30,"./_object-gpo":36,"./_redefine":41,"./_set-to-string-tag":42,"./_wks":53}],28:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],29:[function(require,module,exports){
module.exports = {};
},{}],30:[function(require,module,exports){
module.exports = true;
},{}],31:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":18,"./_iobject":24,"./_object-gops":35,"./_object-keys":38,"./_object-pie":39,"./_to-object":50}],32:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":22,"./_object-dps":34,"./_shared-key":43}],33:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":7,"./_descriptors":14,"./_ie8-dom-define":23,"./_to-primitive":51}],34:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":7,"./_descriptors":14,"./_object-dp":33,"./_object-keys":38}],35:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],36:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":20,"./_shared-key":43,"./_to-object":50}],37:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":8,"./_has":20,"./_shared-key":43,"./_to-iobject":48}],38:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":16,"./_object-keys-internal":37}],39:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],40:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],41:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":21}],42:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":20,"./_object-dp":33,"./_wks":53}],43:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":44,"./_uid":52}],44:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":19}],45:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":13,"./_to-integer":47}],46:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":47}],47:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],48:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":13,"./_iobject":24}],49:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":47}],50:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":13}],51:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":25}],52:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],53:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":19,"./_shared":44,"./_uid":52}],54:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":9,"./_core":11,"./_iterators":29,"./_wks":53}],55:[function(require,module,exports){
var anObject = require('./_an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./_an-object":7,"./_core":11,"./core.get-iterator-method":54}],56:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":6,"./_iter-define":27,"./_iter-step":28,"./_iterators":29,"./_to-iobject":48}],57:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":17,"./_object-assign":31}],58:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":27,"./_string-at":45}],59:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":19,"./_hide":21,"./_iterators":29,"./_wks":53,"./es6.array.iterator":56}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FILENAME = 'trim.png';

exports.default = {
  initImgUploadEvent: function initImgUploadEvent(id, callback) {
    var isLoad = false;
    var $btn = document.getElementById(id);

    $btn.addEventListener('click', function (e) {
      if (isLoad) {
        console.log('正在打开...');
        return e.preventDefault();
      } else {
        $btn.previousElementSibling.innerText = '正在打开';
        isLoad = true;
        setTimeout(function () {
          isLoad = false;
          $btn.previousElementSibling.innerText = '重新上传';
        }, 10000);
      }
    });

    $btn.addEventListener('change', function (e) {
      var file = e.target.files[0];
      console.log('change..');
      isLoad = false;
      $btn.previousElementSibling.innerText = '重新上传';

      if (!file) {
        return;
      }

      if (!file.type.match('image.*')) {
        return alert('请上传图片文件！');
      }
      FILENAME = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      // reader.readAsArrayBuffer(file)
      // reader.readAsBinaryString(file)
      reader.onload = function (obj) {
        callback && callback(obj);
      };
    });
  },
  initImgDownloadEvent: function initImgDownloadEvent(id, $canvas) {
    var $dld = document.getElementById(id);
    $dld.addEventListener('click', function (e) {
      var imgData = $canvas.toDataURL('image/png');
      $dld.href = imgData.replace('image/png', 'image/octet-stream');
      $dld.download = FILENAME.replace('.png', '_trim.png');
    });
  }
};

},{}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 图像过滤处理算法
 * @author 0326
 */

/**
 * 原始getImageData.data 用数组存储rgba信息，转化成pixels对象存储信息，便于操作
 */
function array2pixelData(data) {
  var pixels = [];
  for (var i = 0, len = data.length; i < len; i += 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3]
    });
  }
  return pixels;
}

/**
 * pixels对象数据还原为getImageData.data 数组格式数据
 */
function pixel2arrayData(pixels, imgData) {
  var i = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pixels), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var pixel = _step.value;

      imgData.data[i++] = pixel.r;
      imgData.data[i++] = pixel.g;
      imgData.data[i++] = pixel.b;
      imgData.data[i++] = pixel.a;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return imgData;
}

/**
 * 空白像素处理算法
 * step1: 扫描并标记出可疑白点(flag = 1)
 * step2: 从alpha=0的透明点出发，一旦发现可疑白点直接擦除
 */
function trimPixels(pixels, options) {
  var width = options.width;
  var height = options.height;
  var getDirectionPixel = function getDirectionPixel(direction, p) {
    var x = p.index / width;
    var y = p.index % width;
    var res = null;
    switch (direction) {
      case 'left':
        x > 0 ? res = pixels[p.index - 1] : undefined;
        break;
      case 'top':
        y > 0 ? res = pixels[p.index - width] : undefined;
        break;
      case 'right':
        x + 1 < width ? res = pixels[p.index + 1] : undefined;
        break;
      case 'bottom':
        y + 1 < height ? res = pixels[p.index + width] : undefined;
        break;
      default:
        alert('impossible!');
    }
    return res;
  };

  // 扫描并标记出可疑白点
  var limit = 255 - options.threshold;
  var distance = options.distance;
  var abs = Math.abs;
  var i = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(pixels), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var p = _step2.value;

      p.index = i++;
      if (p.r > limit && p.g > limit && p.b > limit && abs(p.r - p.g) < distance && abs(p.r - p.b) < distance && abs(p.g - p.b) < distance) {
        p.flag = 1;
      }
    }

    // 擦除点
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = (0, _getIterator3.default)(pixels), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _p = _step3.value;

      if (_p.a === 0) {
        var pl = getDirectionPixel('left', _p);
        var pt = getDirectionPixel('top', _p);
        var pr = getDirectionPixel('right', _p);
        var pb = getDirectionPixel('bottom', _p);
        pl && (pl.flag === 1 || !pl.a && !pl.flag) ? pl.a = 0 : undefined;
        pt && (pt.flag === 1 || !pt.a && !pt.flag) ? pt.a = 0 : undefined;
        pr && (pr.flag === 1 || !pr.a && !pr.flag) ? pr.a = 0 : undefined;
        pb && (pb.flag === 1 || !pb.a && !pb.flag) ? pb.a = 0 : undefined;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return pixels;
}

exports.default = {
  /**
   * 图像trim算法
   */
  trim: function trim(imgData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      threshold: 30,
      distance: 20
    };

    var pixels = array2pixelData(imgData.data);
    options.width = imgData.width;
    options.height = imgData.height;
    pixel2arrayData(trimPixels(pixels, options), imgData);
    return imgData;
  },

  /**
   * 图像crop裁切，去掉多余的空白背景，按指定尺寸切边
   */
  crop: function crop(imgData) {
    var width = imgData.width;
    var height = imgData.height;
    var pixels = array2pixelData(imgData.data);
    var len = pixels.length;
    var getVertex = function getVertex(d) {
      // 获取上下左右最边上的点, d(direction) = top|right|bottom|left
      // 是否水平方向扫描
      var isHorizontal = function isHorizontal(d) {
        return d === 'top' || d === 'bottom';
      };
      // 是否正向扫描（左边、顶部正向扫描，右边、底部倒序扫描）
      var isStartDirct = function isStartDirct(d) {
        return d === 'top' || d === 'left';
      };
      var i = void 0,
          j = void 0,
          p = void 0;
      // if (d === 'top') {
      //   for (i = 0; i < height; i++) {
      //     for(j = 0; j < width; j++) {
      //       p = pixels[j + i * width]
      //       if (p.a !== 0) {
      //         p.x = j
      //         p.y = i
      //         return p
      //       }
      //     }
      //   }
      // }
      // if (d === 'bottom') {
      //   for (i = height - 1; i > 0; i--) {
      //     for(j = 0; j < width; j++) {
      //       p = pixels[j + i * width]
      //       if (p.a !== 0) {
      //         p.x = j
      //         p.y = i
      //         return p
      //       }
      //     }
      //   }
      // }
      // if (d === 'left') {
      //   for (i = 0; i < width; i++) {
      //     for(j = 0; j < height; j++) {
      //       p = pixels[j * width + i]
      //       if (p.a !== 0) {
      //         p.x = i
      //         p.y = j
      //         return p
      //       }
      //     }
      //   }
      // }
      // if (d === 'right') {
      //   for (i = width - 1; i > 0; i--) {
      //     for(j = 0; j < height; j++) {
      //       p = pixels[j * width + i]
      //       if (p.a !== 0) {
      //         p.x = i
      //         p.y = j
      //         return p
      //       }
      //     }
      //   }
      // }
      for (d === 'bottom' ? i = height - 1 : d === 'right' ? i = width - 1 : i = 0; d === 'top' ? i < height : d === 'left' ? i < width : i > 0; isStartDirct(d) ? i++ : i--) {
        for (j = 0; isHorizontal(d) ? j < width : j < height; j++) {
          p = isHorizontal(d) ? pixels[j + i * width] : pixels[i + j * width];
          if (p.a !== 0) {
            p.x = isHorizontal(d) ? j : i;
            p.y = isHorizontal(d) ? i : j;
            return p;
          }
        }
      }
      return isStartDirct(d) ? (0, _assign2.default)({
        x: 0,
        y: 0
      }, pixels[0]) : (0, _assign2.default)({
        x: width - 1,
        y: height - 1
      }, pixels[len - 1]);
    };
    var pt = getVertex('top');
    var pl = getVertex('left');
    var pb = getVertex('bottom');
    var pr = getVertex('right');
    var res = {
      imgData: imgData
    };
    res.sx = pt.x < pl.x ? pt.x : pl.x; // 需要截取的起始点x坐标
    res.sy = pt.y < pl.y ? pt.y : pl.y; // 需要截取的起始点y坐标
    res.dx = pr.x > pb.x ? pr.x : pb.x; // 需要截取的终点x坐标
    res.dy = pr.y > pb.y ? pr.y : pb.y; // 需要截取的终点y坐标
    res.sw = res.dx - res.sx + 1; // 截取空白之后留下的有效宽度
    res.sh = res.dy - res.sy + 1; // 截取空白之后留下的有效高度

    return res;
  }
};

},{"babel-runtime/core-js/get-iterator":1,"babel-runtime/core-js/object/assign":2}],62:[function(require,module,exports){
'use strict';

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvasEl = document.getElementById('J_Canvas'); /*
                                                     * The Entry file
                                                     */

var ctx = canvasEl.getContext('2d');

_test2.default.test(canvasEl, ctx);

/**
 * 初始化图片上传事件
 */
_file2.default.initImgUploadEvent('J_ImgUpload', function (obj) {
  //  绘制图像到canvas
  var currImg = new Image();
  currImg.src = obj.target.result;
  currImg.onload = function (e) {
    canvasEl.parentElement.classList.remove('empty');
    canvasEl.width = currImg.width;
    canvasEl.height = currImg.height;
    ctx.drawImage(currImg, 0, 0);
  };
});

/**
 * 初始化图片保存事件
 */
_file2.default.initImgDownloadEvent('J_ImgDownload', canvasEl);

/**
 * 初始化清空画布事件
 */
document.getElementById('J_EmptyBtn').addEventListener('click', function (e) {
  initCanvas();
});

/**
 * 初始化trim图像事件
 */
document.getElementById('J_ImgTrim').addEventListener('click', function (e) {
  var imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
  ctx.putImageData(_filter2.default.trim(imgData), 0, 0);

  console.log(imgData);
});

/**
 * 初始化crop图像事件
 */
document.getElementById('J_ImgCrop').addEventListener('click', function (e) {
  var imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
  var cropObj = _filter2.default.crop(imgData);

  var img = new Image();
  img.src = canvasEl.toDataURL();
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  canvasEl.width = cropObj.sw;
  canvasEl.height = cropObj.sh;
  setTimeout(function () {
    ctx.drawImage(img, cropObj.sx, cropObj.sy, cropObj.sw, cropObj.sh, 0, 0, canvasEl.width, canvasEl.height);
  }, 0);
});

function initCanvas() {
  canvasEl.parentElement.classList.add('empty');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  canvasEl.width = 500;
  canvasEl.height = 260;
}

},{"./file":60,"./filter":61,"./test":63}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 图片测试
 */

exports.default = {
  test: function test(canvasEl, ctx) {
    document.getElementById('J_TestImgs').addEventListener('click', function (e) {
      var img = e.target;
      if (img.tagName.toLowerCase() !== 'img') {
        return;
      }
      var originImg = new Image();
      originImg.src = img.src;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      canvasEl.parentElement.classList.remove('empty');
      canvasEl.width = originImg.width;
      canvasEl.height = originImg.height;
      ctx.drawImage(originImg, 0, 0);
    });
  }
};

},{}]},{},[62]);

//# sourceMappingURL=bundle.js.map
