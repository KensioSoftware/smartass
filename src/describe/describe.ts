/**
 * Try to make a useful description of a value that is helpful for debugging.
 */
export function desc(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  if (
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "string" ||
    typeof value === "symbol"
  ) {
    return `${typeof value} ${repr(value)}`;
  }

  if (typeof value === "function")
    return `${repr(value)} (${String(value.length)} args)`;

  if (Array.isArray(value)) {
    return `array ${repr(value)} (len ${String(value.length)})`;
  }

  if (value instanceof Map) {
    return `${repr(value)} (size ${String(value.size)})`;
  }

  if (value instanceof Set) {
    return `${repr(value)} (size ${String(value.size)})`;
  }

  if (value instanceof RegExp) {
    return `RegExp ${repr(value)}`;
  }

  return `object ${repr(value)}`;
}

/**
 * Try to make a string representation of a value that is valid ES syntax for
 * that value, or at least unambiguous.
 */
export function repr(value: unknown, seen = new WeakSet<object>()): string {
  // Avoid infinite recursion on circular references.
  if (value !== null && typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
  }

  if (value === null) return "null";

  if (value === undefined) return "undefined";
  if (typeof value === "boolean") return value ? "true" : "false";

  if (typeof value === "number") {
    if (Object.is(value, -0)) return "-0";
    if (Number.isNaN(value)) return "NaN";
    if (value === Infinity) return "Infinity";
    if (value === -Infinity) return "-Infinity";
    return String(value);
  }

  if (typeof value === "bigint") {
    return `${String(value)}n`;
  }

  if (typeof value === "string") {
    return safeJson(value);
  }

  if (typeof value === "symbol") {
    return value.toString();
  }

  if (typeof value === "function") {
    const name = value.name || "anonymous";
    return `function ${name}(){}`;
  }

  if (Array.isArray(value)) {
    const items = reprList(value, seen);
    return `[${items}]`;
  }

  if (value instanceof Map) {
    const entries = reprList([...value.entries()], seen);
    return `Map([${entries}])`;
  }

  if (value instanceof Set) {
    const entries = reprList([...value.values()], seen);
    return `Set([${entries}])`;
  }

  if (value instanceof WeakMap) return "WeakMap{}";
  if (value instanceof WeakSet) return "WeakSet{}";

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return 'Date("Invalid")';
    return `Date("${value.toISOString()}")`;
  }

  if (value instanceof RegExp) {
    return value.toString();
  }

  if (value instanceof Promise) {
    return "Promise{}";
  }

  if (ArrayBuffer.isView(value)) {
    return `${value.constructor.name} (${String(value.byteLength)} bytes)`;
  }

  if (value instanceof URL) return `URL("${value.href}")`;

  if (value instanceof Error) {
    const parts = [`${value.name}(${safeJson(value.message)})`];

    if ("cause" in value && value.cause !== undefined) {
      parts.push(`cause=${desc(value.cause)}`);
    }

    const stack = value.stack?.split("\n")[1]?.trim();
    if (stack !== undefined) parts.push(`stack=${stack.replace(/^at\s+/, "")}`);

    return parts.join(" ");
  }

  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value) as {
      constructor?: { name?: unknown };
    } | null;
    const ctorName =
      typeof proto?.constructor?.name === "string"
        ? proto.constructor.name
        : undefined;

    const json = reprObject(value, seen);

    if (ctorName !== undefined && ctorName !== "Object") {
      return `${ctorName} ${json}`;
    }

    if (Object.getPrototypeOf(value) === null) {
      return `Object.create(null) ${json}`;
    }

    return json;
  }

  /* v8 ignore next 1 -- @preserve */
  return safeJson(value);
}

function reprList(items: readonly unknown[], seen: WeakSet<object>): string {
  if (items.length <= 10) {
    return items.map((item: unknown) => repr(item, seen)).join(",");
  }

  const first = items.slice(0, 3).map((item) => repr(item, seen));
  const last = items.slice(-3).map((item) => repr(item, seen));

  return [...first, "...", ...last].join(",");
}

function reprObject(value: object, seen: WeakSet<object>): string {
  let entries;
  try {
    entries = Object.entries(value);
  } catch (error) {
    if (error instanceof TypeError) {
      return "[Unserializable object]";
    }
    throw error;
  }

  if (entries.length === 0) {
    return "{}";
  }

  if (entries.length <= 10) {
    const pairs = entries
      .map(([key, val]) => `${safeJson(key)}:${repr(val, seen)}`)
      .join(",");
    return `{${pairs}}`;
  }

  const first = entries
    .slice(0, 3)
    .map(([key, val]) => `${safeJson(key)}:${repr(val, seen)}`);
  const last = entries
    .slice(-3)
    .map(([key, val]) => `${safeJson(key)}:${repr(val, seen)}`);

  return `{${[...first, "...", ...last].join(",")}}`;
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    /* v8 ignore next 4 -- @preserve */
    if (error instanceof Error) {
      return `[Unserializable: ${error.name}("${error.message}")]`;
    }
    /* v8 ignore next 1 -- @preserve */
    return "[Unserializable]";
  }
}
