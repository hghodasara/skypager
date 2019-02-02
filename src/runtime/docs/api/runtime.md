## Classes

<dl>
<dt><a href="#Runtime">Runtime</a></dt>
<dd><p>The Runtime is similar to the window or document global in the browser, or the module / process globals in node.
You can extend Runtime and define your own process global singleton that acts as a state machine, event emitter,
module registry, dependency injector.  Typically you can just do this with features instead of subclassing.</p>
</dd>
</dl>

## Mixins

<dl>
<dt><a href="#Stateful">Stateful</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#singleton">singleton</a> : <code><a href="#Runtime">Runtime</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Mixin">Mixin</a> : <code>Object.&lt;string, function()&gt;</code></dt>
<dd></dd>
<dt><a href="#MixinOptions">MixinOptions</a> : <code>Object.&lt;string&gt;</code></dt>
<dd></dd>
<dt><a href="#Logger">Logger</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Runtime"></a>

## Runtime
The Runtime is similar to the window or document global in the browser, or the module / process globals in node.
You can extend Runtime and define your own process global singleton that acts as a state machine, event emitter,
module registry, dependency injector.  Typically you can just do this with features instead of subclassing.

**Kind**: global class  

* [Runtime](#Runtime)
    * [new Runtime()](#new_Runtime_new)
    * _instance_
        * [.Runtime](#Runtime+Runtime)
            * [new exports.Runtime(options, context, middlewareFn)](#new_Runtime+Runtime_new)
        * [.contextTypes](#Runtime+contextTypes)
        * [.optionTypes](#Runtime+optionTypes)
        * [.defaultContext](#Runtime+defaultContext)
        * [.contextTypes](#Runtime+contextTypes)
        * [.optionTypes](#Runtime+optionTypes)
        * [.defaultContext](#Runtime+defaultContext)
        * [.defaultOptions](#Runtime+defaultOptions)
        * [.events](#Runtime+events)
        * [.argv](#Runtime+argv)
        * [.isBrowser](#Runtime+isBrowser)
        * [.isNode](#Runtime+isNode)
        * [.isElectron](#Runtime+isElectron)
        * [.isElectronRenderer](#Runtime+isElectronRenderer)
        * [.isReactNative](#Runtime+isReactNative)
        * [.isDebug](#Runtime+isDebug)
        * [.isCI](#Runtime+isCI)
        * [.isDevelopment](#Runtime+isDevelopment)
        * [.isTest](#Runtime+isTest)
        * [.isProduction](#Runtime+isProduction)
        * [.set(path, value)](#Runtime+set) ⇒ <code>?</code>
        * [.get(path, defaultValue)](#Runtime+get) ⇒ <code>?</code>
        * [.result(path, defaultValue)](#Runtime+result) ⇒ <code>?</code>
        * [.has(path, defaultValue)](#Runtime+has) ⇒ <code>Boolean</code>
        * [.invoke(functionAtPath, ...args)](#Runtime+invoke) ⇒ <code>?</code>
        * [.onRegistration(registryPropName, callback)](#Runtime+onRegistration)
        * [.registerHelper(helperName, helperClass)](#Runtime+registerHelper) ⇒ <code>Class</code>
        * [.mixin(mixin, options)](#Runtime+mixin)
        * [.replaceState([newState], [cb])](#Runtime+replaceState) ⇒ <code>Object</code>
        * [.setState([newState], [cb])](#Runtime+setState) ⇒ <code>Object</code>
        * *[.stateDidChange()](#Runtime+stateDidChange)*
        * [.hashObject(anyObject)](#Runtime+hashObject)
        * [.createEntityFrom()](#Runtime+createEntityFrom)
        * [.slice(...properties)](#Runtime+slice) ⇒ <code>\*</code>
        * [.selectCached(selectorId, ...args)](#Runtime+selectCached) ⇒ <code>PromiseLike.&lt;\*&gt;</code>
        * [.select(selectorId, ...args)](#Runtime+select) ⇒ <code>PromiseLike.&lt;\*&gt;</code>
        * [.selectThru(selectorId, ...args)](#Runtime+selectThru) ⇒ <code>PromiseLike.&lt;\*&gt;</code>
        * [.selectChainThru(selectorId, ...args)](#Runtime+selectChainThru) ⇒ <code>LodashChain</code>
        * [.selectChain(selectorId, ...args)](#Runtime+selectChain) ⇒ <code>PromiseLike.&lt;\*&gt;</code>
        * ["stateWillChange"](#Runtime+event_stateWillChange)
        * ["stateWillReplace"](#Runtime+event_stateWillReplace)
        * ["stateWillChange"](#Runtime+event_stateWillChange)
    * _static_
        * [.framework](#Runtime.framework) ⇒ [<code>Runtime</code>](#Runtime)
        * [.registerHelper(helperName, helperClass)](#Runtime.registerHelper) ⇒ <code>Class</code>
        * [.createSingleton()](#Runtime.createSingleton) ⇒ [<code>Runtime</code>](#Runtime)

<a name="new_Runtime_new"></a>

### new Runtime()
Create a new instance of the skypager.Runtime

<a name="Runtime+Runtime"></a>

### runtime.Runtime
**Kind**: instance class of [<code>Runtime</code>](#Runtime)  
<a name="new_Runtime+Runtime_new"></a>

#### new exports.Runtime(options, context, middlewareFn)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | the props, or argv, for the runtime instance at the time it is created |
| context | <code>object</code> | the context, environment, static config, or similar global values that may be relevant to some component in the runtime |
| middlewareFn | <code>function</code> | this function will be called when the runtime is asynchronously loaded and the plugins have run |

<a name="Runtime+contextTypes"></a>

### runtime.contextTypes
The Context Types API defines a schema for properties that will be made available via the runtime's context system.

    You can specify your own context types when you are extending the Runtime class.  If you are using Skypager as
    a global singleton, you won't have the opportunity if you just require('skypager-runtime'), so you can define
    a global variable SkypagerContextTypes and it will use these instead.

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
<a name="Runtime+optionTypes"></a>

### runtime.optionTypes
The Options Types API defines a schema for properties that will be attached to the runtime as an options property.

    You can specify your own options types when you are extending the Runtime class.  If you are using Skypager as
    a global singleton, you won't have the opportunity if you just require('skypager-runtime'), so you can define
    a global variable SkypagerOptionTypes and it will use these instead.

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
<a name="Runtime+defaultContext"></a>

### runtime.defaultContext
The Default Context Object

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
<a name="Runtime+contextTypes"></a>

### runtime.contextTypes
Returns the contextTypes declarations for our Runtime class.

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="Runtime+optionTypes"></a>

### runtime.optionTypes
the optionTypes declarations for our Runtime class

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="Runtime+defaultContext"></a>

### runtime.defaultContext
Returns the default context value for this runtime

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="Runtime+defaultOptions"></a>

### runtime.defaultOptions
Returns the default options for this runtime

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="Runtime+events"></a>

### runtime.events
**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
<a name="Runtime+argv"></a>

### runtime.argv
argv will refer to the initial options passed to the runtime, along with any default values that have been set

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
<a name="Runtime+isBrowser"></a>

### runtime.isBrowser
Returns `true` if the runtime is running inside of a browser.

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="Runtime+isNode"></a>

### runtime.isNode
Returns `true` if the runtime is running inside of node.

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="Runtime+isElectron"></a>

### runtime.isElectron
Returns `true` if the runtime is running inside of electron

**Kind**: instance property of [<code>Runtime</code>](#Runtime)  
**Read only**: true  
<a name="