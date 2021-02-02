# @pipobscure/dataflow

This library contains utilities for managing dataflow.

## Install

`npm install @pipobscure/dataflow`

## Concepts / Classes

### Source

A `Source` is an object with a `value` property. When that property is set, all `Targets` that are subscribed to that `Source` are notified of the change via the `Subscriptions` manager.

### Target

A `Target` is ab object that can be notified of changes and that can subscribe to a `Source`.

There are two generic types of `Target`:

- `Target.callback`: which creates a `Target` that calls a `callback` when the value it subscribes to changes.
- `Target.external`: which creates a `Target` that sets a property on an object when the value it subscribes to changes.

### Subscriptions

`Subscriptions` keeps track of subscriptions of `Target`s to `Source`s. Each `Source` and `Target` is bound to a `Subscriptions` object that it uses to manage its subscriptions. The `Source` uses it to notify all subscribers and the `Target` uses it to request a subscription to a `Source`.

### Further Concepts

#### Operators

Operators are objects that contain one or more `Target`s and are a `Source` themselves. As an example take the `Operators.Addition` operator. It has two `Target`s (`add.left` and `add.right`) that each subscribe to a numeric `Source`. It is also a `Source` itself that will contain the value of the addition of the values.

So when one of the incoming `Source`s changes the result will change and update anything that's subscribed to it.

**Unary Operators**

- Not
- ToBoolean
- ToString
- ToNumber
- Trim
- UpperCase
- LowerCase
- Length
- Round
- Floor
- Ceil

**Binary Operators**

- Addition
- Subtraction
- Multiplication
- Division
- Modulus
- Exponent
- Concatenation
- Index
- LogicalAnd
- LogicalOr
- LogicalXor

**Ternary Operators**

- Conditional
- SubString

#### Sources

A `Sources` object is a registry that maps `id` strings to `Source` objects. It is possible to request a `Source` to subscribe to (which creates it if it doesn't exist yet). Alternatively you can get a `Source` by id which only returns it if it exists so that it can be updated.

This could be used with a `WebSocket` to receive data from and update `Source`s. An example `onmessage` handler could look like this:

```typescript
function onmessage(this: Sources, evt: MessageEvent): void {
	try {
		const data = JSON.parse(evt.data);
		const { source, value } = data;
		if (source === undefined || value === undefined) return;
		const src = this.get<any>(source);
		if (!src) return;
		src.value = value;
	} catch (err) {
		// Ignore
	}
}
```

Only existing `Source` objects are updated. You get one with `sources.source(id, initialValue)` and subscribe your `Target` to it. It will then be updated from the `WebSocket` whenever a message arrives with a new value for it.
