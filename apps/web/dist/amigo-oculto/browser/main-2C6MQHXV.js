var Cp = Object.defineProperty,
  bp = Object.defineProperties;
var Sp = Object.getOwnPropertyDescriptors;
var kc = Object.getOwnPropertySymbols;
var Tp = Object.prototype.hasOwnProperty,
  Mp = Object.prototype.propertyIsEnumerable;
var Pc = (e, n, t) =>
    n in e
      ? Cp(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (e[n] = t),
  g = (e, n) => {
    for (var t in (n ||= {})) Tp.call(n, t) && Pc(e, t, n[t]);
    if (kc) for (var t of kc(n)) Mp.call(n, t) && Pc(e, t, n[t]);
    return e;
  },
  F = (e, n) => bp(e, Sp(n));
var U = (e, n, t) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(t.next(c));
        } catch (l) {
          o(l);
        }
      },
      s = (c) => {
        try {
          a(t.throw(c));
        } catch (l) {
          o(l);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((t = t.apply(e, n)).next());
  });
var ee = null,
  Rr = !1,
  Mi = 1,
  _p = null,
  le = Symbol("SIGNAL");
function N(e) {
  let n = ee;
  return ((ee = e), n);
}
function Or() {
  return ee;
}
var In = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: "unknown",
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function wn(e) {
  if (Rr) throw new Error("");
  if (ee === null) return;
  ee.consumerOnSignalRead(e);
  let n = ee.producersTail;
  if (n !== void 0 && n.producer === e) return;
  let t,
    r = ee.recomputing;
  if (
    r &&
    ((t = n !== void 0 ? n.nextProducer : ee.producers),
    t !== void 0 && t.producer === e)
  ) {
    ((ee.producersTail = t), (t.lastReadVersion = e.version));
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === ee && (!r || xp(o, ee))) return;
  let i = Ft(ee),
    s = {
      producer: e,
      consumer: ee,
      nextProducer: t,
      prevConsumer: o,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((ee.producersTail = s),
    n !== void 0 ? (n.nextProducer = s) : (ee.producers = s),
    i && Hc(e, s));
}
function Lc() {
  Mi++;
}
function _i(e) {
  if (!(Ft(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Mi)) {
    if (!e.producerMustRecompute(e) && !Pr(e)) {
      Ar(e);
      return;
    }
    (e.producerRecomputeValue(e), Ar(e));
  }
}
function Ni(e) {
  if (e.consumers === void 0) return;
  let n = Rr;
  Rr = !0;
  try {
    for (let t = e.consumers; t !== void 0; t = t.nextConsumer) {
      let r = t.consumer;
      r.dirty || Np(r);
    }
  } finally {
    Rr = n;
  }
}
function xi() {
  return ee?.consumerAllowSignalWrites !== !1;
}
function Np(e) {
  ((e.dirty = !0), Ni(e), e.consumerMarkedDirty?.(e));
}
function Ar(e) {
  ((e.dirty = !1), (e.lastCleanEpoch = Mi));
}
function Dn(e) {
  return (e && Fc(e), N(e));
}
function Fc(e) {
  ((e.producersTail = void 0), (e.recomputing = !0));
}
function kr(e, n) {
  (N(n), e && jc(e));
}
function jc(e) {
  e.recomputing = !1;
  let n = e.producersTail,
    t = n !== void 0 ? n.nextProducer : e.producers;
  if (t !== void 0) {
    if (Ft(e))
      do t = Ri(t);
      while (t !== void 0);
    n !== void 0 ? (n.nextProducer = void 0) : (e.producers = void 0);
  }
}
function Pr(e) {
  for (let n = e.producers; n !== void 0; n = n.nextProducer) {
    let t = n.producer,
      r = n.lastReadVersion;
    if (r !== t.version || (_i(t), r !== t.version)) return !0;
  }
  return !1;
}
function Cn(e) {
  if (Ft(e)) {
    let n = e.producers;
    for (; n !== void 0; ) n = Ri(n);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function Hc(e, n) {
  let t = e.consumersTail,
    r = Ft(e);
  if (
    (t !== void 0
      ? ((n.nextConsumer = t.nextConsumer), (t.nextConsumer = n))
      : ((n.nextConsumer = void 0), (e.consumers = n)),
    (n.prevConsumer = t),
    (e.consumersTail = n),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer)
      Hc(o.producer, o);
}
function Ri(e) {
  let n = e.producer,
    t = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (n.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((n.consumers = r), !Ft(n))) {
    let i = n.producers;
    for (; i !== void 0; ) i = Ri(i);
  }
  return t;
}
function Ft(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function Ai(e) {
  _p?.(e);
}
function xp(e, n) {
  let t = n.producersTail;
  if (t !== void 0) {
    let r = n.producers;
    do {
      if (r === e) return !0;
      if (r === t) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function Oi(e, n) {
  return Object.is(e, n);
}
function Rp() {
  throw new Error();
}
var Uc = Rp;
function Vc(e) {
  Uc(e);
}
function ki(e) {
  Uc = e;
}
var Ap = null;
function Pi(e, n) {
  let t = Object.create(Lr);
  ((t.value = e), n !== void 0 && (t.equal = n));
  let r = () => $c(t);
  return ((r[le] = t), Ai(t), [r, (s) => jt(t, s), (s) => Li(t, s)]);
}
function $c(e) {
  return (wn(e), e.value);
}
function jt(e, n) {
  (xi() || Vc(e), e.equal(e.value, n) || ((e.value = n), Op(e)));
}
function Li(e, n) {
  (xi() || Vc(e), jt(e, n(e.value)));
}
var Lr = F(g({}, In), { equal: Oi, value: void 0, kind: "signal" });
function Op(e) {
  (e.version++, Lc(), Ni(e), Ap?.(e));
}
function C(e) {
  return typeof e == "function";
}
function Ht(e) {
  let t = e((r) => {
    (Error.call(r), (r.stack = new Error().stack));
  });
  return (
    (t.prototype = Object.create(Error.prototype)),
    (t.prototype.constructor = t),
    t
  );
}
var Fr = Ht(
  (e) =>
    function (t) {
      (e(this),
        (this.message = t
          ? `${t.length} errors occurred during unsubscription:
${t.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = t));
    },
);
function bn(e, n) {
  if (e) {
    let t = e.indexOf(n);
    0 <= t && e.splice(t, 1);
  }
}
var q = class e {
  constructor(n) {
    ((this.initialTeardown = n),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let n;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: t } = this;
      if (t)
        if (((this._parentage = null), Array.isArray(t)))
          for (let i of t) i.remove(this);
        else t.remove(this);
      let { initialTeardown: r } = this;
      if (C(r))
        try {
          r();
        } catch (i) {
          n = i instanceof Fr ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Bc(i);
          } catch (s) {
            ((n = n ?? []),
              s instanceof Fr ? (n = [...n, ...s.errors]) : n.push(s));
          }
      }
      if (n) throw new Fr(n);
    }
  }
  add(n) {
    var t;
    if (n && n !== this)
      if (this.closed) Bc(n);
      else {
        if (n instanceof e) {
          if (n.closed || n._hasParent(this)) return;
          n._addParent(this);
        }
        (this._finalizers =
          (t = this._finalizers) !== null && t !== void 0 ? t : []).push(n);
      }
  }
  _hasParent(n) {
    let { _parentage: t } = this;
    return t === n || (Array.isArray(t) && t.includes(n));
  }
  _addParent(n) {
    let { _parentage: t } = this;
    this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
  }
  _removeParent(n) {
    let { _parentage: t } = this;
    t === n ? (this._parentage = null) : Array.isArray(t) && bn(t, n);
  }
  remove(n) {
    let { _finalizers: t } = this;
    (t && bn(t, n), n instanceof e && n._removeParent(this));
  }
};
q.EMPTY = (() => {
  let e = new q();
  return ((e.closed = !0), e);
})();
var Fi = q.EMPTY;
function jr(e) {
  return (
    e instanceof q ||
    (e && "closed" in e && C(e.remove) && C(e.add) && C(e.unsubscribe))
  );
}
function Bc(e) {
  C(e) ? e() : e.unsubscribe();
}
var De = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Ut = {
  setTimeout(e, n, ...t) {
    let { delegate: r } = Ut;
    return r?.setTimeout ? r.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
  },
  clearTimeout(e) {
    let { delegate: n } = Ut;
    return (n?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Hr(e) {
  Ut.setTimeout(() => {
    let { onUnhandledError: n } = De;
    if (n) n(e);
    else throw e;
  });
}
function Sn() {}
var zc = ji("C", void 0, void 0);
function qc(e) {
  return ji("E", void 0, e);
}
function Wc(e) {
  return ji("N", e, void 0);
}
function ji(e, n, t) {
  return { kind: e, value: n, error: t };
}
var ct = null;
function Vt(e) {
  if (De.useDeprecatedSynchronousErrorHandling) {
    let n = !ct;
    if ((n && (ct = { errorThrown: !1, error: null }), e(), n)) {
      let { errorThrown: t, error: r } = ct;
      if (((ct = null), t)) throw r;
    }
  } else e();
}
function Gc(e) {
  De.useDeprecatedSynchronousErrorHandling &&
    ct &&
    ((ct.errorThrown = !0), (ct.error = e));
}
var lt = class extends q {
    constructor(n) {
      (super(),
        (this.isStopped = !1),
        n
          ? ((this.destination = n), jr(n) && n.add(this))
          : (this.destination = Lp));
    }
    static create(n, t, r) {
      return new $t(n, t, r);
    }
    next(n) {
      this.isStopped ? Ui(Wc(n), this) : this._next(n);
    }
    error(n) {
      this.isStopped
        ? Ui(qc(n), this)
        : ((this.isStopped = !0), this._error(n));
    }
    complete() {
      this.isStopped ? Ui(zc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(n) {
      this.destination.next(n);
    }
    _error(n) {
      try {
        this.destination.error(n);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  kp = Function.prototype.bind;
function Hi(e, n) {
  return kp.call(e, n);
}
var Vi = class {
    constructor(n) {
      this.partialObserver = n;
    }
    next(n) {
      let { partialObserver: t } = this;
      if (t.next)
        try {
          t.next(n);
        } catch (r) {
          Ur(r);
        }
    }
    error(n) {
      let { partialObserver: t } = this;
      if (t.error)
        try {
          t.error(n);
        } catch (r) {
          Ur(r);
        }
      else Ur(n);
    }
    complete() {
      let { partialObserver: n } = this;
      if (n.complete)
        try {
          n.complete();
        } catch (t) {
          Ur(t);
        }
    }
  },
  $t = class extends lt {
    constructor(n, t, r) {
      super();
      let o;
      if (C(n) || !n)
        o = { next: n ?? void 0, error: t ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && De.useDeprecatedNextContext
          ? ((i = Object.create(n)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: n.next && Hi(n.next, i),
              error: n.error && Hi(n.error, i),
              complete: n.complete && Hi(n.complete, i),
            }))
          : (o = n);
      }
      this.destination = new Vi(o);
    }
  };
function Ur(e) {
  De.useDeprecatedSynchronousErrorHandling ? Gc(e) : Hr(e);
}
function Pp(e) {
  throw e;
}
function Ui(e, n) {
  let { onStoppedNotification: t } = De;
  t && Ut.setTimeout(() => t(e, n));
}
var Lp = { closed: !0, next: Sn, error: Pp, complete: Sn };
var Bt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Ce(e) {
  return e;
}
function $i(...e) {
  return Bi(e);
}
function Bi(e) {
  return e.length === 0
    ? Ce
    : e.length === 1
      ? e[0]
      : function (t) {
          return e.reduce((r, o) => o(r), t);
        };
}
var x = (() => {
  class e {
    constructor(t) {
      t && (this._subscribe = t);
    }
    lift(t) {
      let r = new e();
      return ((r.source = this), (r.operator = t), r);
    }
    subscribe(t, r, o) {
      let i = jp(t) ? t : new $t(t, r, o);
      return (
        Vt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i),
          );
        }),
        i
      );
    }
    _trySubscribe(t) {
      try {
        return this._subscribe(t);
      } catch (r) {
        t.error(r);
      }
    }
    forEach(t, r) {
      return (
        (r = Qc(r)),
        new r((o, i) => {
          let s = new $t({
            next: (a) => {
              try {
                t(a);
              } catch (c) {
                (i(c), s.unsubscribe());
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(t) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(t);
    }
    [Bt]() {
      return this;
    }
    pipe(...t) {
      return Bi(t)(this);
    }
    toPromise(t) {
      return (
        (t = Qc(t)),
        new t((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return ((e.create = (n) => new e(n)), e);
})();
function Qc(e) {
  var n;
  return (n = e ?? De.Promise) !== null && n !== void 0 ? n : Promise;
}
function Fp(e) {
  return e && C(e.next) && C(e.error) && C(e.complete);
}
function jp(e) {
  return (e && e instanceof lt) || (Fp(e) && jr(e));
}
function Hp(e) {
  return C(e?.lift);
}
function R(e) {
  return (n) => {
    if (Hp(n))
      return n.lift(function (t) {
        try {
          return e(t, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function P(e, n, t, r, o) {
  return new zi(e, n, t, r, o);
}
var zi = class extends lt {
  constructor(n, t, r, o, i, s) {
    (super(n),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = t
        ? function (a) {
            try {
              t(a);
            } catch (c) {
              n.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              n.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              n.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: t } = this;
      (super.unsubscribe(),
        !t && ((n = this.onFinalize) === null || n === void 0 || n.call(this)));
    }
  }
};
var Zc = Ht(
  (e) =>
    function () {
      (e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed"));
    },
);
var te = (() => {
    class e extends x {
      constructor() {
        (super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null));
      }
      lift(t) {
        let r = new Vr(this, this);
        return ((r.operator = t), r);
      }
      _throwIfClosed() {
        if (this.closed) throw new Zc();
      }
      next(t) {
        Vt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(t);
          }
        });
      }
      error(t) {
        Vt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = !0), (this.thrownError = t));
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(t);
          }
        });
      }
      complete() {
        Vt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: t } = this;
            for (; t.length; ) t.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null));
      }
      get observed() {
        var t;
        return (
          ((t = this.observers) === null || t === void 0 ? void 0 : t.length) >
          0
        );
      }
      _trySubscribe(t) {
        return (this._throwIfClosed(), super._trySubscribe(t));
      }
      _subscribe(t) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(t),
          this._innerSubscribe(t)
        );
      }
      _innerSubscribe(t) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Fi
          : ((this.currentObservers = null),
            i.push(t),
            new q(() => {
              ((this.currentObservers = null), bn(i, t));
            }));
      }
      _checkFinalizedStatuses(t) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? t.error(o) : i && t.complete();
      }
      asObservable() {
        let t = new x();
        return ((t.source = this), t);
      }
    }
    return ((e.create = (n, t) => new Vr(n, t)), e);
  })(),
  Vr = class extends te {
    constructor(n, t) {
      (super(), (this.destination = n), (this.source = t));
    }
    next(n) {
      var t, r;
      (r =
        (t = this.destination) === null || t === void 0 ? void 0 : t.next) ===
        null ||
        r === void 0 ||
        r.call(t, n);
    }
    error(n) {
      var t, r;
      (r =
        (t = this.destination) === null || t === void 0 ? void 0 : t.error) ===
        null ||
        r === void 0 ||
        r.call(t, n);
    }
    complete() {
      var n, t;
      (t =
        (n = this.destination) === null || n === void 0
          ? void 0
          : n.complete) === null ||
        t === void 0 ||
        t.call(n);
    }
    _subscribe(n) {
      var t, r;
      return (r =
        (t = this.source) === null || t === void 0
          ? void 0
          : t.subscribe(n)) !== null && r !== void 0
        ? r
        : Fi;
    }
  };
var Y = class extends te {
  constructor(n) {
    (super(), (this._value = n));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(n) {
    let t = super._subscribe(n);
    return (!t.closed && n.next(this._value), t);
  }
  getValue() {
    let { hasError: n, thrownError: t, _value: r } = this;
    if (n) throw t;
    return (this._throwIfClosed(), r);
  }
  next(n) {
    super.next((this._value = n));
  }
};
var K = new x((e) => e.complete());
function Yc(e) {
  return e && C(e.schedule);
}
function Kc(e) {
  return e[e.length - 1];
}
function Jc(e) {
  return C(Kc(e)) ? e.pop() : void 0;
}
function Ze(e) {
  return Yc(Kc(e)) ? e.pop() : void 0;
}
function el(e, n, t, r) {
  function o(i) {
    return i instanceof t
      ? i
      : new t(function (s) {
          s(i);
        });
  }
  return new (t || (t = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, n || [])).next());
  });
}
function Xc(e) {
  var n = typeof Symbol == "function" && Symbol.iterator,
    t = n && e[n],
    r = 0;
  if (t) return t.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0),
          { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    n ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function ut(e) {
  return this instanceof ut ? ((this.v = e), this) : new ut(e);
}
function tl(e, n, t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = t.apply(e, n || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype,
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (m) {
      return Promise.resolve(m).then(f, d);
    };
  }
  function a(f, m) {
    r[f] &&
      ((o[f] = function (H) {
        return new Promise(function ($, Z) {
          i.push([f, H, $, Z]) > 1 || c(f, H);
        });
      }),
      m && (o[f] = m(o[f])));
  }
  function c(f, m) {
    try {
      l(r[f](m));
    } catch (H) {
      h(i[0][3], H);
    }
  }
  function l(f) {
    f.value instanceof ut
      ? Promise.resolve(f.value.v).then(u, d)
      : h(i[0][2], f);
  }
  function u(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function h(f, m) {
    (f(m), i.shift(), i.length && c(i[0][0], i[0][1]));
  }
}
function nl(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = e[Symbol.asyncIterator],
    t;
  return n
    ? n.call(e)
    : ((e = typeof Xc == "function" ? Xc(e) : e[Symbol.iterator]()),
      (t = {}),
      r("next"),
      r("throw"),
      r("return"),
      (t[Symbol.asyncIterator] = function () {
        return this;
      }),
      t);
  function r(i) {
    t[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          ((s = e[i](s)), o(a, c, s.done, s.value));
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var $r = (e) => e && typeof e.length == "number" && typeof e != "function";
function Br(e) {
  return C(e?.then);
}
function zr(e) {
  return C(e[Bt]);
}
function qr(e) {
  return Symbol.asyncIterator && C(e?.[Symbol.asyncIterator]);
}
function Wr(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Up() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Gr = Up();
function Qr(e) {
  return C(e?.[Gr]);
}
function Zr(e) {
  return tl(this, arguments, function* () {
    let t = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield ut(t.read());
        if (o) return yield ut(void 0);
        yield yield ut(r);
      }
    } finally {
      t.releaseLock();
    }
  });
}
function Yr(e) {
  return C(e?.getReader);
}
function G(e) {
  if (e instanceof x) return e;
  if (e != null) {
    if (zr(e)) return Vp(e);
    if ($r(e)) return $p(e);
    if (Br(e)) return Bp(e);
    if (qr(e)) return rl(e);
    if (Qr(e)) return zp(e);
    if (Yr(e)) return qp(e);
  }
  throw Wr(e);
}
function Vp(e) {
  return new x((n) => {
    let t = e[Bt]();
    if (C(t.subscribe)) return t.subscribe(n);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function $p(e) {
  return new x((n) => {
    for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
    n.complete();
  });
}
function Bp(e) {
  return new x((n) => {
    e.then(
      (t) => {
        n.closed || (n.next(t), n.complete());
      },
      (t) => n.error(t),
    ).then(null, Hr);
  });
}
function zp(e) {
  return new x((n) => {
    for (let t of e) if ((n.next(t), n.closed)) return;
    n.complete();
  });
}
function rl(e) {
  return new x((n) => {
    Wp(e, n).catch((t) => n.error(t));
  });
}
function qp(e) {
  return rl(Zr(e));
}
function Wp(e, n) {
  var t, r, o, i;
  return el(this, void 0, void 0, function* () {
    try {
      for (t = nl(e); (r = yield t.next()), !r.done; ) {
        let s = r.value;
        if ((n.next(s), n.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = t.return) && (yield i.call(t));
      } finally {
        if (o) throw o.error;
      }
    }
    n.complete();
  });
}
function se(e, n, t, r = 0, o = !1) {
  let i = n.schedule(function () {
    (t(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(i), !o)) return i;
}
function Kr(e, n = 0) {
  return R((t, r) => {
    t.subscribe(
      P(
        r,
        (o) => se(r, e, () => r.next(o), n),
        () => se(r, e, () => r.complete(), n),
        (o) => se(r, e, () => r.error(o), n),
      ),
    );
  });
}
function Jr(e, n = 0) {
  return R((t, r) => {
    r.add(e.schedule(() => t.subscribe(r), n));
  });
}
function ol(e, n) {
  return G(e).pipe(Jr(n), Kr(n));
}
function il(e, n) {
  return G(e).pipe(Jr(n), Kr(n));
}
function sl(e, n) {
  return new x((t) => {
    let r = 0;
    return n.schedule(function () {
      r === e.length
        ? t.complete()
        : (t.next(e[r++]), t.closed || this.schedule());
    });
  });
}
function al(e, n) {
  return new x((t) => {
    let r;
    return (
      se(t, n, () => {
        ((r = e[Gr]()),
          se(
            t,
            n,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                t.error(s);
                return;
              }
              i ? t.complete() : t.next(o);
            },
            0,
            !0,
          ));
      }),
      () => C(r?.return) && r.return()
    );
  });
}
function Xr(e, n) {
  if (!e) throw new Error("Iterable cannot be null");
  return new x((t) => {
    se(t, n, () => {
      let r = e[Symbol.asyncIterator]();
      se(
        t,
        n,
        () => {
          r.next().then((o) => {
            o.done ? t.complete() : t.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function cl(e, n) {
  return Xr(Zr(e), n);
}
function ll(e, n) {
  if (e != null) {
    if (zr(e)) return ol(e, n);
    if ($r(e)) return sl(e, n);
    if (Br(e)) return il(e, n);
    if (qr(e)) return Xr(e, n);
    if (Qr(e)) return al(e, n);
    if (Yr(e)) return cl(e, n);
  }
  throw Wr(e);
}
function B(e, n) {
  return n ? ll(e, n) : G(e);
}
function _(...e) {
  let n = Ze(e);
  return B(e, n);
}
function qi(e, n) {
  let t = C(e) ? e : () => e,
    r = (o) => o.error(t());
  return new x(n ? (o) => n.schedule(r, 0, o) : r);
}
function eo(e) {
  return !!e && (e instanceof x || (C(e.lift) && C(e.subscribe)));
}
var dt = Ht(
  (e) =>
    function () {
      (e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence"));
    },
);
function V(e, n) {
  return R((t, r) => {
    let o = 0;
    t.subscribe(
      P(r, (i) => {
        r.next(e.call(n, i, o++));
      }),
    );
  });
}
var { isArray: Gp } = Array;
function Qp(e, n) {
  return Gp(n) ? e(...n) : e(n);
}
function ul(e) {
  return V((n) => Qp(e, n));
}
var { isArray: Zp } = Array,
  { getPrototypeOf: Yp, prototype: Kp, keys: Jp } = Object;
function dl(e) {
  if (e.length === 1) {
    let n = e[0];
    if (Zp(n)) return { args: n, keys: null };
    if (Xp(n)) {
      let t = Jp(n);
      return { args: t.map((r) => n[r]), keys: t };
    }
  }
  return { args: e, keys: null };
}
function Xp(e) {
  return e && typeof e == "object" && Yp(e) === Kp;
}
function fl(e, n) {
  return e.reduce((t, r, o) => ((t[r] = n[o]), t), {});
}
function Wi(...e) {
  let n = Ze(e),
    t = Jc(e),
    { args: r, keys: o } = dl(e);
  if (r.length === 0) return B([], n);
  let i = new x(eh(r, n, o ? (s) => fl(o, s) : Ce));
  return t ? i.pipe(ul(t)) : i;
}
function eh(e, n, t = Ce) {
  return (r) => {
    pl(
      n,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          pl(
            n,
            () => {
              let l = B(e[c], n),
                u = !1;
              l.subscribe(
                P(
                  r,
                  (d) => {
                    ((i[c] = d),
                      u || ((u = !0), a--),
                      a || r.next(t(i.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function pl(e, n, t) {
  e ? se(t, e, n) : n();
}
function hl(e, n, t, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    h = () => {
      d && !c.length && !l && n.complete();
    },
    f = (H) => (l < r ? m(H) : c.push(H)),
    m = (H) => {
      (i && n.next(H), l++);
      let $ = !1;
      G(t(H, u++)).subscribe(
        P(
          n,
          (Z) => {
            (o?.(Z), i ? f(Z) : n.next(Z));
          },
          () => {
            $ = !0;
          },
          void 0,
          () => {
            if ($)
              try {
                for (l--; c.length && l < r; ) {
                  let Z = c.shift();
                  s ? se(n, s, () => m(Z)) : m(Z);
                }
                h();
              } catch (Z) {
                n.error(Z);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      P(n, f, () => {
        ((d = !0), h());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function re(e, n, t = 1 / 0) {
  return C(n)
    ? re((r, o) => V((i, s) => n(r, i, o, s))(G(e(r, o))), t)
    : (typeof n == "number" && (t = n), R((r, o) => hl(r, o, e, t)));
}
function gl(e = 1 / 0) {
  return re(Ce, e);
}
function ml() {
  return gl(1);
}
function zt(...e) {
  return ml()(B(e, Ze(e)));
}
function Tn(e) {
  return new x((n) => {
    G(e()).subscribe(n);
  });
}
function je(e, n) {
  return R((t, r) => {
    let o = 0;
    t.subscribe(P(r, (i) => e.call(n, i, o++) && r.next(i)));
  });
}
function Mn(e) {
  return R((n, t) => {
    let r = null,
      o = !1,
      i;
    ((r = n.subscribe(
      P(t, void 0, void 0, (s) => {
        ((i = G(e(s, Mn(e)(n)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(t)) : (o = !0));
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(t)));
  });
}
function to(e, n) {
  return C(n) ? re(e, n, 1) : re(e, 1);
}
function vl(e) {
  return R((n, t) => {
    let r = !1;
    n.subscribe(
      P(
        t,
        (o) => {
          ((r = !0), t.next(o));
        },
        () => {
          (r || t.next(e), t.complete());
        },
      ),
    );
  });
}
function He(e) {
  return e <= 0
    ? () => K
    : R((n, t) => {
        let r = 0;
        n.subscribe(
          P(t, (o) => {
            ++r <= e && (t.next(o), e <= r && t.complete());
          }),
        );
      });
}
function yl(e = th) {
  return R((n, t) => {
    let r = !1;
    n.subscribe(
      P(
        t,
        (o) => {
          ((r = !0), t.next(o));
        },
        () => (r ? t.complete() : t.error(e())),
      ),
    );
  });
}
function th() {
  return new dt();
}
function Gi(e) {
  return R((n, t) => {
    try {
      n.subscribe(t);
    } finally {
      t.add(e);
    }
  });
}
function Ue(e, n) {
  let t = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? je((o, i) => e(o, i, r)) : Ce,
      He(1),
      t ? vl(n) : yl(() => new dt()),
    );
}
function no(e) {
  return e <= 0
    ? () => K
    : R((n, t) => {
        let r = [];
        n.subscribe(
          P(
            t,
            (o) => {
              (r.push(o), e < r.length && r.shift());
            },
            () => {
              for (let o of r) t.next(o);
              t.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function Qi(...e) {
  let n = Ze(e);
  return R((t, r) => {
    (n ? zt(e, t, n) : zt(e, t)).subscribe(r);
  });
}
function be(e, n) {
  return R((t, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    t.subscribe(
      P(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          G(e(c, u)).subscribe(
            (o = P(
              r,
              (d) => r.next(n ? n(c, d, u, l++) : d),
              () => {
                ((o = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function _n(e) {
  return R((n, t) => {
    (G(e).subscribe(P(t, () => t.complete(), Sn)), !t.closed && n.subscribe(t));
  });
}
function me(e, n, t) {
  let r = C(e) || n || t ? { next: e, error: n, complete: t } : e;
  return r
    ? R((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          P(
            i,
            (c) => {
              var l;
              ((l = r.next) === null || l === void 0 || l.call(r, c),
                i.next(c));
            },
            () => {
              var c;
              ((a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                i.complete());
            },
            (c) => {
              var l;
              ((a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                i.error(c));
            },
            () => {
              var c, l;
              (a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r));
            },
          ),
        );
      })
    : Ce;
}
var Zi;
function ro() {
  return Zi;
}
function Ae(e) {
  let n = Zi;
  return ((Zi = e), n);
}
var El = Symbol("NotFound");
function qt(e) {
  return e === El || e?.name === "\u0275NotFound";
}
function Il(e) {
  let n = N(null);
  try {
    return e();
  } finally {
    N(n);
  }
}
var v = class extends Error {
  code;
  constructor(n, t) {
    (super(kn(n, t)), (this.code = n));
  }
};
function ih(e) {
  return `NG0${Math.abs(e)}`;
}
function kn(e, n) {
  return `${ih(e)}${n ? ": " + n : ""}`;
}
function A(e) {
  for (let n in e) if (e[n] === A) return n;
  throw Error("");
}
function lo(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return `[${e.map(lo).join(", ")}]`;
  if (e == null) return "" + e;
  let n = e.overriddenName || e.name;
  if (n) return `${n}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let r = t.indexOf(`
`);
  return r >= 0 ? t.slice(0, r) : t;
}
function us(e, n) {
  return e ? (n ? `${e} ${n}` : e) : n || "";
}
var sh = A({ __forward_ref__: A });
function uo(e) {
  return ((e.__forward_ref__ = uo), e);
}
function ae(e) {
  return ds(e) ? e() : e;
}
function ds(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(sh) && e.__forward_ref__ === uo
  );
}
function E(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function Pn(e) {
  return ah(e, fo);
}
function fs(e) {
  return Pn(e) !== null;
}
function ah(e, n) {
  return (e.hasOwnProperty(n) && e[n]) || null;
}
function ch(e) {
  let n = e?.[fo] ?? null;
  return n || null;
}
function Ki(e) {
  return e && e.hasOwnProperty(io) ? e[io] : null;
}
var fo = A({ ɵprov: A }),
  io = A({ ɵinj: A }),
  y = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(n, t) {
      ((this._desc = n),
        (this.ɵprov = void 0),
        typeof t == "number"
          ? (this.__NG_ELEMENT_ID__ = t)
          : t !== void 0 &&
            (this.ɵprov = E({
              token: this,
              providedIn: t.providedIn || "root",
              factory: t.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function ps(e) {
  return e && !!e.ɵproviders;
}
var hs = A({ ɵcmp: A }),
  gs = A({ ɵdir: A }),
  ms = A({ ɵpipe: A }),
  vs = A({ ɵmod: A }),
  xn = A({ ɵfac: A }),
  yt = A({ __NG_ELEMENT_ID__: A }),
  wl = A({ __NG_ENV_ID__: A });
function ys(e) {
  return (po(e, "@NgModule"), e[vs] || null);
}
function Ke(e) {
  return (po(e, "@Component"), e[hs] || null);
}
function Es(e) {
  return (po(e, "@Directive"), e[gs] || null);
}
function Sl(e) {
  return (po(e, "@Pipe"), e[ms] || null);
}
function po(e, n) {
  if (e == null) throw new v(-919, !1);
}
var Tl = A({ ngErrorCode: A }),
  lh = A({ ngErrorMessage: A }),
  uh = A({ ngTokenPath: A });
function Is(e, n) {
  return Ml("", -200, n);
}
function ho(e, n) {
  throw new v(-201, !1);
}
function Ml(e, n, t) {
  let r = new v(n, e);
  return ((r[Tl] = n), (r[lh] = e), t && (r[uh] = t), r);
}
function dh(e) {
  return e[Tl];
}
var Ji;
function _l() {
  return Ji;
}
function ue(e) {
  let n = Ji;
  return ((Ji = e), n);
}
function ws(e, n, t) {
  let r = Pn(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (t & 8) return null;
  if (n !== void 0) return n;
  ho(e, "");
}
var fh = {},
  ft = fh,
  ph = "__NG_DI_FLAG__",
  Xi = class {
    injector;
    constructor(n) {
      this.injector = n;
    }
    retrieve(n, t) {
      let r = pt(t) || 0;
      try {
        return this.injector.get(n, r & 8 ? null : ft, r);
      } catch (o) {
        if (qt(o)) return o;
        throw o;
      }
    }
  };
function hh(e, n = 0) {
  let t = ro();
  if (t === void 0) throw new v(-203, !1);
  if (t === null) return ws(e, void 0, n);
  {
    let r = gh(n),
      o = t.retrieve(e, r);
    if (qt(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function T(e, n = 0) {
  return (_l() || hh)(ae(e), n);
}
function p(e, n) {
  return T(e, pt(n));
}
function pt(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function gh(e) {
  return {
    optional: !!(e & 8),
    host: !!(e & 1),
    self: !!(e & 2),
    skipSelf: !!(e & 4),
  };
}
function es(e) {
  let n = [];
  for (let t = 0; t < e.length; t++) {
    let r = ae(e[t]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new v(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = mh(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      n.push(T(o, i));
    } else n.push(T(r));
  }
  return n;
}
function mh(e) {
  return e[ph];
}
function ht(e, n) {
  let t = e.hasOwnProperty(xn);
  return t ? e[xn] : null;
}
function go(e, n) {
  e.forEach((t) => (Array.isArray(t) ? go(t, n) : n(t)));
}
function Ds(e, n, t) {
  n >= e.length ? e.push(t) : e.splice(n, 0, t);
}
function Ln(e, n) {
  return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
}
var Et = {},
  gt = [],
  Je = new y(""),
  Cs = new y("", -1),
  bs = new y(""),
  Rn = class {
    get(n, t = ft) {
      if (t === ft) {
        let o = Ml("", -201);
        throw ((o.name = "\u0275NotFound"), o);
      }
      return t;
    }
  };
function Fn(e) {
  return { ɵproviders: e };
}
function Nl(...e) {
  return { ɵproviders: Ss(!0, e), ɵfromNgModule: !0 };
}
function Ss(e, ...n) {
  let t = [],
    r = new Set(),
    o,
    i = (s) => {
      t.push(s);
    };
  return (
    go(n, (s) => {
      let a = s;
      so(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && xl(o, i),
    t
  );
}
function xl(e, n) {
  for (let t = 0; t < e.length; t++) {
    let { ngModule: r, providers: o } = e[t];
    Ts(o, (i) => {
      n(i, r);
    });
  }
}
function so(e, n, t, r) {
  if (((e = ae(e)), !e)) return !1;
  let o = null,
    i = Ki(e),
    s = !i && Ke(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Ki(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) so(l, n, t, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      (go(i.imports, (u) => {
        so(u, n, t, r) && ((l ||= []), l.push(u));
      }),
        l !== void 0 && xl(l, n));
    }
    if (!a) {
      let l = ht(o) || (() => new o());
      (n({ provide: o, useFactory: l, deps: gt }, o),
        n({ provide: bs, useValue: o, multi: !0 }, o),
        n({ provide: Je, useValue: () => T(o), multi: !0 }, o));
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      Ts(c, (u) => {
        n(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Ts(e, n) {
  for (let t of e)
    (ps(t) && (t = t.ɵproviders), Array.isArray(t) ? Ts(t, n) : n(t));
}
var vh = A({ provide: String, useValue: A });
function Rl(e) {
  return e !== null && typeof e == "object" && vh in e;
}
function yh(e) {
  return !!(e && e.useExisting);
}
function Eh(e) {
  return !!(e && e.useFactory);
}
function ao(e) {
  return typeof e == "function";
}
var jn = new y(""),
  oo = {},
  Dl = {},
  Yi;
function Hn() {
  return (Yi === void 0 && (Yi = new Rn()), Yi);
}
var W = class {},
  mt = class extends W {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(n, t, r, o) {
      (super(),
        (this.parent = t),
        (this.source = r),
        (this.scopes = o),
        ns(n, (s) => this.processProvider(s)),
        this.records.set(Cs, Wt(void 0, this)),
        o.has("environment") && this.records.set(W, Wt(void 0, this)));
      let i = this.records.get(jn);
      (i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(bs, gt, { self: !0 }))));
    }
    retrieve(n, t) {
      let r = pt(t) || 0;
      try {
        return this.get(n, ft, r);
      } catch (o) {
        if (qt(o)) return o;
        throw o;
      }
    }
    destroy() {
      (Nn(this), (this._destroyed = !0));
      let n = N(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let t = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of t) r();
      } finally {
        (this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          N(n));
      }
    }
    onDestroy(n) {
      return (
        Nn(this),
        this._onDestroyHooks.push(n),
        () => this.removeOnDestroy(n)
      );
    }
    runInContext(n) {
      Nn(this);
      let t = Ae(this),
        r = ue(void 0),
        o;
      try {
        return n();
      } finally {
        (Ae(t), ue(r));
      }
    }
    get(n, t = ft, r) {
      if ((Nn(this), n.hasOwnProperty(wl))) return n[wl](this);
      let o = pt(r),
        i,
        s = Ae(this),
        a = ue(void 0);
      try {
        if (!(o & 4)) {
          let l = this.records.get(n);
          if (l === void 0) {
            let u = bh(n) && Pn(n);
            (u && this.injectableDefInScope(u)
              ? (l = Wt(ts(n), oo))
              : (l = null),
              this.records.set(n, l));
          }
          if (l != null) return this.hydrate(n, l, o);
        }
        let c = o & 2 ? Hn() : this.parent;
        return ((t = o & 8 && t === ft ? null : t), c.get(n, t));
      } catch (c) {
        let l = dh(c);
        throw l === -200 || l === -201 ? new v(l, null) : c;
      } finally {
        (ue(a), Ae(s));
      }
    }
    resolveInjectorInitializers() {
      let n = N(null),
        t = Ae(this),
        r = ue(void 0),
        o;
      try {
        let i = this.get(Je, gt, { self: !0 });
        for (let s of i) s();
      } finally {
        (Ae(t), ue(r), N(n));
      }
    }
    toString() {
      return "R3Injector[...]";
    }
    processProvider(n) {
      n = ae(n);
      let t = ao(n) ? n : ae(n && n.provide),
        r = wh(n);
      if (!ao(n) && n.multi === !0) {
        let o = this.records.get(t);
        (o ||
          ((o = Wt(void 0, oo, !0)),
          (o.factory = () => es(o.multi)),
          this.records.set(t, o)),
          (t = n),
          o.multi.push(n));
      }
      this.records.set(t, r);
    }
    hydrate(n, t, r) {
      let o = N(null);
      try {
        if (t.value === Dl) throw Is("");
        return (
          t.value === oo && ((t.value = Dl), (t.value = t.factory(void 0, r))),
          typeof t.value == "object" &&
            t.value &&
            Ch(t.value) &&
            this._ngOnDestroyHooks.add(t.value),
          t.value
        );
      } finally {
        N(o);
      }
    }
    injectableDefInScope(n) {
      if (!n.providedIn) return !1;
      let t = ae(n.providedIn);
      return typeof t == "string"
        ? t === "any" || this.scopes.has(t)
        : this.injectorDefTypes.has(t);
    }
    removeOnDestroy(n) {
      let t = this._onDestroyHooks.indexOf(n);
      t !== -1 && this._onDestroyHooks.splice(t, 1);
    }
  };
function ts(e) {
  let n = Pn(e),
    t = n !== null ? n.factory : ht(e);
  if (t !== null) return t;
  if (e instanceof y) throw new v(-204, !1);
  if (e instanceof Function) return Ih(e);
  throw new v(-204, !1);
}
function Ih(e) {
  if (e.length > 0) throw new v(-204, !1);
  let t = ch(e);
  return t !== null ? () => t.factory(e) : () => new e();
}
function wh(e) {
  if (Rl(e)) return Wt(void 0, e.useValue);
  {
    let n = Al(e);
    return Wt(n, oo);
  }
}
function Al(e, n, t) {
  let r;
  if (ao(e)) {
    let o = ae(e);
    return ht(o) || ts(o);
  } else if (Rl(e)) r = () => ae(e.useValue);
  else if (Eh(e)) r = () => e.useFactory(...es(e.deps || []));
  else if (yh(e))
    r = (o, i) => T(ae(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = ae(e && (e.useClass || e.provide));
    if (Dh(e)) r = () => new o(...es(e.deps));
    else return ht(o) || ts(o);
  }
  return r;
}
function Nn(e) {
  if (e.destroyed) throw new v(-205, !1);
}
function Wt(e, n, t = !1) {
  return { factory: e, value: n, multi: t ? [] : void 0 };
}
function Dh(e) {
  return !!e.deps;
}
function Ch(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function bh(e) {
  return (
    typeof e == "function" ||
    (typeof e == "object" && e.ngMetadataName === "InjectionToken")
  );
}
function ns(e, n) {
  for (let t of e)
    Array.isArray(t) ? ns(t, n) : t && ps(t) ? ns(t.ɵproviders, n) : n(t);
}
function ne(e, n) {
  let t;
  e instanceof mt ? (Nn(e), (t = e)) : (t = new Xi(e));
  let r,
    o = Ae(t),
    i = ue(void 0);
  try {
    return n();
  } finally {
    (Ae(o), ue(i));
  }
}
function Ol() {
  return _l() !== void 0 || ro() != null;
}
var Se = 0,
  M = 1,
  S = 2,
  J = 3,
  ve = 4,
  ye = 5,
  Un = 6,
  mo = 7,
  de = 8,
  It = 9,
  ke = 10,
  fe = 11,
  Gt = 12,
  Ms = 13,
  Qt = 14,
  Ee = 15,
  Zt = 16,
  wt = 17,
  Vn = 18,
  Xe = 19,
  _s = 20,
  Ve = 21,
  vo = 22,
  $n = 23,
  pe = 24,
  yo = 25,
  Yt = 26,
  Ie = 27,
  kl = 1;
var et = 7,
  Bn = 8,
  zn = 9,
  ce = 10;
function tt(e) {
  return Array.isArray(e) && typeof e[kl] == "object";
}
function Te(e) {
  return Array.isArray(e) && e[kl] === !0;
}
function Ns(e) {
  return (e.flags & 4) !== 0;
}
function Dt(e) {
  return e.componentOffset > -1;
}
function xs(e) {
  return (e.flags & 1) === 1;
}
function Ct(e) {
  return !!e.template;
}
function Kt(e) {
  return (e[S] & 512) !== 0;
}
function bt(e) {
  return (e[S] & 256) === 256;
}
var Pl = "svg",
  Ll = "math";
function Pe(e) {
  for (; Array.isArray(e); ) e = e[Se];
  return e;
}
function nt(e, n) {
  return Pe(n[e.index]);
}
function Fl(e, n) {
  return e.data[n];
}
function Be(e, n) {
  let t = n[e];
  return tt(t) ? t : t[Se];
}
function Eo(e) {
  return (e[S] & 128) === 128;
}
function jl(e) {
  return Te(e[J]);
}
function qn(e, n) {
  return n == null ? null : e[n];
}
function Rs(e) {
  e[wt] = 0;
}
function As(e) {
  e[S] & 1024 || ((e[S] |= 1024), Eo(e) && Gn(e));
}
function Wn(e) {
  return !!(e[S] & 9216 || e[pe]?.dirty);
}
function Io(e) {
  (e[ke].changeDetectionScheduler?.notify(8),
    e[S] & 64 && (e[S] |= 1024),
    Wn(e) && Gn(e));
}
function Gn(e) {
  e[ke].changeDetectionScheduler?.notify(0);
  let n = Ye(e);
  for (; n !== null && !(n[S] & 8192 || ((n[S] |= 8192), !Eo(n))); ) n = Ye(n);
}
function Os(e, n) {
  if (bt(e)) throw new v(911, !1);
  (e[Ve] === null && (e[Ve] = []), e[Ve].push(n));
}
function Hl(e, n) {
  if (e[Ve] === null) return;
  let t = e[Ve].indexOf(n);
  t !== -1 && e[Ve].splice(t, 1);
}
function Ye(e) {
  let n = e[J];
  return Te(n) ? n[J] : n;
}
var L = { lFrame: Kl(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var rs = !1;
function Ul() {
  return L.lFrame.elementDepthCount;
}
function Vl() {
  L.lFrame.elementDepthCount++;
}
function ks() {
  L.lFrame.elementDepthCount--;
}
function $l() {
  return L.bindingsEnabled;
}
function Bl() {
  return L.skipHydrationRootTNode !== null;
}
function Ps(e) {
  return L.skipHydrationRootTNode === e;
}
function Ls() {
  L.skipHydrationRootTNode = null;
}
function he() {
  return L.lFrame.lView;
}
function Fs() {
  return L.lFrame.tView;
}
function ze() {
  let e = js();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function js() {
  return L.lFrame.currentTNode;
}
function zl() {
  let e = L.lFrame,
    n = e.currentTNode;
  return e.isParent ? n : n.parent;
}
function Qn(e, n) {
  let t = L.lFrame;
  ((t.currentTNode = e), (t.isParent = n));
}
function Hs() {
  return L.lFrame.isParent;
}
function ql() {
  L.lFrame.isParent = !1;
}
function Us() {
  return rs;
}
function Vs(e) {
  let n = rs;
  return ((rs = e), n);
}
function Wl(e) {
  return (L.lFrame.bindingIndex = e);
}
function Gl() {
  return L.lFrame.inI18n;
}
function Ql(e, n) {
  let t = L.lFrame;
  ((t.bindingIndex = t.bindingRootIndex = e), wo(n));
}
function Zl() {
  return L.lFrame.currentDirectiveIndex;
}
function wo(e) {
  L.lFrame.currentDirectiveIndex = e;
}
function $s(e) {
  L.lFrame.currentQueryIndex = e;
}
function Sh(e) {
  let n = e[M];
  return n.type === 2 ? n.declTNode : n.type === 1 ? e[ye] : null;
}
function Bs(e, n, t) {
  if (t & 4) {
    let o = n,
      i = e;
    for (; (o = o.parent), o === null && !(t & 1); )
      if (((o = Sh(i)), o === null || ((i = i[Qt]), o.type & 10))) break;
    if (o === null) return !1;
    ((n = o), (e = i));
  }
  let r = (L.lFrame = Yl());
  return ((r.currentTNode = n), (r.lView = e), !0);
}
function Do(e) {
  let n = Yl(),
    t = e[M];
  ((L.lFrame = n),
    (n.currentTNode = t.firstChild),
    (n.lView = e),
    (n.tView = t),
    (n.contextLView = e),
    (n.bindingIndex = t.bindingStartIndex),
    (n.inI18n = !1));
}
function Yl() {
  let e = L.lFrame,
    n = e === null ? null : e.child;
  return n === null ? Kl(e) : n;
}
function Kl(e) {
  let n = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return (e !== null && (e.child = n), n);
}
function Jl() {
  let e = L.lFrame;
  return ((L.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var zs = Jl;
function Co() {
  let e = Jl();
  ((e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function Xl() {
  return L.lFrame.selectedIndex;
}
function rt(e) {
  L.lFrame.selectedIndex = e;
}
function eu() {
  return L.lFrame.currentNamespace;
}
var tu = !0;
function qs() {
  return tu;
}
function Ws(e) {
  tu = e;
}
function os(e, n = null, t = null, r) {
  let o = Gs(e, n, t, r);
  return (o.resolveInjectorInitializers(), o);
}
function Gs(e, n = null, t = null, r, o = new Set()) {
  let i = [t || gt, Nl(e)],
    s;
  return new mt(i, n || Hn(), s || null, o);
}
var Oe = class e {
    static THROW_IF_NOT_FOUND = ft;
    static NULL = new Rn();
    static create(n, t) {
      if (Array.isArray(n)) return os({ name: "" }, t, n, "");
      {
        let r = n.name ?? "";
        return os({ name: r }, n.parent, n.providers, r);
      }
    }
    static ɵprov = E({ token: e, providedIn: "any", factory: () => T(Cs) });
    static __NG_ELEMENT_ID__ = -1;
  },
  Q = new y(""),
  St = (() => {
    class e {
      static __NG_ELEMENT_ID__ = Th;
      static __NG_ENV_ID__ = (t) => t;
    }
    return e;
  })(),
  is = class extends St {
    _lView;
    constructor(n) {
      (super(), (this._lView = n));
    }
    get destroyed() {
      return bt(this._lView);
    }
    onDestroy(n) {
      let t = this._lView;
      return (Os(t, n), () => Hl(t, n));
    }
  };
function Th() {
  return new is(he());
}
var Qs = !1,
  nu = new y(""),
  qe = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      destroyed = !1;
      pendingTask = new Y(!1);
      debugTaskTracker = p(nu, { optional: !0 });
      get hasPendingTasks() {
        return this.destroyed ? !1 : this.pendingTask.value;
      }
      get hasPendingTasksObservable() {
        return this.destroyed
          ? new x((t) => {
              (t.next(!1), t.complete());
            })
          : this.pendingTask;
      }
      add() {
        !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
        let t = this.taskId++;
        return (this.pendingTasks.add(t), this.debugTaskTracker?.add(t), t);
      }
      has(t) {
        return this.pendingTasks.has(t);
      }
      remove(t) {
        (this.pendingTasks.delete(t),
          this.debugTaskTracker?.remove(t),
          this.pendingTasks.size === 0 &&
            this.hasPendingTasks &&
            this.pendingTask.next(!1));
      }
      ngOnDestroy() {
        (this.pendingTasks.clear(),
          this.hasPendingTasks && this.pendingTask.next(!1),
          (this.destroyed = !0),
          this.pendingTask.unsubscribe());
      }
      static ɵprov = E({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  ss = class extends te {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(n = !1) {
      (super(),
        (this.__isAsync = n),
        Ol() &&
          ((this.destroyRef = p(St, { optional: !0 }) ?? void 0),
          (this.pendingTasks = p(qe, { optional: !0 }) ?? void 0)));
    }
    emit(n) {
      let t = N(null);
      try {
        super.next(n);
      } finally {
        N(t);
      }
    }
    subscribe(n, t, r) {
      let o = n,
        i = t || (() => null),
        s = r;
      if (n && typeof n == "object") {
        let c = n;
        ((o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c)));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return (n instanceof q && n.add(a), a);
    }
    wrapInTimeout(n) {
      return (t) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            n(t);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  oe = ss;
function co(...e) {}
function Zs(e) {
  let n, t;
  function r() {
    e = co;
    try {
      (t !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(t),
        n !== void 0 && clearTimeout(n));
    } catch (o) {}
  }
  return (
    (n = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == "function" &&
      (t = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function ru(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = co;
    }
  );
}
var Ys = "isAngularZone",
  An = Ys + "_ID",
  Mh = 0,
  z = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new oe(!1);
    onMicrotaskEmpty = new oe(!1);
    onStable = new oe(!1);
    onError = new oe(!1);
    constructor(n) {
      let {
        enableLongStackTrace: t = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Qs,
      } = n;
      if (typeof Zone > "u") throw new v(908, !1);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        xh(s));
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Ys) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new v(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new v(909, !1);
    }
    run(n, t, r) {
      return this._inner.run(n, t, r);
    }
    runTask(n, t, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, n, _h, co, co);
      try {
        return i.runTask(s, t, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(n, t, r) {
      return this._inner.runGuarded(n, t, r);
    }
    runOutsideAngular(n) {
      return this._outer.run(n);
    }
  },
  _h = {};
function Ks(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function Nh(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function n() {
    Zs(() => {
      ((e.callbackScheduled = !1),
        as(e),
        (e.isCheckStableRunning = !0),
        Ks(e),
        (e.isCheckStableRunning = !1));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        n();
      })
    : e._outer.run(() => {
        n();
      }),
    as(e));
}
function xh(e) {
  let n = () => {
      Nh(e);
    },
    t = Mh++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Ys]: !0, [An]: t, [An + t]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (Rh(c)) return r.invokeTask(i, s, a, c);
      try {
        return (Cl(e), r.invokeTask(i, s, a, c));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          n(),
          bl(e));
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return (Cl(e), r.invoke(i, s, a, c, l));
      } finally {
        (e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Ah(c) &&
          n(),
          bl(e));
      }
    },
    onHasTask: (r, o, i, s) => {
      (r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), as(e), Ks(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      !1
    ),
  });
}
function as(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Cl(e) {
  (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function bl(e) {
  (e._nesting--, Ks(e));
}
var On = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new oe();
  onMicrotaskEmpty = new oe();
  onStable = new oe();
  onError = new oe();
  run(n, t, r) {
    return n.apply(t, r);
  }
  runGuarded(n, t, r) {
    return n.apply(t, r);
  }
  runOutsideAngular(n) {
    return n();
  }
  runTask(n, t, r, o) {
    return n.apply(t, r);
  }
};
function Rh(e) {
  return ou(e, "__ignore_ng_zone__");
}
function Ah(e) {
  return ou(e, "__scheduler_tick__");
}
function ou(e, n) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0;
}
var $e = class {
    _console = console;
    handleError(n) {
      this._console.error("ERROR", n);
    }
  },
  We = new y("", {
    factory: () => {
      let e = p(z),
        n = p(W),
        t;
      return (r) => {
        e.runOutsideAngular(() => {
          n.destroyed && !t
            ? setTimeout(() => {
                throw r;
              })
            : ((t ??= n.get($e)), t.handleError(r));
        });
      };
    },
  }),
  iu = {
    provide: Je,
    useValue: () => {
      let e = p($e, { optional: !0 });
    },
    multi: !0,
  };
function Jt(e, n) {
  let [t, r, o] = Pi(e, n?.equal),
    i = t,
    s = i[le];
  return ((i.set = r), (i.update = o), (i.asReadonly = su.bind(i)), i);
}
function su() {
  let e = this[le];
  if (e.readonlyFn === void 0) {
    let n = () => this();
    ((n[le] = e), (e.readonlyFn = n));
  }
  return e.readonlyFn;
}
var vt = class {},
  Xt = new y("", { factory: () => !0 });
var bo = new y("");
var Js = (() => {
    class e {
      static ɵprov = E({
        token: e,
        providedIn: "root",
        factory: () => new cs(),
      });
    }
    return e;
  })(),
  cs = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(n) {
      (this.enqueue(n), this.schedule(n));
    }
    schedule(n) {
      n.dirty && this.dirtyEffectCount++;
    }
    remove(n) {
      let t = n.zone,
        r = this.queues.get(t);
      r.has(n) && (r.delete(n), n.dirty && this.dirtyEffectCount--);
    }
    enqueue(n) {
      let t = n.zone;
      this.queues.has(t) || this.queues.set(t, new Set());
      let r = this.queues.get(t);
      r.has(n) || r.add(n);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let n = !1;
        for (let [t, r] of this.queues)
          t === null
            ? (n ||= this.flushQueue(r))
            : (n ||= t.run(() => this.flushQueue(r)));
        n || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(n) {
      let t = !1;
      for (let r of n) r.dirty && (this.dirtyEffectCount--, (t = !0), r.run());
      return t;
    }
  },
  ls = class {
    [le];
    constructor(n) {
      this[le] = n;
    }
    destroy() {
      this[le].destroy();
    }
  };
function Ho(e) {
  return { toString: e }.toString();
}
function Gh(e) {
  return typeof e == "function";
}
function Au(e, n, t, r) {
  n !== null ? n.applyValueToInputSignal(n, r) : (e[t] = r);
}
var _o = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(n, t, r) {
      ((this.previousValue = n),
        (this.currentValue = t),
        (this.firstChange = r));
    }
    isFirstChange() {
      return this.firstChange;
    }
  },
  ya = (() => {
    let e = () => Ou;
    return ((e.ngInherit = !0), e);
  })();
function Ou(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = Zh), Qh);
}
function Qh() {
  let e = Pu(this),
    n = e?.current;
  if (n) {
    let t = e.previous;
    if (t === Et) e.previous = n;
    else for (let r in n) t[r] = n[r];
    ((e.current = null), this.ngOnChanges(n));
  }
}
function Zh(e, n, t, r, o) {
  let i = this.declaredInputs[r],
    s = Pu(e) || Yh(e, { previous: Et, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  ((a[i] = new _o(l && l.currentValue, t, c === Et)), Au(e, n, o, t));
}
var ku = "__ngSimpleChanges__";
function Pu(e) {
  return e[ku] || null;
}
function Yh(e, n) {
  return (e[ku] = n);
}
var au = [];
var j = function (e, n = null, t) {
    for (let r = 0; r < au.length; r++) {
      let o = au[r];
      o(e, n, t);
    }
  },
  k = (function (e) {
    return (
      (e[(e.TemplateCreateStart = 0)] = "TemplateCreateStart"),
      (e[(e.TemplateCreateEnd = 1)] = "TemplateCreateEnd"),
      (e[(e.TemplateUpdateStart = 2)] = "TemplateUpdateStart"),
      (e[(e.TemplateUpdateEnd = 3)] = "TemplateUpdateEnd"),
      (e[(e.LifecycleHookStart = 4)] = "LifecycleHookStart"),
      (e[(e.LifecycleHookEnd = 5)] = "LifecycleHookEnd"),
      (e[(e.OutputStart = 6)] = "OutputStart"),
      (e[(e.OutputEnd = 7)] = "OutputEnd"),
      (e[(e.BootstrapApplicationStart = 8)] = "BootstrapApplicationStart"),
      (e[(e.BootstrapApplicationEnd = 9)] = "BootstrapApplicationEnd"),
      (e[(e.BootstrapComponentStart = 10)] = "BootstrapComponentStart"),
      (e[(e.BootstrapComponentEnd = 11)] = "BootstrapComponentEnd"),
      (e[(e.ChangeDetectionStart = 12)] = "ChangeDetectionStart"),
      (e[(e.ChangeDetectionEnd = 13)] = "ChangeDetectionEnd"),
      (e[(e.ChangeDetectionSyncStart = 14)] = "ChangeDetectionSyncStart"),
      (e[(e.ChangeDetectionSyncEnd = 15)] = "ChangeDetectionSyncEnd"),
      (e[(e.AfterRenderHooksStart = 16)] = "AfterRenderHooksStart"),
      (e[(e.AfterRenderHooksEnd = 17)] = "AfterRenderHooksEnd"),
      (e[(e.ComponentStart = 18)] = "ComponentStart"),
      (e[(e.ComponentEnd = 19)] = "ComponentEnd"),
      (e[(e.DeferBlockStateStart = 20)] = "DeferBlockStateStart"),
      (e[(e.DeferBlockStateEnd = 21)] = "DeferBlockStateEnd"),
      (e[(e.DynamicComponentStart = 22)] = "DynamicComponentStart"),
      (e[(e.DynamicComponentEnd = 23)] = "DynamicComponentEnd"),
      (e[(e.HostBindingsUpdateStart = 24)] = "HostBindingsUpdateStart"),
      (e[(e.HostBindingsUpdateEnd = 25)] = "HostBindingsUpdateEnd"),
      e
    );
  })(k || {});
function Kh(e, n, t) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = n.type.prototype;
  if (r) {
    let s = Ou(n);
    ((t.preOrderHooks ??= []).push(e, s),
      (t.preOrderCheckHooks ??= []).push(e, s));
  }
  (o && (t.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((t.preOrderHooks ??= []).push(e, i),
      (t.preOrderCheckHooks ??= []).push(e, i)));
}
function Jh(e, n) {
  for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
    let i = e.data[t].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    (s && (e.contentHooks ??= []).push(-t, s),
      a &&
        ((e.contentHooks ??= []).push(t, a),
        (e.contentCheckHooks ??= []).push(t, a)),
      c && (e.viewHooks ??= []).push(-t, c),
      l &&
        ((e.viewHooks ??= []).push(t, l), (e.viewCheckHooks ??= []).push(t, l)),
      u != null && (e.destroyHooks ??= []).push(t, u));
  }
}
function So(e, n, t) {
  Lu(e, n, 3, t);
}
function To(e, n, t, r) {
  (e[S] & 3) === t && Lu(e, n, t, r);
}
function Xs(e, n) {
  let t = e[S];
  (t & 3) === n && ((t &= 16383), (t += 1), (e[S] = t));
}
function Lu(e, n, t, r) {
  let o = r !== void 0 ? e[wt] & 65535 : 0,
    i = r ?? -1,
    s = n.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof n[c + 1] == "number") {
      if (((a = n[c]), r != null && a >= r)) break;
    } else
      (n[c] < 0 && (e[wt] += 65536),
        (a < i || i == -1) &&
          (Xh(e, t, n, c), (e[wt] = (e[wt] & 4294901760) + c + 2)),
        c++);
}
function cu(e, n) {
  j(k.LifecycleHookStart, e, n);
  let t = N(null);
  try {
    n.call(e);
  } finally {
    (N(t), j(k.LifecycleHookEnd, e, n));
  }
}
function Xh(e, n, t, r) {
  let o = t[r] < 0,
    i = t[r + 1],
    s = o ? -t[r] : t[r],
    a = e[s];
  o
    ? e[S] >> 14 < e[wt] >> 16 &&
      (e[S] & 3) === n &&
      ((e[S] += 16384), cu(a, i))
    : cu(a, i);
}
var tn = -1,
  Jn = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(n, t, r, o) {
      ((this.factory = n),
        (this.name = o),
        (this.canSeeViewProviders = t),
        (this.injectImpl = r));
    }
  };
function eg(e) {
  return (e.flags & 8) !== 0;
}
function tg(e) {
  return (e.flags & 16) !== 0;
}
function ng(e, n, t) {
  let r = 0;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = t[r++],
        s = t[r++],
        a = t[r++];
      e.setAttribute(n, s, a, i);
    } else {
      let i = o,
        s = t[++r];
      (og(i) ? e.setProperty(n, i, s) : e.setAttribute(n, i, s), r++);
    }
  }
  return r;
}
function rg(e) {
  return e === 3 || e === 4 || e === 6;
}
function og(e) {
  return e.charCodeAt(0) === 64;
}
function Ea(e, n) {
  if (!(n === null || n.length === 0))
    if (e === null || e.length === 0) e = n.slice();
    else {
      let t = -1;
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        typeof o == "number"
          ? (t = o)
          : t === 0 ||
            (t === -1 || t === 2
              ? lu(e, t, o, null, n[++r])
              : lu(e, t, o, null, null));
      }
    }
  return e;
}
function lu(e, n, t, r, o) {
  let i = 0,
    s = e.length;
  if (n === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === n) {
          s = -1;
          break;
        } else if (a > n) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === t) {
      o !== null && (e[i + 1] = o);
      return;
    }
    (i++, o !== null && i++);
  }
  (s !== -1 && (e.splice(s, 0, n), (i = s + 1)),
    e.splice(i++, 0, t),
    o !== null && e.splice(i++, 0, o));
}
function Fu(e) {
  return e !== tn;
}
function No(e) {
  return e & 32767;
}
function ig(e) {
  return e >> 16;
}
function xo(e, n) {
  let t = ig(e),
    r = n;
  for (; t > 0; ) ((r = r[Qt]), t--);
  return r;
}
var ra = !0;
function uu(e) {
  let n = ra;
  return ((ra = e), n);
}
var sg = 256,
  ju = sg - 1,
  Hu = 5,
  ag = 0,
  Le = {};
function cg(e, n, t) {
  let r;
  (typeof t == "string"
    ? (r = t.charCodeAt(0) || 0)
    : t.hasOwnProperty(yt) && (r = t[yt]),
    r == null && (r = t[yt] = ag++));
  let o = r & ju,
    i = 1 << o;
  n.data[e + (o >> Hu)] |= i;
}
function Uu(e, n) {
  let t = Vu(e, n);
  if (t !== -1) return t;
  let r = n[M];
  r.firstCreatePass &&
    ((e.injectorIndex = n.length),
    ea(r.data, e),
    ea(n, null),
    ea(r.blueprint, null));
  let o = Ia(e, n),
    i = e.injectorIndex;
  if (Fu(o)) {
    let s = No(o),
      a = xo(o, n),
      c = a[M].data;
    for (let l = 0; l < 8; l++) n[i + l] = a[s + l] | c[s + l];
  }
  return ((n[i + 8] = o), i);
}
function ea(e, n) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function Vu(e, n) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    n[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ia(e, n) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let t = 0,
    r = null,
    o = n;
  for (; o !== null; ) {
    if (((r = Wu(o)), r === null)) return tn;
    if ((t++, (o = o[Qt]), r.injectorIndex !== -1))
      return r.injectorIndex | (t << 16);
  }
  return tn;
}
function lg(e, n, t) {
  cg(e, n, t);
}
function $u(e, n, t) {
  if (t & 8 || e !== void 0) return e;
  ho(n, "NodeInjector");
}
function Bu(e, n, t, r) {
  if ((t & 8 && r === void 0 && (r = null), (t & 3) === 0)) {
    let o = e[It],
      i = ue(void 0);
    try {
      return o ? o.get(n, r, t & 8) : ws(n, r, t & 8);
    } finally {
      ue(i);
    }
  }
  return $u(r, n, t);
}
function zu(e, n, t, r = 0, o) {
  if (e !== null) {
    if (n[S] & 2048 && !(r & 2)) {
      let s = hg(e, n, t, r, Le);
      if (s !== Le) return s;
    }
    let i = qu(e, n, t, r, Le);
    if (i !== Le) return i;
  }
  return Bu(n, t, r, o);
}
function qu(e, n, t, r, o) {
  let i = fg(t);
  if (typeof i == "function") {
    if (!Bs(n, e, r)) return r & 1 ? $u(o, t, r) : Bu(n, t, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) ho(t);
      else return s;
    } finally {
      zs();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Vu(e, n),
      c = tn,
      l = r & 1 ? n[Ee][ye] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? Ia(e, n) : n[a + 8]),
      c === tn || !fu(r, !1)
        ? (a = -1)
        : ((s = n[M]), (a = No(c)), (n = xo(c, n))));
      a !== -1;
    ) {
      let u = n[M];
      if (du(i, a, u.data)) {
        let d = ug(a, n, t, s, r, l);
        if (d !== Le) return d;
      }
      ((c = n[a + 8]),
        c !== tn && fu(r, n[M].data[a + 8] === l) && du(i, a, n)
          ? ((s = u), (a = No(c)), (n = xo(c, n)))
          : (a = -1));
    }
  }
  return o;
}
function ug(e, n, t, r, o, i) {
  let s = n[M],
    a = s.data[e + 8],
    c = r == null ? Dt(a) && ra : r != s && (a.type & 3) !== 0,
    l = o & 1 && i === a,
    u = dg(a, s, t, c, l);
  return u !== null ? oa(n, s, u, a, o) : Le;
}
function dg(e, n, t, r, o) {
  let i = e.providerIndexes,
    s = n.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    h = o ? a + u : l;
  for (let f = d; f < h; f++) {
    let m = s[f];
    if ((f < c && t === m) || (f >= c && m.type === t)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && Ct(f) && f.type === t) return c;
  }
  return null;
}
function oa(e, n, t, r, o) {
  let i = e[t],
    s = n.data;
  if (i instanceof Jn) {
    let a = i;
    if (a.resolving) throw Is("");
    let c = uu(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[t].type || s[t],
      u,
      d = a.injectImpl ? ue(a.injectImpl) : null,
      h = Bs(e, r, 0);
    try {
      ((i = e[t] = a.factory(void 0, o, s, e, r)),
        n.firstCreatePass && t >= r.directiveStart && Kh(t, s[t], n));
    } finally {
      (d !== null && ue(d), uu(c), (a.resolving = !1), zs());
    }
  }
  return i;
}
function fg(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let n = e.hasOwnProperty(yt) ? e[yt] : void 0;
  return typeof n == "number" ? (n >= 0 ? n & ju : pg) : n;
}
function du(e, n, t) {
  let r = 1 << e;
  return !!(t[n + (e >> Hu)] & r);
}
function fu(e, n) {
  return !(e & 2) && !(e & 1 && n);
}
var Tt = class {
  _tNode;
  _lView;
  constructor(n, t) {
    ((this._tNode = n), (this._lView = t));
  }
  get(n, t, r) {
    return zu(this._tNode, this._lView, n, pt(r), t);
  }
};
function pg() {
  return new Tt(ze(), he());
}
function nr(e) {
  return Ho(() => {
    let n = e.prototype.constructor,
      t = n[xn] || ia(n),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[xn] || ia(o);
      if (i && i !== t) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function ia(e) {
  return ds(e)
    ? () => {
        let n = ia(ae(e));
        return n && n();
      }
    : ht(e);
}
function hg(e, n, t, r, o) {
  let i = e,
    s = n;
  for (; i !== null && s !== null && s[S] & 2048 && !Kt(s); ) {
    let a = qu(i, s, t, r | 2, Le);
    if (a !== Le) return a;
    let c = i.parent;
    if (!c) {
      let l = s[_s];
      if (l) {
        let u = l.get(t, Le, r & -5);
        if (u !== Le) return u;
      }
      ((c = Wu(s)), (s = s[Qt]));
    }
    i = c;
  }
  return o;
}
function Wu(e) {
  let n = e[M],
    t = n.type;
  return t === 2 ? n.declTNode : t === 1 ? e[ye] : null;
}
function gg() {
  return wa(ze(), he());
}
function wa(e, n) {
  return new Gu(nt(e, n));
}
var Gu = (() => {
  class e {
    nativeElement;
    constructor(t) {
      this.nativeElement = t;
    }
    static __NG_ELEMENT_ID__ = gg;
  }
  return e;
})();
function Qu(e) {
  return (e.flags & 128) === 128;
}
var Da = (function (e) {
    return (
      (e[(e.OnPush = 0)] = "OnPush"),
      (e[(e.Eager = 1)] = "Eager"),
      (e[(e.Default = 1)] = "Default"),
      e
    );
  })(Da || {}),
  Zu = new Map(),
  mg = 0;
function vg() {
  return mg++;
}
function yg(e) {
  Zu.set(e[Xe], e);
}
function sa(e) {
  Zu.delete(e[Xe]);
}
var pu = "__ngContext__";
function Xn(e, n) {
  tt(n) ? ((e[pu] = n[Xe]), yg(n)) : (e[pu] = n);
}
function Yu(e) {
  return Ju(e[Gt]);
}
function Ku(e) {
  return Ju(e[ve]);
}
function Ju(e) {
  for (; e !== null && !Te(e); ) e = e[ve];
  return e;
}
var Eg;
function Ca(e) {
  Eg = e;
}
var Uo = new y("", { factory: () => Ig }),
  Ig = "ng";
var Vo = new y(""),
  rr = new y("", { providedIn: "platform", factory: () => "unknown" });
var $o = new y("", {
  factory: () =>
    p(Q).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var Xu = !1,
  ed = new y("", { factory: () => Xu });
function ba(e) {
  return (e.flags & 32) === 32;
}
var wg = () => null;
function td(e, n, t = !1) {
  return wg(e, n, t);
}
function nd(e, n) {
  let t = e.contentQueries;
  if (t !== null) {
    let r = N(null);
    try {
      for (let o = 0; o < t.length; o += 2) {
        let i = t[o],
          s = t[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          ($s(i), a.contentQueries(2, n[s], s));
        }
      }
    } finally {
      N(r);
    }
  }
}
function aa(e, n, t) {
  $s(0);
  let r = N(null);
  try {
    n(e, t);
  } finally {
    N(r);
  }
}
function rd(e, n, t) {
  if (Ns(n)) {
    let r = N(null);
    try {
      let o = n.directiveStart,
        i = n.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = t[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      N(r);
    }
  }
}
var _e = (function (e) {
  return (
    (e[(e.Emulated = 0)] = "Emulated"),
    (e[(e.None = 2)] = "None"),
    (e[(e.ShadowDom = 3)] = "ShadowDom"),
    (e[(e.ExperimentalIsolatedShadowDom = 4)] =
      "ExperimentalIsolatedShadowDom"),
    e
  );
})(_e || {});
function Dg(e, n) {
  return e.createText(n);
}
function od(e, n, t) {
  return e.createElement(n, t);
}
function Ro(e, n, t, r, o) {
  e.insertBefore(n, t, r, o);
}
function id(e, n, t) {
  e.appendChild(n, t);
}
function hu(e, n, t, r, o) {
  r !== null ? Ro(e, n, t, r, o) : id(e, n, t);
}
function Cg(e, n, t, r) {
  e.removeChild(null, n, t, r);
}
function bg(e, n, t) {
  e.setAttribute(n, "style", t);
}
function Sg(e, n, t) {
  t === "" ? e.removeAttribute(n, "class") : e.setAttribute(n, "class", t);
}
function sd(e, n, t) {
  let { mergedAttrs: r, classes: o, styles: i } = t;
  (r !== null && ng(e, n, r),
    o !== null && Sg(e, n, o),
    i !== null && bg(e, n, i));
}
function ad(e) {
  return e instanceof Function ? e() : e;
}
function Tg(e, n, t) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(n, t);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = n.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    t = o + 1;
  }
}
var cd = "ng-template";
function Mg(e, n, t, r) {
  let o = 0;
  if (r) {
    for (; o < n.length && typeof n[o] == "string"; o += 2)
      if (n[o] === "class" && Tg(n[o + 1].toLowerCase(), t, 0) !== -1)
        return !0;
  } else if (Sa(e)) return !1;
  if (((o = n.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < n.length && typeof (i = n[o]) == "string"; )
      if (i.toLowerCase() === t) return !0;
  }
  return !1;
}
function Sa(e) {
  return e.type === 4 && e.value !== cd;
}
function _g(e, n, t) {
  let r = e.type === 4 && !t ? cd : e.value;
  return n === r;
}
function Ng(e, n, t) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Ag(o) : 0,
    s = !1;
  for (let a = 0; a < n.length; a++) {
    let c = n[a];
    if (typeof c == "number") {
      if (!s && !Me(r) && !Me(c)) return !1;
      if (s && Me(c)) continue;
      ((s = !1), (r = c | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !_g(e, c, t)) || (c === "" && n.length === 1))
        ) {
          if (Me(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Mg(e, o, c, t)) {
          if (Me(r)) return !1;
          s = !0;
        }
      } else {
        let l = n[++a],
          u = xg(c, o, Sa(e), t);
        if (u === -1) {
          if (Me(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > i ? (d = "") : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (Me(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return Me(r) || s;
}
function Me(e) {
  return (e & 1) === 0;
}
function xg(e, n, t, r) {
  if (n === null) return -1;
  let o = 0;
  if (r || !t) {
    let i = !1;
    for (; o < n.length; ) {
      let s = n[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = n[++o];
        for (; typeof a == "string"; ) a = n[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Og(n, e);
}
function Rg(e, n, t = !1) {
  for (let r = 0; r < n.length; r++) if (Ng(e, n[r], t)) return !0;
  return !1;
}
function Ag(e) {
  for (let n = 0; n < e.length; n++) {
    let t = e[n];
    if (rg(t)) return n;
  }
  return e.length;
}
function Og(e, n) {
  let t = e.indexOf(4);
  if (t > -1)
    for (t++; t < e.length; ) {
      let r = e[t];
      if (typeof r == "number") return -1;
      if (r === n) return t;
      t++;
    }
  return -1;
}
function gu(e, n) {
  return e ? ":not(" + n.trim() + ")" : n;
}
function kg(e) {
  let n = e[0],
    t = 1,
    r = 2,
    o = "",
    i = !1;
  for (; t < e.length; ) {
    let s = e[t];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++t];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      (o !== "" && !Me(s) && ((n += gu(i, o)), (o = "")),
        (r = s),
        (i = i || !Me(r)));
    t++;
  }
  return (o !== "" && (n += gu(i, o)), n);
}
function Pg(e) {
  return e.map(kg).join(",");
}
function Lg(e) {
  let n = [],
    t = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && n.push(i, e[++r]) : o === 8 && t.push(i);
    else {
      if (!Me(o)) break;
      o = i;
    }
    r++;
  }
  return (t.length && n.push(1, ...t), n);
}
var Ta = {};
function ld(e, n, t, r, o, i, s, a, c, l, u) {
  let d = Ie + r,
    h = d + o,
    f = Fg(d, h),
    m = typeof l == "function" ? l() : l;
  return (f[M] = {
    type: e,
    blueprint: f,
    template: t,
    queries: null,
    viewQuery: a,
    declTNode: n,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Fg(e, n) {
  let t = [];
  for (let r = 0; r < n; r++) t.push(r < e ? null : Ta);
  return t;
}
function jg(e) {
  let n = e.tView;
  return n === null || n.incompleteFirstPass
    ? (e.tView = ld(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : n;
}
function ud(e, n, t, r, o, i, s, a, c, l, u) {
  let d = n.blueprint.slice();
  return (
    (d[Se] = o),
    (d[S] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[S] & 2048)) && (d[S] |= 2048),
    Rs(d),
    (d[J] = d[Qt] = e),
    (d[de] = t),
    (d[ke] = s || (e && e[ke])),
    (d[fe] = a || (e && e[fe])),
    (d[It] = c || (e && e[It]) || null),
    (d[ye] = i),
    (d[Xe] = vg()),
    (d[Un] = u),
    (d[_s] = l),
    (d[Ee] = n.type == 2 ? e[Ee] : d),
    d
  );
}
function Hg(e, n, t) {
  let r = nt(n, e),
    o = jg(t),
    i = e[ke].rendererFactory,
    s = pd(
      e,
      ud(
        e,
        o,
        null,
        dd(t),
        r,
        n,
        null,
        i.createRenderer(r, t),
        null,
        null,
        null,
      ),
    );
  return (e[n.index] = s);
}
function dd(e) {
  let n = 16;
  return (e.signals ? (n = 4096) : e.onPush && (n = 64), n);
}
function fd(e, n, t, r) {
  if (t === 0) return -1;
  let o = n.length;
  for (let i = 0; i < t; i++)
    (n.push(r), e.blueprint.push(r), e.data.push(null));
  return o;
}
function pd(e, n) {
  return (e[Gt] ? (e[Ms][ve] = n) : (e[Gt] = n), (e[Ms] = n), n);
}
function Ug(e, n, t, r) {
  if (!r)
    if ((n[S] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && So(n, i, t);
    } else {
      let i = e.preOrderHooks;
      i !== null && To(n, i, 0, t);
    }
  rt(t);
}
var Bo = (function (e) {
  return (
    (e[(e.None = 0)] = "None"),
    (e[(e.SignalBased = 1)] = "SignalBased"),
    (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    e
  );
})(Bo || {});
function ca(e, n, t, r) {
  let o = N(null);
  try {
    let [i, s, a] = e.inputs[t],
      c = null;
    ((s & Bo.SignalBased) !== 0 && (c = n[i][le]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(n, r)),
      e.setInput !== null ? e.setInput(n, c, r, t, i) : Au(n, c, i, r));
  } finally {
    N(o);
  }
}
var Nt = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(Nt || {}),
  Vg;
function Ma(e, n) {
  return Vg(e, n);
}
var cM =
  typeof document < "u" &&
  typeof document?.documentElement?.getAnimations == "function";
var la = new WeakMap(),
  Zn = new WeakSet();
function $g(e, n) {
  let t = la.get(e);
  if (!t || t.length === 0) return;
  let r = n.parentNode,
    o = n.previousSibling;
  for (let i = t.length - 1; i >= 0; i--) {
    let s = t[i],
      a = s.parentNode;
    s === n
      ? (t.splice(i, 1),
        Zn.add(s),
        s.dispatchEvent(
          new CustomEvent("animationend", { detail: { cancel: !0 } }),
        ))
      : ((o && s === o) || (a && r && a !== r)) &&
        (t.splice(i, 1),
        s.dispatchEvent(
          new CustomEvent("animationend", { detail: { cancel: !0 } }),
        ),
        s.parentNode?.removeChild(s));
  }
}
function Bg(e, n) {
  let t = la.get(e);
  t ? t.includes(n) || t.push(n) : la.set(e, [n]);
}
var nn = new Set(),
  _a = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(_a || {}),
  sn = new y(""),
  mu = new Set();
function zo(e) {
  mu.has(e) ||
    (mu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var hd = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = E({ token: e, providedIn: "root", factory: () => new e() });
  }
  return e;
})();
var zg = new y("", {
  factory: () => ({
    queue: new Set(),
    isScheduled: !1,
    scheduler: null,
    injector: p(W),
  }),
});
function gd(e, n, t) {
  let r = e.get(zg);
  if (Array.isArray(n))
    for (let o of n) (r.queue.add(o), t?.detachedLeaveAnimationFns?.push(o));
  else (r.queue.add(n), t?.detachedLeaveAnimationFns?.push(n));
  r.scheduler && r.scheduler(e);
}
function qg(e, n) {
  for (let [t, r] of n) gd(e, r.animateFns);
}
function vu(e, n, t, r) {
  let o = e?.[Yt]?.enter;
  n !== null && o && o.has(t.index) && qg(r, o);
}
function en(e, n, t, r, o, i, s, a) {
  if (o != null) {
    let c,
      l = !1;
    Te(o) ? (c = o) : tt(o) && ((l = !0), (o = o[Se]));
    let u = Pe(o);
    (e === 0 && r !== null
      ? (vu(a, r, i, t), s == null ? id(n, r, u) : Ro(n, r, u, s || null, !0))
      : e === 1 && r !== null
        ? (vu(a, r, i, t), Ro(n, r, u, s || null, !0), $g(i, u))
        : e === 2
          ? (a?.[Yt]?.leave?.has(i.index) && Bg(i, u),
            Zn.delete(u),
            yu(a, i, t, (d) => {
              if (Zn.has(u)) {
                Zn.delete(u);
                return;
              }
              Cg(n, u, l, d);
            }))
          : e === 3 &&
            (Zn.delete(u),
            yu(a, i, t, () => {
              n.destroyNode(u);
            })),
      c != null && om(n, e, t, c, i, r, s));
  }
}
function Wg(e, n) {
  (md(e, n), (n[Se] = null), (n[ye] = null));
}
function Gg(e, n, t, r, o, i) {
  ((r[Se] = o), (r[ye] = n), qo(e, r, t, 1, o, i));
}
function md(e, n) {
  (n[ke].changeDetectionScheduler?.notify(9), qo(e, n, n[fe], 2, null, null));
}
function Qg(e) {
  let n = e[Gt];
  if (!n) return ta(e[M], e);
  for (; n; ) {
    let t = null;
    if (tt(n)) t = n[Gt];
    else {
      let r = n[ce];
      r && (t = r);
    }
    if (!t) {
      for (; n && !n[ve] && n !== e; ) (tt(n) && ta(n[M], n), (n = n[J]));
      (n === null && (n = e), tt(n) && ta(n[M], n), (t = n && n[ve]));
    }
    n = t;
  }
}
function Na(e, n) {
  let t = e[zn],
    r = t.indexOf(n);
  t.splice(r, 1);
}
function vd(e, n) {
  if (bt(n)) return;
  let t = n[fe];
  (t.destroyNode && qo(e, n, t, 3, null, null), Qg(n));
}
function ta(e, n) {
  if (bt(n)) return;
  let t = N(null);
  try {
    ((n[S] &= -129),
      (n[S] |= 256),
      n[pe] && Cn(n[pe]),
      Kg(e, n),
      Yg(e, n),
      n[M].type === 1 && n[fe].destroy());
    let r = n[Zt];
    if (r !== null && Te(n[J])) {
      r !== n[J] && Na(r, n);
      let o = n[Vn];
      o !== null && o.detachView(e);
    }
    sa(n);
  } finally {
    N(t);
  }
}
function yu(e, n, t, r) {
  let o = e?.[Yt];
  if (o == null || o.leave == null || !o.leave.has(n.index)) return r(!1);
  (e && nn.add(e[Xe]),
    gd(
      t,
      () => {
        if (o.leave && o.leave.has(n.index)) {
          let s = o.leave.get(n.index),
            a = [];
          if (s) {
            for (let c = 0; c < s.animateFns.length; c++) {
              let l = s.animateFns[c],
                { promise: u } = l();
              a.push(u);
            }
            o.detachedLeaveAnimationFns = void 0;
          }
          ((o.running = Promise.allSettled(a)), Zg(e, r));
        } else (e && nn.delete(e[Xe]), r(!1));
      },
      o,
    ));
}
function Zg(e, n) {
  let t = e[Yt]?.running;
  if (t) {
    t.then(() => {
      ((e[Yt].running = void 0), nn.delete(e[Xe]), n(!0));
    });
    return;
  }
  n(!1);
}
function Yg(e, n) {
  let t = e.cleanup,
    r = n[mo];
  if (t !== null)
    for (let s = 0; s < t.length - 1; s += 2)
      if (typeof t[s] == "string") {
        let a = t[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[t[s + 1]];
        t[s].call(a);
      }
  r !== null && (n[mo] = null);
  let o = n[Ve];
  if (o !== null) {
    n[Ve] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = n[$n];
  if (i !== null) {
    n[$n] = null;
    for (let s of i) s.destroy();
  }
}
function Kg(e, n) {
  let t;
  if (e != null && (t = e.destroyHooks) != null)
    for (let r = 0; r < t.length; r += 2) {
      let o = n[t[r]];
      if (!(o instanceof Jn)) {
        let i = t[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            j(k.LifecycleHookStart, a, c);
            try {
              c.call(a);
            } finally {
              j(k.LifecycleHookEnd, a, c);
            }
          }
        else {
          j(k.LifecycleHookStart, o, i);
          try {
            i.call(o);
          } finally {
            j(k.LifecycleHookEnd, o, i);
          }
        }
      }
    }
}
function Jg(e, n, t) {
  return Xg(e, n.parent, t);
}
function Xg(e, n, t) {
  let r = n;
  for (; r !== null && r.type & 168; ) ((n = r), (r = n.parent));
  if (r === null) return t[Se];
  if (Dt(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === _e.None || o === _e.Emulated) return null;
  }
  return nt(r, t);
}
function em(e, n, t) {
  return nm(e, n, t);
}
function tm(e, n, t) {
  return e.type & 40 ? nt(e, t) : null;
}
var nm = tm,
  Eu;
function yd(e, n, t, r) {
  let o = Jg(e, r, n),
    i = n[fe],
    s = r.parent || n[ye],
    a = em(s, r, n);
  if (o != null)
    if (Array.isArray(t))
      for (let c = 0; c < t.length; c++) hu(i, o, t[c], a, !1);
    else hu(i, o, t, a, !1);
  Eu !== void 0 && Eu(i, r, n, t, o);
}
function Yn(e, n) {
  if (n !== null) {
    let t = n.type;
    if (t & 3) return nt(n, e);
    if (t & 4) return ua(-1, e[n.index]);
    if (t & 8) {
      let r = n.child;
      if (r !== null) return Yn(e, r);
      {
        let o = e[n.index];
        return Te(o) ? ua(-1, o) : Pe(o);
      }
    } else {
      if (t & 128) return Yn(e, n.next);
      if (t & 32) return Ma(n, e)() || Pe(e[n.index]);
      {
        let r = Ed(e, n);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Ye(e[Ee]);
          return Yn(o, r);
        } else return Yn(e, n.next);
      }
    }
  }
  return null;
}
function Ed(e, n) {
  if (n !== null) {
    let r = e[Ee][ye],
      o = n.projection;
    return r.projection[o];
  }
  return null;
}
function ua(e, n) {
  let t = ce + e + 1;
  if (t < n.length) {
    let r = n[t],
      o = r[M].firstChild;
    if (o !== null) return Yn(r, o);
  }
  return n[et];
}
function xa(e, n, t, r, o, i, s) {
  for (; t != null; ) {
    let a = r[It];
    if (t.type === 128) {
      t = t.next;
      continue;
    }
    let c = r[t.index],
      l = t.type;
    if ((s && n === 0 && (c && Xn(Pe(c), r), (t.flags |= 2)), !ba(t)))
      if (l & 8) (xa(e, n, t.child, r, o, i, !1), en(n, e, a, o, c, t, i, r));
      else if (l & 32) {
        let u = Ma(t, r),
          d;
        for (; (d = u()); ) en(n, e, a, o, d, t, i, r);
        en(n, e, a, o, c, t, i, r);
      } else l & 16 ? rm(e, n, r, t, o, i) : en(n, e, a, o, c, t, i, r);
    t = s ? t.projectionNext : t.next;
  }
}
function qo(e, n, t, r, o, i) {
  xa(t, r, e.firstChild, n, o, i, !1);
}
function rm(e, n, t, r, o, i) {
  let s = t[Ee],
    c = s[ye].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      en(n, e, t[It], o, u, r, i, t);
    }
  else {
    let l = c,
      u = s[J];
    (Qu(r) && (l.flags |= 128), xa(e, n, l, u, o, i, !0));
  }
}
function om(e, n, t, r, o, i, s) {
  let a = r[et],
    c = Pe(r);
  a !== c && en(n, e, t, i, a, o, s);
  for (let l = ce; l < r.length; l++) {
    let u = r[l];
    qo(u[M], u, e, n, i, a);
  }
}
function Id(e, n, t, r, o) {
  let i = Xl(),
    s = r & 2;
  try {
    (rt(-1), s && n.length > Ie && Ug(e, n, Ie, !1));
    let a = s ? k.TemplateUpdateStart : k.TemplateCreateStart;
    (j(a, o, t), t(r, o));
  } finally {
    rt(i);
    let a = s ? k.TemplateUpdateEnd : k.TemplateCreateEnd;
    j(a, o, t);
  }
}
function wd(e, n, t) {
  (cm(e, n, t), (t.flags & 64) === 64 && lm(e, n, t));
}
function Dd(e, n, t = nt) {
  let r = n.localNames;
  if (r !== null) {
    let o = n.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? t(n, e) : e[s];
      e[o++] = a;
    }
  }
}
function im(e, n, t, r) {
  let i =
      r.get(ed, Xu) ||
      t === _e.ShadowDom ||
      t === _e.ExperimentalIsolatedShadowDom,
    s = e.selectRootElement(n, i);
  return (sm(s), s);
}
function sm(e) {
  am(e);
}
var am = () => null;
function cm(e, n, t) {
  let r = t.directiveStart,
    o = t.directiveEnd;
  (Dt(t) && Hg(n, t, e.data[r + t.componentOffset]),
    e.firstCreatePass || Uu(t, n));
  let i = t.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = oa(n, e, s, t);
    if ((Xn(c, n), i !== null && fm(n, s - r, c, a, t, i), Ct(a))) {
      let l = Be(t.index, n);
      l[de] = oa(n, e, s, t);
    }
  }
}
function lm(e, n, t) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = t.index,
    s = Zl();
  try {
    rt(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = n[a];
      (wo(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          um(c, l));
    }
  } finally {
    (rt(-1), wo(s));
  }
}
function um(e, n) {
  e.hostBindings !== null && e.hostBindings(1, n);
}
function dm(e, n) {
  let t = e.directiveRegistry,
    r = null;
  if (t)
    for (let o = 0; o < t.length; o++) {
      let i = t[o];
      Rg(n, i.selectors, !1) && ((r ??= []), Ct(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function fm(e, n, t, r, o, i) {
  let s = i[n];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      ca(r, t, c, l);
    }
}
function Cd(e, n, t, r, o) {
  let i = Ie + t,
    s = n[M],
    a = o(s, n, e, r, t);
  ((n[i] = a), Qn(e, !0));
  let c = e.type === 2;
  return (
    c ? (sd(n[fe], a, e), (Ul() === 0 || xs(e)) && Xn(a, n), Vl()) : Xn(a, n),
    qs() && (!c || !ba(e)) && yd(s, n, a, e),
    e
  );
}
function bd(e) {
  let n = e;
  return (Hs() ? ql() : ((n = n.parent), Qn(n, !1)), n);
}
function Sd(e, n, t, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = n.data[l];
      (ca(d, t[l], u, o), (a = !0));
    }
  if (i)
    for (let c of i) {
      let l = t[c],
        u = n.data[c];
      (ca(u, l, r, o), (a = !0));
    }
  return a;
}
function pm(e, n) {
  let t = Be(n, e),
    r = t[M];
  hm(r, t);
  let o = t[Se];
  (o !== null && t[Un] === null && (t[Un] = td(o, t[It])), j(k.ComponentStart));
  try {
    Td(r, t, t[de]);
  } finally {
    j(k.ComponentEnd, t[de]);
  }
}
function hm(e, n) {
  for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
}
function Td(e, n, t) {
  Do(n);
  try {
    let r = e.viewQuery;
    r !== null && aa(1, r, t);
    let o = e.template;
    (o !== null && Id(e, n, o, 1, t),
      e.firstCreatePass && (e.firstCreatePass = !1),
      n[Vn]?.finishViewCreation(e),
      e.staticContentQueries && nd(e, n),
      e.staticViewQueries && aa(2, e.viewQuery, t));
    let i = e.components;
    i !== null && gm(n, i);
  } catch (r) {
    throw (
      e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r
    );
  } finally {
    ((n[S] &= -5), Co());
  }
}
function gm(e, n) {
  for (let t = 0; t < n.length; t++) pm(e, n[t]);
}
function Iu(e, n) {
  return !n || n.firstChild === null || Qu(e);
}
function er(e, n, t, r, o = !1) {
  for (; t !== null; ) {
    if (t.type === 128) {
      t = o ? t.projectionNext : t.next;
      continue;
    }
    let i = n[t.index];
    (i !== null && r.push(Pe(i)), Te(i) && Md(i, r));
    let s = t.type;
    if (s & 8) er(e, n, t.child, r);
    else if (s & 32) {
      let a = Ma(t, n),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Ed(n, t);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Ye(n[Ee]);
        er(c[M], c, a, r, !0);
      }
    }
    t = o ? t.projectionNext : t.next;
  }
  return r;
}
function Md(e, n) {
  for (let t = ce; t < e.length; t++) {
    let r = e[t],
      o = r[M].firstChild;
    o !== null && er(r[M], r, o, n);
  }
  e[et] !== e[Se] && n.push(e[et]);
}
function _d(e) {
  if (e[yo] !== null) {
    for (let n of e[yo]) n.impl.addSequence(n);
    e[yo].length = 0;
  }
}
var Nd = [];
function mm(e) {
  return e[pe] ?? vm(e);
}
function vm(e) {
  let n = Nd.pop() ?? Object.create(Em);
  return ((n.lView = e), n);
}
function ym(e) {
  e.lView[pe] !== e && ((e.lView = null), Nd.push(e));
}
var Em = F(g({}, In), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    Gn(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[pe] = this;
  },
});
function Im(e) {
  let n = e[pe] ?? Object.create(wm);
  return ((n.lView = e), n);
}
var wm = F(g({}, In), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    let n = Ye(e.lView);
    for (; n && !xd(n[M]); ) n = Ye(n);
    n && As(n);
  },
  consumerOnSignalRead() {
    this.lView[pe] = this;
  },
});
function xd(e) {
  return e.type !== 2;
}
function Rd(e) {
  if (e[$n] === null) return;
  let n = !0;
  for (; n; ) {
    let t = !1;
    for (let r of e[$n])
      r.dirty &&
        ((t = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    n = t && !!(e[S] & 8192);
  }
}
var Dm = 100;
function Ad(e, n = 0) {
  let r = e[ke].rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    Cm(e, n);
  } finally {
    o || r.end?.();
  }
}
function Cm(e, n) {
  let t = Us();
  try {
    (Vs(!0), da(e, n));
    let r = 0;
    for (; Wn(e); ) {
      if (r === Dm) throw new v(103, !1);
      (r++, da(e, 1));
    }
  } finally {
    Vs(t);
  }
}
function bm(e, n, t, r) {
  if (bt(n)) return;
  let o = n[S],
    i = !1,
    s = !1;
  Do(n);
  let a = !0,
    c = null,
    l = null;
  i ||
    (xd(e)
      ? ((l = mm(n)), (c = Dn(l)))
      : Or() === null
        ? ((a = !1), (l = Im(n)), (c = Dn(l)))
        : n[pe] && (Cn(n[pe]), (n[pe] = null)));
  try {
    (Rs(n), Wl(e.bindingStartIndex), t !== null && Id(e, n, t, 2, r));
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && So(n, f, null);
      } else {
        let f = e.preOrderHooks;
        (f !== null && To(n, f, 0, null), Xs(n, 0));
      }
    if (
      (s || Sm(n), Rd(n), Od(n, 0), e.contentQueries !== null && nd(e, n), !i)
    )
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && So(n, f);
      } else {
        let f = e.contentHooks;
        (f !== null && To(n, f, 1), Xs(n, 1));
      }
    Mm(e, n);
    let d = e.components;
    d !== null && Pd(n, d, 0);
    let h = e.viewQuery;
    if ((h !== null && aa(2, h, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && So(n, f);
      } else {
        let f = e.viewHooks;
        (f !== null && To(n, f, 2), Xs(n, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), n[vo])) {
      for (let f of n[vo]) f();
      n[vo] = null;
    }
    i || (_d(n), (n[S] &= -73));
  } catch (u) {
    throw (i || Gn(n), u);
  } finally {
    (l !== null && (kr(l, c), a && ym(l)), Co());
  }
}
function Od(e, n) {
  for (let t = Yu(e); t !== null; t = Ku(t))
    for (let r = ce; r < t.length; r++) {
      let o = t[r];
      kd(o, n);
    }
}
function Sm(e) {
  for (let n = Yu(e); n !== null; n = Ku(n)) {
    if (!(n[S] & 2)) continue;
    let t = n[zn];
    for (let r = 0; r < t.length; r++) {
      let o = t[r];
      As(o);
    }
  }
}
function Tm(e, n, t) {
  j(k.ComponentStart);
  let r = Be(n, e);
  try {
    kd(r, t);
  } finally {
    j(k.ComponentEnd, r[de]);
  }
}
function kd(e, n) {
  Eo(e) && da(e, n);
}
function da(e, n) {
  let r = e[M],
    o = e[S],
    i = e[pe],
    s = !!(n === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && n === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Pr(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[S] &= -9217),
    s)
  )
    bm(r, e, r.template, e[de]);
  else if (o & 8192) {
    let a = N(null);
    try {
      (Rd(e), Od(e, 1));
      let c = r.components;
      (c !== null && Pd(e, c, 1), _d(e));
    } finally {
      N(a);
    }
  }
}
function Pd(e, n, t) {
  for (let r = 0; r < n.length; r++) Tm(e, n[r], t);
}
function Mm(e, n) {
  let t = e.hostBindingOpCodes;
  if (t !== null)
    try {
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        if (o < 0) rt(~o);
        else {
          let i = o,
            s = t[++r],
            a = t[++r];
          Ql(s, i);
          let c = n[i];
          j(k.HostBindingsUpdateStart, c);
          try {
            a(2, c);
          } finally {
            j(k.HostBindingsUpdateEnd, c);
          }
        }
      }
    } finally {
      rt(-1);
    }
}
function Ld(e, n) {
  let t = Us() ? 64 : 1088;
  for (e[ke].changeDetectionScheduler?.notify(n); e; ) {
    e[S] |= t;
    let r = Ye(e);
    if (Kt(e) && !r) return e;
    e = r;
  }
  return null;
}
function _m(e, n, t, r) {
  return [e, !0, 0, n, null, r, null, t, null, null];
}
function Nm(e, n, t, r = !0) {
  let o = n[M];
  if ((xm(o, n, e, t), r)) {
    let s = ua(t, e),
      a = n[fe],
      c = a.parentNode(e[et]);
    c !== null && Gg(o, e[ye], a, n, c, s);
  }
  let i = n[Un];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function fa(e, n) {
  if (e.length <= ce) return;
  let t = ce + n,
    r = e[t];
  if (r) {
    let o = r[Zt];
    (o !== null && o !== e && Na(o, r), n > 0 && (e[t - 1][ve] = r[ve]));
    let i = Ln(e, ce + n);
    Wg(r[M], r);
    let s = i[Vn];
    (s !== null && s.detachView(i[M]),
      (r[J] = null),
      (r[ve] = null),
      (r[S] &= -129));
  }
  return r;
}
function xm(e, n, t, r) {
  let o = ce + r,
    i = t.length;
  (r > 0 && (t[o - 1][ve] = n),
    r < i - ce
      ? ((n[ve] = t[o]), Ds(t, ce + r, n))
      : (t.push(n), (n[ve] = null)),
    (n[J] = t));
  let s = n[Zt];
  s !== null && t !== s && Fd(s, n);
  let a = n[Vn];
  (a !== null && a.insertView(e), Io(n), (n[S] |= 128));
}
function Fd(e, n) {
  let t = e[zn],
    r = n[J];
  if (tt(r)) e[S] |= 2;
  else {
    let o = r[J][Ee];
    n[Ee] !== o && (e[S] |= 2);
  }
  t === null ? (e[zn] = [n]) : t.push(n);
}
var Mt = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let n = this._lView,
      t = n[M];
    return er(t, n, t.firstChild, []);
  }
  constructor(n, t) {
    ((this._lView = n), (this._cdRefInjectingView = t));
  }
  get context() {
    return this._lView[de];
  }
  set context(n) {
    this._lView[de] = n;
  }
  get destroyed() {
    return bt(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let n = this._lView[J];
      if (Te(n)) {
        let t = n[Bn],
          r = t ? t.indexOf(this) : -1;
        r > -1 && (fa(n, r), Ln(t, r));
      }
      this._attachedToViewContainer = !1;
    }
    vd(this._lView[M], this._lView);
  }
  onDestroy(n) {
    Os(this._lView, n);
  }
  markForCheck() {
    Ld(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[S] &= -129;
  }
  reattach() {
    (Io(this._lView), (this._lView[S] |= 128));
  }
  detectChanges() {
    ((this._lView[S] |= 1024), Ad(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new v(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let n = Kt(this._lView),
      t = this._lView[Zt];
    (t !== null && !n && Na(t, this._lView), md(this._lView[M], this._lView));
  }
  attachToAppRef(n) {
    if (this._attachedToViewContainer) throw new v(902, !1);
    this._appRef = n;
    let t = Kt(this._lView),
      r = this._lView[Zt];
    (r !== null && !t && Fd(r, this._lView), Io(this._lView));
  }
};
function Ra(e, n, t, r, o) {
  let i = e.data[n];
  if (i === null) ((i = Rm(e, n, t, r, o)), Gl() && (i.flags |= 32));
  else if (i.type & 64) {
    ((i.type = t), (i.value = r), (i.attrs = o));
    let s = zl();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (Qn(i, !0), i);
}
function Rm(e, n, t, r, o) {
  let i = js(),
    s = Hs(),
    a = s ? i : i && i.parent,
    c = (e.data[n] = Om(e, a, t, n, r, o));
  return (Am(e, c, i, s), c);
}
function Am(e, n, t, r) {
  (e.firstChild === null && (e.firstChild = n),
    t !== null &&
      (r
        ? t.child == null && n.parent !== null && (t.child = n)
        : t.next === null && ((t.next = n), (n.prev = t))));
}
function Om(e, n, t, r, o, i) {
  let s = n ? n.injectorIndex : -1,
    a = 0;
  return (
    Bl() && (a |= 128),
    {
      type: t,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      controlDirectiveIndex: -1,
      customControlIndex: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: n,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var km = () => null;
function wu(e, n) {
  return km(e, n);
}
var jd = class {},
  Wo = class {},
  pa = class {
    resolveComponentFactory(n) {
      throw new v(917, !1);
    }
  },
  or = class {
    static NULL = new pa();
  },
  _t = class {};
var Hd = (() => {
  class e {
    static ɵprov = E({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
var Mo = {},
  ha = class {
    injector;
    parentInjector;
    constructor(n, t) {
      ((this.injector = n), (this.parentInjector = t));
    }
    get(n, t, r) {
      let o = this.injector.get(n, Mo, r);
      return o !== Mo || t === Mo ? o : this.parentInjector.get(n, t, r);
    }
  };
function Ao(e, n, t) {
  let r = t ? e.styles : null,
    o = t ? e.classes : null,
    i = 0;
  if (n !== null)
    for (let s = 0; s < n.length; s++) {
      let a = n[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = us(o, a);
      else if (i == 2) {
        let c = a,
          l = n[++s];
        r = us(r, c + ": " + l + ";");
      }
    }
  (t ? (e.styles = r) : (e.stylesWithoutHost = r),
    t ? (e.classes = o) : (e.classesWithoutHost = o));
}
function Ud(e, n = 0) {
  let t = he();
  if (t === null) return T(e, n);
  let r = ze();
  return zu(r, t, ae(e), n);
}
function Pm(e, n, t, r, o) {
  let i = r === null ? null : { "": -1 },
    s = o(e, t);
  if (s !== null) {
    let a = s,
      c = null,
      l = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, c, l] = u.resolveHostDirectives(s);
        break;
      }
    jm(e, n, t, a, i, c, l);
  }
  i !== null && r !== null && Lm(t, r, i);
}
function Lm(e, n, t) {
  let r = (e.localNames = []);
  for (let o = 0; o < n.length; o += 2) {
    let i = t[n[o + 1]];
    if (i == null) throw new v(-301, !1);
    r.push(n[o], i);
  }
}
function Fm(e, n, t) {
  ((n.componentOffset = t), (e.components ??= []).push(n.index));
}
function jm(e, n, t, r, o, i, s) {
  let a = r.length,
    c = null;
  for (let h = 0; h < a; h++) {
    let f = r[h];
    (c === null && Ct(f) && ((c = f), Fm(e, t, h)), lg(Uu(t, n), e, f.type));
  }
  (zm(t, e.data.length, a),
    c?.viewProvidersResolver && c.viewProvidersResolver(c));
  for (let h = 0; h < a; h++) {
    let f = r[h];
    f.providersResolver && f.providersResolver(f);
  }
  let l = !1,
    u = !1,
    d = fd(e, n, a, null);
  a > 0 && (t.directiveToIndex = new Map());
  for (let h = 0; h < a; h++) {
    let f = r[h];
    if (
      ((t.mergedAttrs = Ea(t.mergedAttrs, f.hostAttrs)),
      Um(e, t, n, d, f),
      Bm(d, f, o),
      s !== null && s.has(f))
    ) {
      let [H, $] = s.get(f);
      t.directiveToIndex.set(f.type, [
        d,
        H + t.directiveStart,
        $ + t.directiveStart,
      ]);
    } else (i === null || !i.has(f)) && t.directiveToIndex.set(f.type, d);
    (f.contentQueries !== null && (t.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) &&
        (t.flags |= 64));
    let m = f.type.prototype;
    (!l &&
      (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(t.index), (l = !0)),
      !u &&
        (m.ngOnChanges || m.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(t.index), (u = !0)),
      d++);
  }
  Hm(e, t, i);
}
function Hm(e, n, t) {
  for (let r = n.directiveStart; r < n.directiveEnd; r++) {
    let o = e.data[r];
    if (t === null || !t.has(o)) (Du(0, n, o, r), Du(1, n, o, r), bu(n, r, !1));
    else {
      let i = t.get(o);
      (Cu(0, n, i, r), Cu(1, n, i, r), bu(n, r, !0));
    }
  }
}
function Du(e, n, t, r) {
  let o = e === 0 ? t.inputs : t.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      (e === 0 ? (s = n.inputs ??= {}) : (s = n.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        Vd(n, i));
    }
}
function Cu(e, n, t, r) {
  let o = e === 0 ? t.inputs : t.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      (e === 0
        ? (a = n.hostDirectiveInputs ??= {})
        : (a = n.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        Vd(n, s));
    }
}
function Vd(e, n) {
  n === "class" ? (e.flags |= 8) : n === "style" && (e.flags |= 16);
}
function bu(e, n, t) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!t && o === null) || (t && i === null) || Sa(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == "number") break;
    if (!t && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === n) {
          ((s ??= []), s.push(c, r[a + 1]));
          break;
        }
    } else if (t && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === n) {
          ((s ??= []), s.push(l[u + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function Um(e, n, t, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = ht(o.type, !0)),
    s = new Jn(i, Ct(o), Ud, null);
  ((e.blueprint[r] = s), (t[r] = s), Vm(e, n, r, fd(e, t, o.hostVars, Ta), o));
}
function Vm(e, n, t, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~n.index;
    ($m(s) != a && s.push(a), s.push(t, r, i));
  }
}
function $m(e) {
  let n = e.length;
  for (; n > 0; ) {
    let t = e[--n];
    if (typeof t == "number" && t < 0) return t;
  }
  return 0;
}
function Bm(e, n, t) {
  if (t) {
    if (n.exportAs)
      for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
    Ct(n) && (t[""] = e);
  }
}
function zm(e, n, t) {
  ((e.flags |= 1),
    (e.directiveStart = n),
    (e.directiveEnd = n + t),
    (e.providerIndexes = n));
}
function $d(e, n, t, r, o, i, s, a) {
  let c = n[M],
    l = c.consts,
    u = qn(l, s),
    d = Ra(c, e, t, r, u);
  return (
    i && Pm(c, n, d, qn(l, a), o),
    (d.mergedAttrs = Ea(d.mergedAttrs, d.attrs)),
    d.attrs !== null && Ao(d, d.attrs, !1),
    d.mergedAttrs !== null && Ao(d, d.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, d),
    d
  );
}
function Bd(e, n) {
  (Jh(e, n), Ns(n) && e.queries.elementEnd(n));
}
function qm(e, n, t, r, o, i) {
  let s = n.consts,
    a = qn(s, o),
    c = Ra(n, e, t, r, a);
  if (((c.mergedAttrs = Ea(c.mergedAttrs, c.attrs)), i != null)) {
    let l = qn(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1);
  }
  return (
    c.attrs !== null && Ao(c, c.attrs, !1),
    c.mergedAttrs !== null && Ao(c, c.mergedAttrs, !0),
    n.queries !== null && n.queries.elementStart(n, c),
    c
  );
}
var ga = Symbol("BINDING");
function zd(e) {
  return e.debugInfo?.className || e.type.name || null;
}
var Oo = class extends or {
  ngModule;
  constructor(n) {
    (super(), (this.ngModule = n));
  }
  resolveComponentFactory(n) {
    let t = Ke(n);
    return new rn(t, this.ngModule);
  }
};
function Wm(e) {
  return Object.keys(e).map((n) => {
    let [t, r, o] = e[n],
      i = {
        propName: t,
        templateName: n,
        isSignal: (r & Bo.SignalBased) !== 0,
      };
    return (o && (i.transform = o), i);
  });
}
function Gm(e) {
  return Object.keys(e).map((n) => ({ propName: e[n], templateName: n }));
}
function Qm(e, n, t) {
  let r = n instanceof W ? n : n?.injector;
  return (
    r &&
      e.getStandaloneInjector !== null &&
      (r = e.getStandaloneInjector(r) || r),
    r ? new ha(t, r) : t
  );
}
function Zm(e) {
  let n = e.get(_t, null);
  if (n === null) throw new v(407, !1);
  let t = e.get(Hd, null),
    r = e.get(vt, null),
    o = e.get(sn, null, { optional: !0 });
  return {
    rendererFactory: n,
    sanitizer: t,
    changeDetectionScheduler: r,
    ngReflect: !1,
    tracingService: o,
  };
}
function Ym(e, n) {
  let t = qd(e);
  return od(n, t, t === "svg" ? Pl : t === "math" ? Ll : null);
}
function qd(e) {
  return (e.selectors[0][0] || "div").toLowerCase();
}
var rn = class extends Wo {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return (
      (this.cachedInputs ??= Wm(this.componentDef.inputs)),
      this.cachedInputs
    );
  }
  get outputs() {
    return (
      (this.cachedOutputs ??= Gm(this.componentDef.outputs)),
      this.cachedOutputs
    );
  }
  constructor(n, t) {
    (super(),
      (this.componentDef = n),
      (this.ngModule = t),
      (this.componentType = n.type),
      (this.selector = Pg(n.selectors)),
      (this.ngContentSelectors = n.ngContentSelectors ?? []),
      (this.isBoundToModule = !!t));
  }
  create(n, t, r, o, i, s) {
    j(k.DynamicComponentStart);
    let a = N(null);
    try {
      let c = this.componentDef,
        l = Qm(c, o || this.ngModule, n),
        u = Zm(l),
        d = u.tracingService;
      return d && d.componentCreate
        ? d.componentCreate(zd(c), () =>
            this.createComponentRef(u, l, t, r, i, s),
          )
        : this.createComponentRef(u, l, t, r, i, s);
    } finally {
      N(a);
    }
  }
  createComponentRef(n, t, r, o, i, s) {
    let a = this.componentDef,
      c = Km(o, a, s, i),
      l = n.rendererFactory.createRenderer(null, a),
      u = o ? im(l, o, a.encapsulation, t) : Ym(a, l),
      d =
        s?.some(Su) ||
        i?.some((m) => typeof m != "function" && m.bindings.some(Su)),
      h = ud(
        null,
        c,
        null,
        512 | dd(a),
        null,
        null,
        n,
        l,
        t,
        null,
        td(u, t, !0),
      );
    ((h[Ie] = u), Do(h));
    let f = null;
    try {
      let m = $d(Ie, h, 2, "#host", () => c.directiveRegistry, !0, 0);
      (sd(l, u, m),
        Xn(u, h),
        wd(c, h, m),
        rd(c, m, h),
        Bd(c, m),
        r !== void 0 && Xm(m, this.ngContentSelectors, r),
        (f = Be(m.index, h)),
        (h[de] = f[de]),
        Td(c, h, null));
    } catch (m) {
      throw (f !== null && sa(f), sa(h), m);
    } finally {
      (j(k.DynamicComponentEnd), Co());
    }
    return new ko(this.componentType, h, !!d);
  }
};
function Km(e, n, t, r) {
  let o = e ? ["ng-version", "21.2.12"] : Lg(n.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (t)
    for (let u of t)
      ((a += u[ga].requiredVars),
        u.create && ((u.targetIdx = 0), (i ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u)));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != "function")
        for (let h of d.bindings) {
          a += h[ga].requiredVars;
          let f = u + 1;
          (h.create && ((h.targetIdx = f), (i ??= []).push(h)),
            h.update && ((h.targetIdx = f), (s ??= []).push(h)));
        }
    }
  let c = [n];
  if (r)
    for (let u of r) {
      let d = typeof u == "function" ? u : u.type,
        h = Es(d);
      c.push(h);
    }
  return ld(0, null, Jm(i, s), 1, a, c, null, null, null, [o], null);
}
function Jm(e, n) {
  return !e && !n
    ? null
    : (t) => {
        if (t & 1 && e) for (let r of e) r.create();
        if (t & 2 && n) for (let r of n) r.update();
      };
}
function Su(e) {
  let n = e[ga].kind;
  return n === "input" || n === "twoWay";
}
var ko = class extends jd {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(n, t, r) {
    (super(),
      (this._rootLView = t),
      (this._hasInputBindings = r),
      (this._tNode = Fl(t[M], Ie)),
      (this.location = wa(this._tNode, t)),
      (this.instance = Be(this._tNode.index, t)[de]),
      (this.hostView = this.changeDetectorRef = new Mt(t, void 0)),
      (this.componentType = n));
  }
  setInput(n, t) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(n) &&
        Object.is(this.previousInputValues.get(n), t))
    )
      return;
    let o = this._rootLView,
      i = Sd(r, o[M], o, n, t);
    this.previousInputValues.set(n, t);
    let s = Be(r.index, o);
    Ld(s, 1);
  }
  get injector() {
    return new Tt(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(n) {
    this.hostView.onDestroy(n);
  }
};
function Xm(e, n, t) {
  let r = (e.projection = []);
  for (let o = 0; o < n.length; o++) {
    let i = t[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var Go = (() => {
  class e {
    static __NG_ELEMENT_ID__ = ev;
  }
  return e;
})();
function ev() {
  let e = ze();
  return tv(e, he());
}
var ma = class e extends Go {
  _lContainer;
  _hostTNode;
  _hostLView;
  constructor(n, t, r) {
    (super(),
      (this._lContainer = n),
      (this._hostTNode = t),
      (this._hostLView = r));
  }
  get element() {
    return wa(this._hostTNode, this._hostLView);
  }
  get injector() {
    return new Tt(this._hostTNode, this._hostLView);
  }
  get parentInjector() {
    let n = Ia(this._hostTNode, this._hostLView);
    if (Fu(n)) {
      let t = xo(n, this._hostLView),
        r = No(n),
        o = t[M].data[r + 8];
      return new Tt(o, t);
    } else return new Tt(null, this._hostLView);
  }
  clear() {
    for (; this.length > 0; ) this.remove(this.length - 1);
  }
  get(n) {
    let t = Tu(this._lContainer);
    return (t !== null && t[n]) || null;
  }
  get length() {
    return this._lContainer.length - ce;
  }
  createEmbeddedView(n, t, r) {
    let o, i;
    typeof r == "number"
      ? (o = r)
      : r != null && ((o = r.index), (i = r.injector));
    let s = wu(this._lContainer, n.ssrId),
      a = n.createEmbeddedViewImpl(t || {}, i, s);
    return (this.insertImpl(a, o, Iu(this._hostTNode, s)), a);
  }
  createComponent(n, t, r, o, i, s, a) {
    let c = n && !Gh(n),
      l;
    if (c) l = t;
    else {
      let $ = t || {};
      ((l = $.index),
        (r = $.injector),
        (o = $.projectableNodes),
        (i = $.environmentInjector || $.ngModuleRef),
        (s = $.directives),
        (a = $.bindings));
    }
    let u = c ? n : new rn(Ke(n)),
      d = r || this.parentInjector;
    if (!i && u.ngModule == null) {
      let Z = (c ? d : this.parentInjector).get(W, null);
      Z && (i = Z);
    }
    let h = Ke(u.componentType ?? {}),
      f = wu(this._lContainer, h?.id ?? null),
      m = f?.firstChild ?? null,
      H = u.create(d, o, m, i, s, a);
    return (this.insertImpl(H.hostView, l, Iu(this._hostTNode, f)), H);
  }
  insert(n, t) {
    return this.insertImpl(n, t, !0);
  }
  insertImpl(n, t, r) {
    let o = n._lView;
    if (jl(o)) {
      let a = this.indexOf(n);
      if (a !== -1) this.detach(a);
      else {
        let c = o[J],
          l = new e(c, c[ye], c[J]);
        l.detach(l.indexOf(n));
      }
    }
    let i = this._adjustIndex(t),
      s = this._lContainer;
    return (Nm(s, o, i, r), n.attachToViewContainerRef(), Ds(na(s), i, n), n);
  }
  move(n, t) {
    return this.insert(n, t);
  }
  indexOf(n) {
    let t = Tu(this._lContainer);
    return t !== null ? t.indexOf(n) : -1;
  }
  remove(n) {
    let t = this._adjustIndex(n, -1),
      r = fa(this._lContainer, t);
    r && (Ln(na(this._lContainer), t), vd(r[M], r));
  }
  detach(n) {
    let t = this._adjustIndex(n, -1),
      r = fa(this._lContainer, t);
    return r && Ln(na(this._lContainer), t) != null ? new Mt(r) : null;
  }
  _adjustIndex(n, t = 0) {
    return n ?? this.length + t;
  }
};
function Tu(e) {
  return e[Bn];
}
function na(e) {
  return e[Bn] || (e[Bn] = []);
}
function tv(e, n) {
  let t,
    r = n[e.index];
  return (
    Te(r) ? (t = r) : ((t = _m(r, n, null, e)), (n[e.index] = t), pd(n, t)),
    rv(t, n, e, r),
    new ma(t, e, n)
  );
}
function nv(e, n) {
  let t = e[fe],
    r = t.createComment(""),
    o = nt(n, e),
    i = t.parentNode(o);
  return (Ro(t, i, r, t.nextSibling(o), !1), r);
}
var rv = ov;
function ov(e, n, t, r) {
  if (e[et]) return;
  let o;
  (t.type & 8 ? (o = Pe(r)) : (o = nv(n, t)), (e[et] = o));
}
var on = class {},
  Qo = class {};
var Po = class extends on {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Oo(this);
    constructor(n, t, r, o = !0) {
      (super(), (this.ngModuleType = n), (this._parent = t));
      let i = ys(n);
      ((this._bootstrapComponents = ad(i.bootstrap)),
        (this._r3Injector = Gs(
          n,
          t,
          [
            { provide: on, useValue: this },
            { provide: or, useValue: this.componentFactoryResolver },
            ...r,
          ],
          lo(n),
          new Set(["environment"]),
        )),
        o && this.resolveInjectorInitializers());
    }
    resolveInjectorInitializers() {
      (this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType)));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let n = this._r3Injector;
      (!n.destroyed && n.destroy(),
        this.destroyCbs.forEach((t) => t()),
        (this.destroyCbs = null));
    }
    onDestroy(n) {
      this.destroyCbs.push(n);
    }
  },
  Lo = class extends Qo {
    moduleType;
    constructor(n) {
      (super(), (this.moduleType = n));
    }
    create(n) {
      return new Po(this.moduleType, n, []);
    }
  };
var tr = class extends on {
  injector;
  componentFactoryResolver = new Oo(this);
  instance = null;
  constructor(n) {
    super();
    let t = new mt(
      [
        ...n.providers,
        { provide: on, useValue: this },
        { provide: or, useValue: this.componentFactoryResolver },
      ],
      n.parent || Hn(),
      n.debugName,
      new Set(["environment"]),
    );
    ((this.injector = t),
      n.runEnvironmentInitializers && t.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(n) {
    this.injector.onDestroy(n);
  }
};
function ir(e, n, t = null) {
  return new tr({
    providers: e,
    parent: n,
    debugName: t,
    runEnvironmentInitializers: !0,
  }).injector;
}
var iv = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(t) {
      this._injector = t;
    }
    getOrCreateStandaloneInjector(t) {
      if (!t.standalone) return null;
      if (!this.cachedInjectors.has(t)) {
        let r = Ss(!1, t.type),
          o = r.length > 0 ? ir([r], this._injector, "") : null;
        this.cachedInjectors.set(t, o);
      }
      return this.cachedInjectors.get(t);
    }
    ngOnDestroy() {
      try {
        for (let t of this.cachedInjectors.values()) t !== null && t.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = E({
      token: e,
      providedIn: "environment",
      factory: () => new e(T(W)),
    });
  }
  return e;
})();
function sr(e) {
  return Ho(() => {
    let n = Wd(e),
      t = F(g({}, n), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Da.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (n.standalone && e.dependencies) || null,
        getStandaloneInjector: n.standalone
          ? (o) => o.get(iv).getOrCreateStandaloneInjector(t)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || _e.Emulated,
        styles: e.styles || gt,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    (n.standalone && zo("NgStandalone"), Gd(t));
    let r = e.dependencies;
    return (
      (t.directiveDefs = Mu(r, sv)),
      (t.pipeDefs = Mu(r, Sl)),
      (t.id = lv(t)),
      t
    );
  });
}
function sv(e) {
  return Ke(e) || Es(e);
}
function av(e, n) {
  if (e == null) return Et;
  let t = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      (Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = Bo.None), (c = null)),
        (t[i] = [r, a, c]),
        (n[i] = s));
    }
  return t;
}
function cv(e) {
  if (e == null) return Et;
  let n = {};
  for (let t in e) e.hasOwnProperty(t) && (n[e[t]] = t);
  return n;
}
function Aa(e) {
  return Ho(() => {
    let n = Wd(e);
    return (Gd(n), n);
  });
}
function Wd(e) {
  let n = {};
  return {
    type: e.type,
    providersResolver: null,
    viewProvidersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: n,
    inputConfig: e.inputs || Et,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || gt,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    controlDef: null,
    inputs: av(e.inputs, n),
    outputs: cv(e.outputs),
    debugInfo: null,
  };
}
function Gd(e) {
  e.features?.forEach((n) => n(e));
}
function Mu(e, n) {
  return e
    ? () => {
        let t = typeof e == "function" ? e() : e,
          r = [];
        for (let o of t) {
          let i = n(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function lv(e) {
  let n = 0,
    t = typeof e.consts == "function" ? "" : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      t,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join("|")) n = (Math.imul(31, n) + i.charCodeAt(0)) << 0;
  return ((n += 2147483648), "c" + n);
}
var Oa = (() => {
  class e {
    log(t) {
      console.log(t);
    }
    warn(t) {
      console.warn(t);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "platform" });
  }
  return e;
})();
var ka = new y("");
function ar(e) {
  return !!e && typeof e.then == "function";
}
function Qd(e) {
  return !!e && typeof e.subscribe == "function";
}
var Zd = new y("");
var Pa = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((t, r) => {
        ((this.resolve = t), (this.reject = r));
      });
      appInits = p(Zd, { optional: !0 }) ?? [];
      injector = p(Oe);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let t = [];
        for (let o of this.appInits) {
          let i = ne(this.injector, o);
          if (ar(i)) t.push(i);
          else if (Qd(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            t.push(s);
          }
        }
        let r = () => {
          ((this.done = !0), this.resolve());
        };
        (Promise.all(t)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          t.length === 0 && r(),
          (this.initialized = !0));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Zo = new y("");
function Yd() {
  ki(() => {
    let e = "";
    throw new v(600, e);
  });
}
function Kd(e) {
  return e.isBoundToModule;
}
var uv = 10;
var xt = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = p(We);
    afterRenderManager = p(hd);
    zonelessEnabled = p(Xt);
    rootEffectScheduler = p(Js);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new te();
    get allViews() {
      return [
        ...(this.includeAllTestViews
          ? this.allTestViews
          : this.autoDetectTestViews
        ).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = p(qe);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(
        V((t) => !t),
      );
    }
    constructor() {
      p(sn, { optional: !0 });
    }
    whenStable() {
      let t;
      return new Promise((r) => {
        t = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        t.unsubscribe();
      });
    }
    _injector = p(W);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(t, r) {
      return this.bootstrapImpl(t, r);
    }
    bootstrapImpl(t, r, o = Oe.NULL) {
      return this._injector.get(z).run(() => {
        j(k.BootstrapComponentStart);
        let s = t instanceof Wo;
        if (!this._injector.get(Pa).done) {
          let m = "";
          throw new v(405, m);
        }
        let c;
        (s ? (c = t) : (c = this._injector.get(or).resolveComponentFactory(t)),
          this.componentTypes.push(c.componentType));
        let l = Kd(c) ? void 0 : this._injector.get(on),
          u = r || c.selector,
          d = c.create(o, [], u, l),
          h = d.location.nativeElement,
          f = d.injector.get(ka, null);
        return (
          f?.registerApplication(h),
          d.onDestroy(() => {
            (this.detachView(d.hostView),
              Kn(this.components, d),
              f?.unregisterApplication(h));
          }),
          this._loadComponent(d),
          j(k.BootstrapComponentEnd, d),
          d
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (j(k.ChangeDetectionStart),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(_a.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw (j(k.ChangeDetectionEnd), new v(101, !1));
      let t = N(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          N(t),
          this.afterTick.next(),
          j(k.ChangeDetectionEnd));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(_t, null, {
          optional: !0,
        }));
      let t = 0;
      for (; this.dirtyFlags !== 0 && t++ < uv; ) {
        j(k.ChangeDetectionSyncStart);
        try {
          this.synchronizeOnce();
        } finally {
          j(k.ChangeDetectionSyncEnd);
        }
      }
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 &&
        ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let t = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: o } of this.allViews) {
          if (!r && !Wn(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          (Ad(o, i), (t = !0));
        }
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      }
      (t || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 &&
          ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: t }) => Wn(t))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(t) {
      let r = t;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(t) {
      let r = t;
      (Kn(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(t) {
      this.attachView(t.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      (this.components.push(t),
        this._injector.get(Zo, []).forEach((o) => o(t)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((t) => t()),
            this._views.slice().forEach((t) => t.destroy()));
        } finally {
          ((this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []));
        }
    }
    onDestroy(t) {
      return (
        this._destroyListeners.push(t),
        () => Kn(this._destroyListeners, t)
      );
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1);
      let t = this._injector;
      t.destroy && !t.destroyed && t.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function Kn(e, n) {
  let t = e.indexOf(n);
  t > -1 && e.splice(t, 1);
}
function _u(e, n, t, r, o) {
  Sd(n, e, t, o ? "class" : "style", r);
}
function Fo(e, n, t, r) {
  let o = he(),
    i = o[M],
    s = e + Ie,
    a = i.firstCreatePass ? $d(s, o, 2, n, dm, $l(), t, r) : i.data[s];
  if (Dt(a)) {
    let c = o[ke].tracingService;
    if (c && c.componentCreate) {
      let l = i.data[a.directiveStart + a.componentOffset];
      return c.componentCreate(zd(l), () => (Nu(e, n, o, a, r), Fo));
    }
  }
  return (Nu(e, n, o, a, r), Fo);
}
function Nu(e, n, t, r, o) {
  if ((Cd(r, t, e, n, Jd), xs(r))) {
    let i = t[M];
    (wd(i, t, r), rd(i, r, t));
  }
  o != null && Dd(t, r);
}
function La() {
  let e = Fs(),
    n = ze(),
    t = bd(n);
  return (
    e.firstCreatePass && Bd(e, t),
    Ps(t) && Ls(),
    ks(),
    t.classesWithoutHost != null &&
      eg(t) &&
      _u(e, t, he(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      tg(t) &&
      _u(e, t, he(), t.stylesWithoutHost, !1),
    La
  );
}
function Yo(e, n, t, r) {
  return (Fo(e, n, t, r), La(), Yo);
}
function I(e, n, t, r) {
  let o = he(),
    i = o[M],
    s = e + Ie,
    a = i.firstCreatePass ? qm(s, i, 2, n, t, r) : i.data[s];
  return (Cd(a, o, e, n, Jd), r != null && Dd(o, a), I);
}
function w() {
  let e = ze(),
    n = bd(e);
  return (Ps(n) && Ls(), ks(), w);
}
function Ko(e, n, t, r) {
  return (I(e, n, t, r), w(), Ko);
}
var Jd = (e, n, t, r, o) => (Ws(!0), od(n[fe], r, eu()));
var cr = "en-US";
var dv = cr;
function Xd(e) {
  typeof e == "string" && (dv = e.toLowerCase().replace(/_/g, "-"));
}
function D(e, n = "") {
  let t = he(),
    r = Fs(),
    o = e + Ie,
    i = r.firstCreatePass ? Ra(r, o, 1, n, null) : r.data[o],
    s = fv(r, t, i, n);
  ((t[o] = s), qs() && yd(r, t, s, i), Qn(i, !1));
}
var fv = (e, n, t, r) => (Ws(!0), Dg(n[fe], r));
var jo = class {
    ngModuleFactory;
    componentFactories;
    constructor(n, t) {
      ((this.ngModuleFactory = n), (this.componentFactories = t));
    }
  },
  Fa = (() => {
    class e {
      compileModuleSync(t) {
        return new Lo(t);
      }
      compileModuleAsync(t) {
        return Promise.resolve(this.compileModuleSync(t));
      }
      compileModuleAndAllComponentsSync(t) {
        let r = this.compileModuleSync(t),
          o = ys(t),
          i = ad(o.declarations).reduce((s, a) => {
            let c = Ke(a);
            return (c && s.push(new rn(c)), s);
          }, []);
        return new jo(r, i);
      }
      compileModuleAndAllComponentsAsync(t) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
      }
      clearCache() {}
      clearCacheFor(t) {}
      getModuleId(t) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
var ef = (() => {
  class e {
    applicationErrorHandler = p(We);
    appRef = p(xt);
    taskService = p(qe);
    ngZone = p(z);
    zonelessEnabled = p(Xt);
    tracing = p(sn, { optional: !0 });
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new q();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(An) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (p(bo, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          let t = this.taskService.add();
          if (
            !this.runningTick &&
            (this.cleanup(),
            !this.zonelessEnabled || this.appRef.includeAllTestViews)
          ) {
            this.taskService.remove(t);
            return;
          }
          (this.switchToMicrotaskScheduler(), this.taskService.remove(t));
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ));
    }
    switchToMicrotaskScheduler() {
      this.ngZone.runOutsideAngular(() => {
        let t = this.taskService.add();
        ((this.useMicrotaskScheduler = !0),
          queueMicrotask(() => {
            ((this.useMicrotaskScheduler = !1), this.taskService.remove(t));
          }));
      });
    }
    notify(t) {
      if (!this.zonelessEnabled && t === 5) return;
      switch (t) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 12: {
          this.appRef.dirtyFlags |= 16;
          break;
        }
        case 13: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 11:
          break;
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick())
      )
        return;
      let r = this.useMicrotaskScheduler ? ru : Zs;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              r(() => this.tick()),
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick()),
            )));
    }
    shouldScheduleTick() {
      return !(
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(An + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let t = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        this.applicationErrorHandler(r);
      } finally {
        (this.taskService.remove(t), this.cleanup());
      }
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let t = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(t));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function tf() {
  return [
    { provide: vt, useExisting: ef },
    { provide: z, useClass: On },
    { provide: Xt, useValue: !0 },
  ];
}
function pv() {
  return (typeof $localize < "u" && $localize.locale) || cr;
}
var ja = new y("", {
  factory: () => p(ja, { optional: !0, skipSelf: !0 }) || pv(),
});
function ot(e) {
  return Il(e);
}
var sf = Symbol("InputSignalNode#UNSET"),
  bv = F(g({}, Lr), {
    transformFn: void 0,
    applyValueToInputSignal(e, n) {
      jt(e, n);
    },
  });
function af(e, n) {
  let t = Object.create(bv);
  ((t.value = e), (t.transformFn = n?.transform));
  function r() {
    if ((wn(t), t.value === sf)) {
      let o = null;
      throw new v(-950, o);
    }
    return t.value;
  }
  return ((r[le] = t), r);
}
function nf(e, n) {
  return af(e, n);
}
function Sv(e) {
  return af(sf, e);
}
var cf = ((nf.required = Sv), nf);
var Tv = (() => {
    class e {
      zone = p(z);
      changeDetectionScheduler = p(vt);
      applicationRef = p(xt);
      applicationErrorHandler = p(We);
      _onMicrotaskEmptySubscription;
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    try {
                      ((this.applicationRef.dirtyFlags |= 1),
                        this.applicationRef._tick());
                    } catch (t) {
                      this.applicationErrorHandler(t);
                    }
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Mv = new y("", { factory: () => !1 });
function _v({ ngZoneFactory: e, scheduleInRootZone: n }) {
  return (
    (e ??= () => new z(F(g({}, uf()), { scheduleInRootZone: n }))),
    [
      { provide: Xt, useValue: !1 },
      { provide: z, useFactory: e },
      {
        provide: Je,
        multi: !0,
        useFactory: () => {
          let t = p(Tv, { optional: !0 });
          return () => t.initialize();
        },
      },
      {
        provide: Je,
        multi: !0,
        useFactory: () => {
          let t = p(Nv);
          return () => {
            t.initialize();
          };
        },
      },
      { provide: bo, useValue: n ?? Qs },
    ]
  );
}
function lf(e) {
  let n = e?.scheduleInRootZone,
    t = _v({
      ngZoneFactory: () => {
        let r = uf(e);
        return (
          (r.scheduleInRootZone = n),
          r.shouldCoalesceEventChangeDetection && zo("NgZone_CoalesceEvent"),
          new z(r)
        );
      },
      scheduleInRootZone: n,
    });
  return Fn([{ provide: Mv, useValue: !0 }, t]);
}
function uf(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var Nv = (() => {
  class e {
    subscription = new q();
    initialized = !1;
    zone = p(z);
    pendingTasks = p(qe);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let t = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (t = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (z.assertNotInAngularZone(),
                queueMicrotask(() => {
                  t !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(t), (t = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (z.assertInAngularZone(), (t ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var Ha = new y(""),
  xv = new y("");
function lr(e) {
  return !e.moduleRef;
}
function Rv(e) {
  let n = lr(e) ? e.r3Injector : e.moduleRef.injector,
    t = n.get(z);
  return t.run(() => {
    lr(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = n.get(We),
      o;
    if (
      (t.runOutsideAngular(() => {
        o = t.onError.subscribe({ next: r });
      }),
      lr(e))
    ) {
      let i = () => n.destroy(),
        s = e.platformInjector.get(Ha);
      (s.add(i),
        n.onDestroy(() => {
          (o.unsubscribe(), s.delete(i));
        }));
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Ha);
      (s.add(i),
        e.moduleRef.onDestroy(() => {
          (Kn(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i));
        }));
    }
    return Ov(r, t, () => {
      let i = n.get(qe),
        s = i.add(),
        a = n.get(Pa);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let c = n.get(ja, cr);
            if ((Xd(c || cr), !n.get(xv, !0)))
              return lr(e)
                ? n.get(xt)
                : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (lr(e)) {
              let u = n.get(xt);
              return (
                e.rootComponent !== void 0 && u.bootstrap(e.rootComponent),
                u
              );
            } else
              return (Av?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => {
            i.remove(s);
          })
      );
    });
  });
}
var Av;
function Ov(e, n, t) {
  try {
    let r = t();
    return ar(r)
      ? r.catch((o) => {
          throw (n.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (n.runOutsideAngular(() => e(r)), r);
  }
}
var Jo = null;
function kv(e = [], n) {
  return Oe.create({
    name: n,
    providers: [
      { provide: jn, useValue: "platform" },
      { provide: Ha, useValue: new Set([() => (Jo = null)]) },
      ...e,
    ],
  });
}
function Pv(e = []) {
  if (Jo) return Jo;
  let n = kv(e);
  return ((Jo = n), Yd(), Lv(n), n);
}
function Lv(e) {
  let n = e.get(Vo, null);
  ne(e, () => {
    n?.forEach((t) => t());
  });
}
var Fv = 1e4;
var Pk = Fv - 1e3;
var df = (() => {
  class e {
    static __NG_ELEMENT_ID__ = jv;
  }
  return e;
})();
function jv(e) {
  return Hv(ze(), he(), (e & 16) === 16);
}
function Hv(e, n, t) {
  if (Dt(e) && !t) {
    let r = Be(e.index, n);
    return new Mt(r, r);
  } else if (e.type & 175) {
    let r = n[Ee];
    return new Mt(r, n);
  }
  return null;
}
function ff(e) {
  let {
    rootComponent: n,
    appProviders: t,
    platformProviders: r,
    platformRef: o,
  } = e;
  j(k.BootstrapApplicationStart);
  try {
    let i = o?.injector ?? Pv(r),
      s = [tf(), iu, ...(t || [])],
      a = new tr({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return Rv({
      r3Injector: a.injector,
      platformInjector: i,
      rootComponent: n,
    });
  } catch (i) {
    return Promise.reject(i);
  } finally {
    j(k.BootstrapApplicationEnd);
  }
}
var pf = null;
function Ge() {
  return pf;
}
function Ua(e) {
  pf ??= e;
}
var ur = class {},
  Xo = (() => {
    class e {
      historyGo(t) {
        throw new Error("");
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({
        token: e,
        factory: () => p(hf),
        providedIn: "platform",
      });
    }
    return e;
  })();
var hf = (() => {
  class e extends Xo {
    _location;
    _history;
    _doc = p(Q);
    constructor() {
      (super(),
        (this._location = window.location),
        (this._history = window.history));
    }
    getBaseHrefFromDOM() {
      return Ge().getBaseHref(this._doc);
    }
    onPopState(t) {
      let r = Ge().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", t, !1),
        () => r.removeEventListener("popstate", t)
      );
    }
    onHashChange(t) {
      let r = Ge().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("hashchange", t, !1),
        () => r.removeEventListener("hashchange", t)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(t) {
      this._location.pathname = t;
    }
    pushState(t, r, o) {
      this._history.pushState(t, r, o);
    }
    replaceState(t, r, o) {
      this._history.replaceState(t, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(t = 0) {
      this._history.go(t);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = E({
      token: e,
      factory: () => new e(),
      providedIn: "platform",
    });
  }
  return e;
})();
function vf(e, n) {
  return e
    ? n
      ? e.endsWith("/")
        ? n.startsWith("/")
          ? e + n.slice(1)
          : e + n
        : n.startsWith("/")
          ? e + n
          : `${e}/${n}`
      : e
    : n;
}
function gf(e) {
  let n = e.search(/#|\?|$/);
  return e[n - 1] === "/" ? e.slice(0, n - 1) + e.slice(n) : e;
}
function it(e) {
  return e && e[0] !== "?" ? `?${e}` : e;
}
var ei = (() => {
    class e {
      historyGo(t) {
        throw new Error("");
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: () => p(Vv), providedIn: "root" });
    }
    return e;
  })(),
  Uv = new y(""),
  Vv = (() => {
    class e extends ei {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(t, r) {
        (super(),
          (this._platformLocation = t),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(Q).location?.origin ??
            ""));
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(t) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(t),
          this._platformLocation.onHashChange(t),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(t) {
        return vf(this._baseHref, t);
      }
      path(t = !1) {
        let r =
            this._platformLocation.pathname + it(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && t ? `${r}${o}` : r;
      }
      pushState(t, r, o, i) {
        let s = this.prepareExternalUrl(o + it(i));
        this._platformLocation.pushState(t, r, s);
      }
      replaceState(t, r, o, i) {
        let s = this.prepareExternalUrl(o + it(i));
        this._platformLocation.replaceState(t, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(t = 0) {
        this._platformLocation.historyGo?.(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Xo), T(Uv, 8));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
var an = (() => {
  class e {
    _subject = new te();
    _basePath;
    _locationStrategy;
    _urlChangeListeners = [];
    _urlChangeSubscription = null;
    constructor(t) {
      this._locationStrategy = t;
      let r = this._locationStrategy.getBaseHref();
      ((this._basePath = zv(gf(mf(r)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.next({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
          });
        }));
    }
    ngOnDestroy() {
      (this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []));
    }
    path(t = !1) {
      return this.normalize(this._locationStrategy.path(t));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(t, r = "") {
      return this.path() == this.normalize(t + it(r));
    }
    normalize(t) {
      return e.stripTrailingSlash(Bv(this._basePath, mf(t)));
    }
    prepareExternalUrl(t) {
      return (
        t && t[0] !== "/" && (t = "/" + t),
        this._locationStrategy.prepareExternalUrl(t)
      );
    }
    go(t, r = "", o = null) {
      (this._locationStrategy.pushState(o, "", t, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(t + it(r)), o));
    }
    replaceState(t, r = "", o = null) {
      (this._locationStrategy.replaceState(o, "", t, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(t + it(r)), o));
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(t = 0) {
      this._locationStrategy.historyGo?.(t);
    }
    onUrlChange(t) {
      return (
        this._urlChangeListeners.push(t),
        (this._urlChangeSubscription ??= this.subscribe((r) => {
          this._notifyUrlChangeListeners(r.url, r.state);
        })),
        () => {
          let r = this._urlChangeListeners.indexOf(t);
          (this._urlChangeListeners.splice(r, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null)));
        }
      );
    }
    _notifyUrlChangeListeners(t = "", r) {
      this._urlChangeListeners.forEach((o) => o(t, r));
    }
    subscribe(t, r, o) {
      return this._subject.subscribe({
        next: t,
        error: r ?? void 0,
        complete: o ?? void 0,
      });
    }
    static normalizeQueryParams = it;
    static joinWithSlash = vf;
    static stripTrailingSlash = gf;
    static ɵfac = function (r) {
      return new (r || e)(T(ei));
    };
    static ɵprov = E({ token: e, factory: () => $v(), providedIn: "root" });
  }
  return e;
})();
function $v() {
  return new an(T(ei));
}
function Bv(e, n) {
  if (!e || !n.startsWith(e)) return n;
  let t = n.substring(e.length);
  return t === "" || ["/", ";", "?", "#"].includes(t[0]) ? t : n;
}
function mf(e) {
  return e.replace(/\/index.html$/, "");
}
function zv(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, t] = e.split(/\/\/[^\/]+/);
    return t;
  }
  return e;
}
function Va(e, n) {
  n = encodeURIComponent(n);
  for (let t of e.split(";")) {
    let r = t.indexOf("="),
      [o, i] = r == -1 ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
    if (o.trim() === n) return decodeURIComponent(i);
  }
  return null;
}
var dr = class {};
var yf = "browser";
var fr = class {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    manager;
  },
  ti = (() => {
    class e extends fr {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return !0;
      }
      addEventListener(t, r, o, i) {
        return (
          t.addEventListener(r, o, i),
          () => this.removeEventListener(t, r, o, i)
        );
      }
      removeEventListener(t, r, o, i) {
        return t.removeEventListener(r, o, i);
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Q));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  oi = new y(""),
  qa = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(t, r) {
        ((this._zone = r),
          t.forEach((s) => {
            s.manager = this;
          }));
        let o = t.filter((s) => !(s instanceof ti));
        this._plugins = o.slice().reverse();
        let i = t.find((s) => s instanceof ti);
        i && this._plugins.push(i);
      }
      addEventListener(t, r, o, i) {
        return this._findPluginFor(r).addEventListener(t, r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(t) {
        let r = this._eventNameToPlugin.get(t);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(t))), !r))
          throw new v(5101, !1);
        return (this._eventNameToPlugin.set(t, r), r);
      }
      static ɵfac = function (r) {
        return new (r || e)(T(oi), T(z));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  $a = "ng-app-id";
function Ef(e) {
  for (let n of e) n.remove();
}
function If(e, n) {
  let t = n.createElement("style");
  return ((t.textContent = e), t);
}
function qv(e, n, t, r) {
  let o = e.head?.querySelectorAll(`style[${$a}="${n}"],link[${$a}="${n}"]`);
  if (o)
    for (let i of o)
      (i.removeAttribute($a),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
              usage: 0,
              elements: [i],
            })
          : i.textContent && t.set(i.textContent, { usage: 0, elements: [i] }));
}
function za(e, n) {
  let t = n.createElement("link");
  return (t.setAttribute("rel", "stylesheet"), t.setAttribute("href", e), t);
}
var Wa = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(t, r, o, i = {}) {
        ((this.doc = t),
          (this.appId = r),
          (this.nonce = o),
          qv(t, r, this.inline, this.external),
          this.hosts.add(t.head));
      }
      addStyles(t, r) {
        for (let o of t) this.addUsage(o, this.inline, If);
        r?.forEach((o) => this.addUsage(o, this.external, za));
      }
      removeStyles(t, r) {
        for (let o of t) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(t, r, o) {
        let i = r.get(t);
        i
          ? i.usage++
          : r.set(t, {
              usage: 1,
              elements: [...this.hosts].map((s) =>
                this.addElement(s, o(t, this.doc)),
              ),
            });
      }
      removeUsage(t, r) {
        let o = r.get(t);
        o && (o.usage--, o.usage <= 0 && (Ef(o.elements), r.delete(t)));
      }
      ngOnDestroy() {
        for (let [, { elements: t }] of [...this.inline, ...this.external])
          Ef(t);
        this.hosts.clear();
      }
      addHost(t) {
        this.hosts.add(t);
        for (let [r, { elements: o }] of this.inline)
          o.push(this.addElement(t, If(r, this.doc)));
        for (let [r, { elements: o }] of this.external)
          o.push(this.addElement(t, za(r, this.doc)));
      }
      removeHost(t) {
        this.hosts.delete(t);
      }
      addElement(t, r) {
        return (
          this.nonce && r.setAttribute("nonce", this.nonce),
          t.appendChild(r)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Q), T(Uo), T($o, 8), T(rr));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ba = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Ga = /%COMP%/g;
var Df = "%COMP%",
  Wv = `_nghost-${Df}`,
  Gv = `_ngcontent-${Df}`,
  Qv = !0,
  Zv = new y("", { factory: () => Qv });
function Yv(e) {
  return Gv.replace(Ga, e);
}
function Kv(e) {
  return Wv.replace(Ga, e);
}
function Cf(e, n) {
  return n.map((t) => t.replace(Ga, e));
}
var Qa = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      constructor(t, r, o, i, s, a, c = null, l = null) {
        ((this.eventManager = t),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.ngZone = a),
          (this.nonce = c),
          (this.tracingService = l),
          (this.defaultRenderer = new pr(t, s, a, this.tracingService)));
      }
      createRenderer(t, r) {
        if (!t || !r) return this.defaultRenderer;
        let o = this.getOrCreateRenderer(t, r);
        return (
          o instanceof ri
            ? o.applyToHost(t)
            : o instanceof hr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(t, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.tracingService;
          switch (r.encapsulation) {
            case _e.Emulated:
              i = new ri(c, l, r, this.appId, u, s, a, d);
              break;
            case _e.ShadowDom:
              return new ni(c, t, r, s, a, this.nonce, d, l);
            case _e.ExperimentalIsolatedShadowDom:
              return new ni(c, t, r, s, a, this.nonce, d);
            default:
              i = new hr(c, l, r, u, s, a, d);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(t) {
        this.rendererByCompId.delete(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          T(qa),
          T(Wa),
          T(Uo),
          T(Zv),
          T(Q),
          T(z),
          T($o),
          T(sn, 8),
        );
      };
      static ɵprov = E({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  pr = class {
    eventManager;
    doc;
    ngZone;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(n, t, r, o) {
      ((this.eventManager = n),
        (this.doc = t),
        (this.ngZone = r),
        (this.tracingService = o));
    }
    destroy() {}
    destroyNode = null;
    createElement(n, t) {
      return t
        ? this.doc.createElementNS(Ba[t] || t, n)
        : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, t) {
      (wf(n) ? n.content : n).appendChild(t);
    }
    insertBefore(n, t, r) {
      n && (wf(n) ? n.content : n).insertBefore(t, r);
    }
    removeChild(n, t) {
      t.remove();
    }
    selectRootElement(n, t) {
      let r = typeof n == "string" ? this.doc.querySelector(n) : n;
      if (!r) throw new v(-5104, !1);
      return (t || (r.textContent = ""), r);
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, t, r, o) {
      if (o) {
        t = o + ":" + t;
        let i = Ba[o];
        i ? n.setAttributeNS(i, t, r) : n.setAttribute(t, r);
      } else n.setAttribute(t, r);
    }
    removeAttribute(n, t, r) {
      if (r) {
        let o = Ba[r];
        o ? n.removeAttributeNS(o, t) : n.removeAttribute(`${r}:${t}`);
      } else n.removeAttribute(t);
    }
    addClass(n, t) {
      n.classList.add(t);
    }
    removeClass(n, t) {
      n.classList.remove(t);
    }
    setStyle(n, t, r, o) {
      o & (Nt.DashCase | Nt.Important)
        ? n.style.setProperty(t, r, o & Nt.Important ? "important" : "")
        : (n.style[t] = r);
    }
    removeStyle(n, t, r) {
      r & Nt.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
    }
    setProperty(n, t, r) {
      n != null && (n[t] = r);
    }
    setValue(n, t) {
      n.nodeValue = t;
    }
    listen(n, t, r, o) {
      if (
        typeof n == "string" &&
        ((n = Ge().getGlobalEventTarget(this.doc, n)), !n)
      )
        throw new v(5102, !1);
      let i = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (i = this.tracingService.wrapEventListener(n, t, i)),
        this.eventManager.addEventListener(n, t, i, o)
      );
    }
    decoratePreventDefault(n) {
      return (t) => {
        if (t === "__ngUnwrap__") return n;
        n(t) === !1 && t.preventDefault();
      };
    }
  };
function wf(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var ni = class extends pr {
    hostEl;
    sharedStylesHost;
    shadowRoot;
    constructor(n, t, r, o, i, s, a, c) {
      (super(n, o, i, a),
        (this.hostEl = t),
        (this.sharedStylesHost = c),
        (this.shadowRoot = t.attachShadow({ mode: "open" })),
        this.sharedStylesHost &&
          this.sharedStylesHost.addHost(this.shadowRoot));
      let l = r.styles;
      l = Cf(r.id, l);
      for (let d of l) {
        let h = document.createElement("style");
        (s && h.setAttribute("nonce", s),
          (h.textContent = d),
          this.shadowRoot.appendChild(h));
      }
      let u = r.getExternalStyles?.();
      if (u)
        for (let d of u) {
          let h = za(d, o);
          (s && h.setAttribute("nonce", s), this.shadowRoot.appendChild(h));
        }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, t) {
      return super.appendChild(this.nodeOrShadowRoot(n), t);
    }
    insertBefore(n, t, r) {
      return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
    }
    removeChild(n, t) {
      return super.removeChild(null, t);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost &&
        this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  hr = class extends pr {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(n, t, r, o, i, s, a, c) {
      (super(n, i, s, a),
        (this.sharedStylesHost = t),
        (this.removeStylesOnCompDestroy = o));
      let l = r.styles;
      ((this.styles = c ? Cf(c, l) : l),
        (this.styleUrls = r.getExternalStyles?.(c)));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        nn.size === 0 &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  ri = class extends hr {
    contentAttr;
    hostAttr;
    constructor(n, t, r, o, i, s, a, c) {
      let l = o + "-" + r.id;
      (super(n, t, r, i, s, a, c, l),
        (this.contentAttr = Yv(l)),
        (this.hostAttr = Kv(l)));
    }
    applyToHost(n) {
      (this.applyStyles(), this.setAttribute(n, this.hostAttr, ""));
    }
    createElement(n, t) {
      let r = super.createElement(n, t);
      return (super.setAttribute(r, this.contentAttr, ""), r);
    }
  };
var ii = class e extends ur {
    supportsDOMEvents = !0;
    static makeCurrent() {
      Ua(new e());
    }
    onAndCancel(n, t, r, o) {
      return (
        n.addEventListener(t, r, o),
        () => {
          n.removeEventListener(t, r, o);
        }
      );
    }
    dispatchEvent(n, t) {
      n.dispatchEvent(t);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, t) {
      return ((t = t || this.getDefaultDocument()), t.createElement(n));
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(n) {
      return n instanceof DocumentFragment;
    }
    getGlobalEventTarget(n, t) {
      return t === "window"
        ? window
        : t === "document"
          ? n
          : t === "body"
            ? n.body
            : null;
    }
    getBaseHref(n) {
      let t = Jv();
      return t == null ? null : Xv(t);
    }
    resetBaseElement() {
      gr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return Va(document.cookie, n);
    }
  },
  gr = null;
function Jv() {
  return (
    (gr = gr || document.head.querySelector("base")),
    gr ? gr.getAttribute("href") : null
  );
}
function Xv(e) {
  return new URL(e, document.baseURI).pathname;
}
var ey = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  bf = ["alt", "control", "meta", "shift"],
  ty = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  ny = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Sf = (() => {
    class e extends fr {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return e.parseEventName(t) != null;
      }
      addEventListener(t, r, o, i) {
        let s = e.parseEventName(r),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Ge().onAndCancel(t, s.domEventName, a, i));
      }
      static parseEventName(t) {
        let r = t.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (s = "code.")),
          bf.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (s += l + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let c = {};
        return ((c.domEventName = o), (c.fullKey = s), c);
      }
      static matchEventFullKeyCode(t, r) {
        let o = ty[t.key] || t.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = t.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              bf.forEach((s) => {
                if (s !== o) {
                  let a = ny[s];
                  a(t) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(t, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, t) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(t) {
        return t === "esc" ? "escape" : t;
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Q));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Za(e, n, t) {
  return U(this, null, function* () {
    let r = g({ rootComponent: e }, ry(n, t));
    return ff(r);
  });
}
function ry(e, n) {
  return {
    platformRef: n?.platformRef,
    appProviders: [...cy, ...(e?.providers ?? [])],
    platformProviders: ay,
  };
}
function oy() {
  ii.makeCurrent();
}
function iy() {
  return new $e();
}
function sy() {
  return (Ca(document), document);
}
var ay = [
  { provide: rr, useValue: yf },
  { provide: Vo, useValue: oy, multi: !0 },
  { provide: Q, useFactory: sy },
];
var cy = [
  { provide: jn, useValue: "root" },
  { provide: $e, useFactory: iy },
  { provide: oi, useClass: ti, multi: !0 },
  { provide: oi, useClass: Sf, multi: !0 },
  Qa,
  Wa,
  qa,
  { provide: _t, useExisting: Qa },
  { provide: dr, useClass: ey },
  [],
];
var Tf = (() => {
  class e {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(t) {
      this._doc.title = t || "";
    }
    static ɵfac = function (r) {
      return new (r || e)(T(Q));
    };
    static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var b = "primary",
  Mr = Symbol("RouteTitle"),
  ec = class {
    params;
    constructor(n) {
      this.params = n || {};
    }
    has(n) {
      return Object.prototype.hasOwnProperty.call(this.params, n);
    }
    get(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t[0] : t;
      }
      return null;
    }
    getAll(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t : [t];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function dn(e) {
  return new ec(e);
}
function Ya(e, n, t) {
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = n[r];
    if (o[0] === ":") t[o.substring(1)] = i;
    else if (o !== i.path) return !1;
  }
  return !0;
}
function dy(e, n, t) {
  let r = t.path.split("/"),
    o = r.indexOf("**");
  if (o === -1) {
    if (
      r.length > e.length ||
      (t.pathMatch === "full" && (n.hasChildren() || r.length < e.length))
    )
      return null;
    let c = {},
      l = e.slice(0, r.length);
    return Ya(r, l, c) ? { consumed: l, posParams: c } : null;
  }
  if (o !== r.lastIndexOf("**")) return null;
  let i = r.slice(0, o),
    s = r.slice(o + 1);
  if (
    i.length + s.length > e.length ||
    (t.pathMatch === "full" && n.hasChildren() && t.path !== "**")
  )
    return null;
  let a = {};
  return !Ya(i, e.slice(0, i.length), a) ||
    !Ya(s, e.slice(e.length - s.length), a)
    ? null
    : { consumed: e, posParams: a };
}
function di(e) {
  return new Promise((n, t) => {
    e.pipe(Ue()).subscribe({ next: (r) => n(r), error: (r) => t(r) });
  });
}
function fy(e, n) {
  if (e.length !== n.length) return !1;
  for (let t = 0; t < e.length; ++t) if (!Fe(e[t], n[t])) return !1;
  return !0;
}
function Fe(e, n) {
  let t = e ? tc(e) : void 0,
    r = n ? tc(n) : void 0;
  if (!t || !r || t.length != r.length) return !1;
  let o;
  for (let i = 0; i < t.length; i++)
    if (((o = t[i]), !kf(e[o], n[o]))) return !1;
  return !0;
}
function tc(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function kf(e, n) {
  if (Array.isArray(e) && Array.isArray(n)) {
    if (e.length !== n.length) return !1;
    let t = [...e].sort(),
      r = [...n].sort();
    return t.every((o, i) => r[i] === o);
  } else return e === n;
}
function py(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Lt(e) {
  return eo(e) ? e : ar(e) ? B(Promise.resolve(e)) : _(e);
}
function Pf(e) {
  return eo(e) ? di(e) : Promise.resolve(e);
}
var hy = { exact: jf, subset: Hf },
  Lf = { exact: gy, subset: my, ignored: () => !0 },
  Ff = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  nc = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  };
function Mf(e, n, t) {
  return (
    hy[t.paths](e.root, n.root, t.matrixParams) &&
    Lf[t.queryParams](e.queryParams, n.queryParams) &&
    !(t.fragment === "exact" && e.fragment !== n.fragment)
  );
}
function gy(e, n) {
  return Fe(e, n);
}
function jf(e, n, t) {
  if (
    !Ot(e.segments, n.segments) ||
    !ci(e.segments, n.segments, t) ||
    e.numberOfChildren !== n.numberOfChildren
  )
    return !1;
  for (let r in n.children)
    if (!e.children[r] || !jf(e.children[r], n.children[r], t)) return !1;
  return !0;
}
function my(e, n) {
  return (
    Object.keys(n).length <= Object.keys(e).length &&
    Object.keys(n).every((t) => kf(e[t], n[t]))
  );
}
function Hf(e, n, t) {
  return Uf(e, n, n.segments, t);
}
function Uf(e, n, t, r) {
  if (e.segments.length > t.length) {
    let o = e.segments.slice(0, t.length);
    return !(!Ot(o, t) || n.hasChildren() || !ci(o, t, r));
  } else if (e.segments.length === t.length) {
    if (!Ot(e.segments, t) || !ci(e.segments, t, r)) return !1;
    for (let o in n.children)
      if (!e.children[o] || !Hf(e.children[o], n.children[o], r)) return !1;
    return !0;
  } else {
    let o = t.slice(0, e.segments.length),
      i = t.slice(e.segments.length);
    return !Ot(e.segments, o) || !ci(e.segments, o, r) || !e.children[b]
      ? !1
      : Uf(e.children[b], n, i, r);
  }
}
function ci(e, n, t) {
  return n.every((r, o) => Lf[t](e[o].parameters, r.parameters));
}
var Re = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(n = new O([], {}), t = {}, r = null) {
      ((this.root = n), (this.queryParams = t), (this.fragment = r));
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= dn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      return Ey.serialize(this);
    }
  },
  O = class {
    segments;
    children;
    parent = null;
    constructor(n, t) {
      ((this.segments = n),
        (this.children = t),
        Object.values(t).forEach((r) => (r.parent = this)));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return li(this);
    }
  },
  At = class {
    path;
    parameters;
    _parameterMap;
    constructor(n, t) {
      ((this.path = n), (this.parameters = t));
    }
    get parameterMap() {
      return ((this._parameterMap ??= dn(this.parameters)), this._parameterMap);
    }
    toString() {
      return $f(this);
    }
  };
function vy(e, n) {
  return Ot(e, n) && e.every((t, r) => Fe(t.parameters, n[r].parameters));
}
function Ot(e, n) {
  return e.length !== n.length ? !1 : e.every((t, r) => t.path === n[r].path);
}
function yy(e, n) {
  let t = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === b && (t = t.concat(n(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== b && (t = t.concat(n(o, r)));
    }),
    t
  );
}
var wi = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({
        token: e,
        factory: () => new kt(),
        providedIn: "root",
      });
    }
    return e;
  })(),
  kt = class {
    parse(n) {
      let t = new oc(n);
      return new Re(
        t.parseRootSegment(),
        t.parseQueryParams(),
        t.parseFragment(),
      );
    }
    serialize(n) {
      let t = `/${mr(n.root, !0)}`,
        r = Dy(n.queryParams),
        o = typeof n.fragment == "string" ? `#${Iy(n.fragment)}` : "";
      return `${t}${r}${o}`;
    }
  },
  Ey = new kt();
function li(e) {
  return e.segments.map((n) => $f(n)).join("/");
}
function mr(e, n) {
  if (!e.hasChildren()) return li(e);
  if (n) {
    let t = e.children[b] ? mr(e.children[b], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== b && r.push(`${o}:${mr(i, !1)}`);
      }),
      r.length > 0 ? `${t}(${r.join("//")})` : t
    );
  } else {
    let t = yy(e, (r, o) =>
      o === b ? [mr(e.children[b], !1)] : [`${o}:${mr(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[b] != null
      ? `${li(e)}/${t[0]}`
      : `${li(e)}/(${t.join("//")})`;
  }
}
function Vf(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function si(e) {
  return Vf(e).replace(/%3B/gi, ";");
}
function Iy(e) {
  return encodeURI(e);
}
function rc(e) {
  return Vf(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function ui(e) {
  return decodeURIComponent(e);
}
function _f(e) {
  return ui(e.replace(/\+/g, "%20"));
}
function $f(e) {
  return `${rc(e.path)}${wy(e.parameters)}`;
}
function wy(e) {
  return Object.entries(e)
    .map(([n, t]) => `;${rc(n)}=${rc(t)}`)
    .join("");
}
function Dy(e) {
  let n = Object.entries(e)
    .map(([t, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${si(t)}=${si(o)}`).join("&")
        : `${si(t)}=${si(r)}`,
    )
    .filter((t) => t);
  return n.length ? `?${n.join("&")}` : "";
}
var Cy = /^[^\/()?;#]+/;
function Ka(e) {
  let n = e.match(Cy);
  return n ? n[0] : "";
}
var by = /^[^\/()?;=#]+/;
function Sy(e) {
  let n = e.match(by);
  return n ? n[0] : "";
}
var Ty = /^[^=?&#]+/;
function My(e) {
  let n = e.match(Ty);
  return n ? n[0] : "";
}
var _y = /^[^&#]+/;
function Ny(e) {
  let n = e.match(_y);
  return n ? n[0] : "";
}
var oc = class {
  url;
  remaining;
  constructor(n) {
    ((this.url = n), (this.remaining = n));
  }
  parseRootSegment() {
    for (; this.consumeOptional("/"); );
    return this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
      ? new O([], {})
      : new O([], this.parseChildren());
  }
  parseQueryParams() {
    let n = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(n);
      while (this.consumeOptional("&"));
    return n;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren(n = 0) {
    if (n > 50) throw new v(4010, !1);
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");
    )
      (this.capture("/"), t.push(this.parseSegment()));
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0, n)));
    let o = {};
    return (
      this.peekStartsWith("(") && (o = this.parseParens(!1, n)),
      (t.length > 0 || Object.keys(r).length > 0) && (o[b] = new O(t, r)),
      o
    );
  }
  parseSegment() {
    let n = Ka(this.remaining);
    if (n === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return (this.capture(n), new At(ui(n), this.parseMatrixParams()));
  }
  parseMatrixParams() {
    let n = {};
    for (; this.consumeOptional(";"); ) this.parseParam(n);
    return n;
  }
  parseParam(n) {
    let t = Sy(this.remaining);
    if (!t) return;
    this.capture(t);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = Ka(this.remaining);
      o && ((r = o), this.capture(r));
    }
    n[ui(t)] = ui(r);
  }
  parseQueryParam(n) {
    let t = My(this.remaining);
    if (!t) return;
    this.capture(t);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = Ny(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = _f(t),
      i = _f(r);
    if (n.hasOwnProperty(o)) {
      let s = n[o];
      (Array.isArray(s) || ((s = [s]), (n[o] = s)), s.push(i));
    } else n[o] = i;
  }
  parseParens(n, t) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;
    ) {
      let o = Ka(this.remaining),
        i = this.remaining[o.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new v(4010, !1);
      let s;
      o.indexOf(":") > -1
        ? ((s = o.slice(0, o.indexOf(":"))), this.capture(s), this.capture(":"))
        : n && (s = b);
      let a = this.parseChildren(t + 1);
      ((r[s ?? b] = Object.keys(a).length === 1 && a[b] ? a[b] : new O([], a)),
        this.consumeOptional("//"));
    }
    return r;
  }
  peekStartsWith(n) {
    return this.remaining.startsWith(n);
  }
  consumeOptional(n) {
    return this.peekStartsWith(n)
      ? ((this.remaining = this.remaining.substring(n.length)), !0)
      : !1;
  }
  capture(n) {
    if (!this.consumeOptional(n)) throw new v(4011, !1);
  }
};
function Bf(e) {
  return e.segments.length > 0 ? new O([], { [b]: e }) : e;
}
function zf(e) {
  let n = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = zf(o);
    if (r === b && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) n[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (n[r] = i);
  }
  let t = new O(e.segments, n);
  return xy(t);
}
function xy(e) {
  if (e.numberOfChildren === 1 && e.children[b]) {
    let n = e.children[b];
    return new O(e.segments.concat(n.segments), n.children);
  }
  return e;
}
function fn(e) {
  return e instanceof Re;
}
function Ry(e, n, t = null, r = null, o = new kt()) {
  let i = qf(e);
  return Wf(i, n, t, r, o);
}
function qf(e) {
  let n;
  function t(i) {
    let s = {};
    for (let c of i.children) {
      let l = t(c);
      s[c.outlet] = l;
    }
    let a = new O(i.url, s);
    return (i === e && (n = a), a);
  }
  let r = t(e.root),
    o = Bf(r);
  return n ?? o;
}
function Wf(e, n, t, r, o) {
  let i = e;
  for (; i.parent; ) i = i.parent;
  if (n.length === 0) return Ja(i, i, i, t, r, o);
  let s = Ay(n);
  if (s.toRoot()) return Ja(i, i, new O([], {}), t, r, o);
  let a = Oy(s, i, e),
    c = a.processChildren
      ? yr(a.segmentGroup, a.index, s.commands)
      : Qf(a.segmentGroup, a.index, s.commands);
  return Ja(i, a.segmentGroup, c, t, r, o);
}
function fi(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function wr(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Nf(e, n, t) {
  e ||= "\u0275";
  let r = new Re();
  return ((r.queryParams = { [e]: n }), t.parse(t.serialize(r)).queryParams[e]);
}
function Ja(e, n, t, r, o, i) {
  let s = {};
  for (let [l, u] of Object.entries(r ?? {}))
    s[l] = Array.isArray(u) ? u.map((d) => Nf(l, d, i)) : Nf(l, u, i);
  let a;
  e === n ? (a = t) : (a = Gf(e, n, t));
  let c = Bf(zf(a));
  return new Re(c, s, o);
}
function Gf(e, n, t) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === n ? (r[o] = t) : (r[o] = Gf(i, n, t));
    }),
    new O(e.segments, r)
  );
}
var pi = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(n, t, r) {
    if (
      ((this.isAbsolute = n),
      (this.numberOfDoubleDots = t),
      (this.commands = r),
      n && r.length > 0 && fi(r[0]))
    )
      throw new v(4003, !1);
    let o = r.find(wr);
    if (o && o !== py(r)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function Ay(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new pi(!0, 0, e);
  let n = 0,
    t = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
          ? (i.split("/").forEach((a, c) => {
              (c == 0 && a === ".") ||
                (c == 0 && a === ""
                  ? (t = !0)
                  : a === ".."
                    ? n++
                    : a != "" && o.push(a));
            }),
            o)
          : [...o, i];
    }, []);
  return new pi(t, n, r);
}
var ln = class {
  segmentGroup;
  processChildren;
  index;
  constructor(n, t, r) {
    ((this.segmentGroup = n), (this.processChildren = t), (this.index = r));
  }
};
function Oy(e, n, t) {
  if (e.isAbsolute) return new ln(n, !0, 0);
  if (!t) return new ln(n, !1, NaN);
  if (t.parent === null) return new ln(t, !0, 0);
  let r = fi(e.commands[0]) ? 0 : 1,
    o = t.segments.length - 1 + r;
  return ky(t, o, e.numberOfDoubleDots);
}
function ky(e, n, t) {
  let r = e,
    o = n,
    i = t;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new v(4005, !1);
    o = r.segments.length;
  }
  return new ln(r, !1, o - i);
}
function Py(e) {
  return wr(e[0]) ? e[0].outlets : { [b]: e };
}
function Qf(e, n, t) {
  if (((e ??= new O([], {})), e.segments.length === 0 && e.hasChildren()))
    return yr(e, n, t);
  let r = Ly(e, n, t),
    o = t.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new O(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[b] = new O(e.segments.slice(r.pathIndex), e.children)),
      yr(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new O(e.segments, {})
      : r.match && !e.hasChildren()
        ? ic(e, n, t)
        : r.match
          ? yr(e, 0, o)
          : ic(e, n, t);
}
function yr(e, n, t) {
  if (t.length === 0) return new O(e.segments, {});
  {
    let r = Py(t),
      o = {};
    if (
      Object.keys(r).some((i) => i !== b) &&
      e.children[b] &&
      e.numberOfChildren === 1 &&
      e.children[b].segments.length === 0
    ) {
      let i = yr(e.children[b], n, t);
      return new O(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        (typeof s == "string" && (s = [s]),
          s !== null && (o[i] = Qf(e.children[i], n, s)));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new O(e.segments, o)
    );
  }
}
function Ly(e, n, t) {
  let r = 0,
    o = n,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= t.length) return i;
    let s = e.segments[o],
      a = t[r];
    if (wr(a)) break;
    let c = `${a}`,
      l = r < t.length - 1 ? t[r + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!Rf(c, l, s)) return i;
      r += 2;
    } else {
      if (!Rf(c, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function ic(e, n, t) {
  let r = e.segments.slice(0, n),
    o = 0;
  for (; o < t.length; ) {
    let i = t[o];
    if (wr(i)) {
      let c = Fy(i.outlets);
      return new O(r, c);
    }
    if (o === 0 && fi(t[0])) {
      let c = e.segments[n];
      (r.push(new At(c.path, xf(t[0]))), o++);
      continue;
    }
    let s = wr(i) ? i.outlets[b] : `${i}`,
      a = o < t.length - 1 ? t[o + 1] : null;
    s && a && fi(a)
      ? (r.push(new At(s, xf(a))), (o += 2))
      : (r.push(new At(s, {})), o++);
  }
  return new O(r, {});
}
function Fy(e) {
  let n = {};
  return (
    Object.entries(e).forEach(([t, r]) => {
      (typeof r == "string" && (r = [r]),
        r !== null && (n[t] = ic(new O([], {}), 0, r)));
    }),
    n
  );
}
function xf(e) {
  let n = {};
  return (Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n);
}
function Rf(e, n, t) {
  return e == t.path && Fe(n, t.parameters);
}
var Er = "imperative",
  X = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(X || {}),
  we = class {
    id;
    url;
    constructor(n, t) {
      ((this.id = n), (this.url = t));
    }
  },
  pn = class extends we {
    type = X.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(n, t, r = "imperative", o = null) {
      (super(n, t), (this.navigationTrigger = r), (this.restoredState = o));
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  st = class extends we {
    urlAfterRedirects;
    type = X.NavigationEnd;
    constructor(n, t, r) {
      (super(n, t), (this.urlAfterRedirects = r));
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  ie = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      (e[(e.Aborted = 4)] = "Aborted"),
      e
    );
  })(ie || {}),
  hi = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(hi || {}),
  Ne = class extends we {
    reason;
    code;
    type = X.NavigationCancel;
    constructor(n, t, r, o) {
      (super(n, t), (this.reason = r), (this.code = o));
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  };
function Zf(e) {
  return (
    e instanceof Ne &&
    (e.code === ie.Redirect || e.code === ie.SupersededByNewNavigation)
  );
}
var at = class extends we {
    reason;
    code;
    type = X.NavigationSkipped;
    constructor(n, t, r, o) {
      (super(n, t), (this.reason = r), (this.code = o));
    }
  },
  hn = class extends we {
    error;
    target;
    type = X.NavigationError;
    constructor(n, t, r, o) {
      (super(n, t), (this.error = r), (this.target = o));
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  gi = class extends we {
    urlAfterRedirects;
    state;
    type = X.RoutesRecognized;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  sc = class extends we {
    urlAfterRedirects;
    state;
    type = X.GuardsCheckStart;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ac = class extends we {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = X.GuardsCheckEnd;
    constructor(n, t, r, o, i) {
      (super(n, t),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i));
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  cc = class extends we {
    urlAfterRedirects;
    state;
    type = X.ResolveStart;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  lc = class extends we {
    urlAfterRedirects;
    state;
    type = X.ResolveEnd;
    constructor(n, t, r, o) {
      (super(n, t), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  uc = class {
    route;
    type = X.RouteConfigLoadStart;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  dc = class {
    route;
    type = X.RouteConfigLoadEnd;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  fc = class {
    snapshot;
    type = X.ChildActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  pc = class {
    snapshot;
    type = X.ChildActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  hc = class {
    snapshot;
    type = X.ActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  gc = class {
    snapshot;
    type = X.ActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var gn = class {},
  Dr = class {},
  mn = class {
    url;
    navigationBehaviorOptions;
    constructor(n, t) {
      ((this.url = n), (this.navigationBehaviorOptions = t));
    }
  };
function jy(e) {
  return !(e instanceof gn) && !(e instanceof mn) && !(e instanceof Dr);
}
var mc = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return this.route?.snapshot._environmentInjector ?? this.rootInjector;
    }
    constructor(n) {
      ((this.rootInjector = n), (this.children = new _r(this.rootInjector)));
    }
  },
  _r = (() => {
    class e {
      rootInjector;
      contexts = new Map();
      constructor(t) {
        this.rootInjector = t;
      }
      onChildOutletCreated(t, r) {
        let o = this.getOrCreateContext(t);
        ((o.outlet = r), this.contexts.set(t, o));
      }
      onChildOutletDestroyed(t) {
        let r = this.getContext(t);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let t = this.contexts;
        return ((this.contexts = new Map()), t);
      }
      onOutletReAttached(t) {
        this.contexts = t;
      }
      getOrCreateContext(t) {
        let r = this.getContext(t);
        return (
          r || ((r = new mc(this.rootInjector)), this.contexts.set(t, r)),
          r
        );
      }
      getContext(t) {
        return this.contexts.get(t) || null;
      }
      static ɵfac = function (r) {
        return new (r || e)(T(W));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  mi = class {
    _root;
    constructor(n) {
      this._root = n;
    }
    get root() {
      return this._root.value;
    }
    parent(n) {
      let t = this.pathFromRoot(n);
      return t.length > 1 ? t[t.length - 2] : null;
    }
    children(n) {
      let t = vc(n, this._root);
      return t ? t.children.map((r) => r.value) : [];
    }
    firstChild(n) {
      let t = vc(n, this._root);
      return t && t.children.length > 0 ? t.children[0].value : null;
    }
    siblings(n) {
      let t = yc(n, this._root);
      return t.length < 2
        ? []
        : t[t.length - 2].children.map((o) => o.value).filter((o) => o !== n);
    }
    pathFromRoot(n) {
      return yc(n, this._root).map((t) => t.value);
    }
  };
function vc(e, n) {
  if (e === n.value) return n;
  for (let t of n.children) {
    let r = vc(e, t);
    if (r) return r;
  }
  return null;
}
function yc(e, n) {
  if (e === n.value) return [n];
  for (let t of n.children) {
    let r = yc(e, t);
    if (r.length) return (r.unshift(n), r);
  }
  return [];
}
var ge = class {
  value;
  children;
  constructor(n, t) {
    ((this.value = n), (this.children = t));
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function cn(e) {
  let n = {};
  return (e && e.children.forEach((t) => (n[t.value.outlet] = t)), n);
}
var vi = class extends mi {
  snapshot;
  constructor(n, t) {
    (super(n), (this.snapshot = t), _c(this, n));
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Yf(e, n) {
  let t = Hy(e, n),
    r = new Y([new At("", {})]),
    o = new Y({}),
    i = new Y({}),
    s = new Y({}),
    a = new Y(""),
    c = new Pt(r, o, s, a, i, b, e, t.root);
  return ((c.snapshot = t.root), new vi(new ge(c, []), t));
}
function Hy(e, n) {
  let t = {},
    r = {},
    o = {},
    s = new Cr([], t, o, "", r, b, e, null, {}, n);
  return new yi("", new ge(s, []));
}
var Pt = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(n, t, r, o, i, s, a, c) {
    ((this.urlSubject = n),
      (this.paramsSubject = t),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(V((l) => l[Mr])) ?? _(void 0)),
      (this.url = n),
      (this.params = t),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i));
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(V((n) => dn(n)))),
      this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(V((n) => dn(n)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Mc(e, n, t = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    n !== null &&
    (t === "always" ||
      o?.path === "" ||
      (!n.component && !n.routeConfig?.loadComponent))
      ? (r = {
          params: g(g({}, n.params), e.params),
          data: g(g({}, n.data), e.data),
          resolve: g(g(g(g({}, e.data), n.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: g({}, e.params),
          data: g({}, e.data),
          resolve: g(g({}, e.data), e._resolvedData ?? {}),
        }),
    o && Jf(o) && (r.resolve[Mr] = o.title),
    r
  );
}
var Cr = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    _environmentInjector;
    get title() {
      return this.data?.[Mr];
    }
    constructor(n, t, r, o, i, s, a, c, l, u) {
      ((this.url = n),
        (this.params = t),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l),
        (this._environmentInjector = u));
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return ((this._paramMap ??= dn(this.params)), this._paramMap);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= dn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      let n = this.url.map((r) => r.toString()).join("/"),
        t = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${n}', path:'${t}')`;
    }
  },
  yi = class extends mi {
    url;
    constructor(n, t) {
      (super(t), (this.url = n), _c(this, t));
    }
    toString() {
      return Kf(this._root);
    }
  };
function _c(e, n) {
  ((n.value._routerState = e), n.children.forEach((t) => _c(e, t)));
}
function Kf(e) {
  let n = e.children.length > 0 ? ` { ${e.children.map(Kf).join(", ")} } ` : "";
  return `${e.value}${n}`;
}
function Xa(e) {
  if (e.snapshot) {
    let n = e.snapshot,
      t = e._futureSnapshot;
    ((e.snapshot = t),
      Fe(n.queryParams, t.queryParams) ||
        e.queryParamsSubject.next(t.queryParams),
      n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
      Fe(n.params, t.params) || e.paramsSubject.next(t.params),
      fy(n.url, t.url) || e.urlSubject.next(t.url),
      Fe(n.data, t.data) || e.dataSubject.next(t.data));
  } else
    ((e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data));
}
function Ec(e, n) {
  let t = Fe(e.params, n.params) && vy(e.url, n.url),
    r = !e.parent != !n.parent;
  return t && !r && (!e.parent || Ec(e.parent, n.parent));
}
function Jf(e) {
  return typeof e.title == "string" || e.title === null;
}
var Uy = new y(""),
  Xf = (() => {
    class e {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = b;
      activateEvents = new oe();
      deactivateEvents = new oe();
      attachEvents = new oe();
      detachEvents = new oe();
      routerOutletData = cf();
      parentContexts = p(_r);
      location = p(Go);
      changeDetector = p(df);
      inputBinder = p(Di, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(t) {
        if (t.name) {
          let { firstChange: r, previousValue: o } = t.name;
          if (r) return;
          (this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName());
        }
      }
      ngOnDestroy() {
        (this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this));
      }
      isTrackedInParentContexts(t) {
        return this.parentContexts.getContext(t)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let t = this.parentContexts.getContext(this.name);
        t?.route &&
          (t.attachRef
            ? this.attach(t.attachRef, t.route)
            : this.activateWith(t.route, t.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new v(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new v(4012, !1);
        this.location.detach();
        let t = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(t.instance),
          t
        );
      }
      attach(t, r) {
        ((this.activated = t),
          (this._activatedRoute = r),
          this.location.insert(t.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(t.instance));
      }
      deactivate() {
        if (this.activated) {
          let t = this.component;
          (this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(t));
        }
      }
      activateWith(t, r) {
        if (this.isActivated) throw new v(4013, !1);
        this._activatedRoute = t;
        let o = this.location,
          s = t.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Ic(t, a, o.injector, this.routerOutletData);
        ((this.activated = o.createComponent(s, {
          index: o.length,
          injector: c,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = Aa({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name", routerOutletData: [1, "routerOutletData"] },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        features: [ya],
      });
    }
    return e;
  })(),
  Ic = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(n, t, r, o) {
      ((this.route = n),
        (this.childContexts = t),
        (this.parent = r),
        (this.outletData = o));
    }
    get(n, t) {
      return n === Pt
        ? this.route
        : n === _r
          ? this.childContexts
          : n === Uy
            ? this.outletData
            : this.parent.get(n, t);
    }
  },
  Di = new y("");
var ep = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵcmp = sr({
      type: e,
      selectors: [["ng-component"]],
      exportAs: ["emptyRouterOutlet"],
      decls: 1,
      vars: 0,
      template: function (r, o) {
        r & 1 && Yo(0, "router-outlet");
      },
      dependencies: [Xf],
      encapsulation: 2,
    });
  }
  return e;
})();
function Nc(e) {
  let n = e.children && e.children.map(Nc),
    t = n ? F(g({}, e), { children: n }) : g({}, e);
  return (
    !t.component &&
      !t.loadComponent &&
      (n || t.loadChildren) &&
      t.outlet &&
      t.outlet !== b &&
      (t.component = ep),
    t
  );
}
function Vy(e, n, t) {
  let r = br(e, n._root, t ? t._root : void 0);
  return new vi(r, n);
}
function br(e, n, t) {
  if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
    let r = t.value;
    r._futureSnapshot = n.value;
    let o = $y(e, n, t);
    return new ge(r, o);
  } else {
    if (e.shouldAttach(n.value)) {
      let i = e.retrieve(n.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = n.value),
          (s.children = n.children.map((a) => br(e, a))),
          s
        );
      }
    }
    let r = By(n.value),
      o = n.children.map((i) => br(e, i));
    return new ge(r, o);
  }
}
function $y(e, n, t) {
  return n.children.map((r) => {
    for (let o of t.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return br(e, r, o);
    return br(e, r);
  });
}
function By(e) {
  return new Pt(
    new Y(e.url),
    new Y(e.params),
    new Y(e.queryParams),
    new Y(e.fragment),
    new Y(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Sr = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(n, t) {
      ((this.redirectTo = n), (this.navigationBehaviorOptions = t));
    }
  },
  tp = "ngNavigationCancelingError";
function Ei(e, n) {
  let { redirectTo: t, navigationBehaviorOptions: r } = fn(n)
      ? { redirectTo: n, navigationBehaviorOptions: void 0 }
      : n,
    o = np(!1, ie.Redirect);
  return ((o.url = t), (o.navigationBehaviorOptions = r), o);
}
function np(e, n) {
  let t = new Error(`NavigationCancelingError: ${e || ""}`);
  return ((t[tp] = !0), (t.cancellationCode = n), t);
}
function zy(e) {
  return rp(e) && fn(e.url);
}
function rp(e) {
  return !!e && e[tp];
}
var wc = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(n, t, r, o, i) {
      ((this.routeReuseStrategy = n),
        (this.futureState = t),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i));
    }
    activate(n) {
      let t = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      (this.deactivateChildRoutes(t, r, n),
        Xa(this.futureState.root),
        this.activateChildRoutes(t, r, n));
    }
    deactivateChildRoutes(n, t, r) {
      let o = cn(t);
      (n.children.forEach((i) => {
        let s = i.value.outlet;
        (this.deactivateRoutes(i, o[s], r), delete o[s]);
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        }));
    }
    deactivateRoutes(n, t, r) {
      let o = n.value,
        i = t ? t.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(n, t, s.children);
        } else this.deactivateChildRoutes(n, t, r);
      else i && this.deactivateRouteAndItsChildren(t, r);
    }
    deactivateRouteAndItsChildren(n, t) {
      n.value.component &&
      this.routeReuseStrategy.shouldDetach(n.value.snapshot)
        ? this.detachAndStoreRouteSubtree(n, t)
        : this.deactivateRouteAndOutlet(n, t);
    }
    detachAndStoreRouteSubtree(n, t) {
      let r = t.getContext(n.value.outlet),
        o = r && n.value.component ? r.children : t,
        i = cn(n);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(n.value.snapshot, {
          componentRef: s,
          route: n,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(n, t) {
      let r = t.getContext(n.value.outlet),
        o = r && n.value.component ? r.children : t,
        i = cn(n);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(n, t, r) {
      let o = cn(t);
      (n.children.forEach((i) => {
        (this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new gc(i.value.snapshot)));
      }),
        n.children.length && this.forwardEvent(new pc(n.value.snapshot)));
    }
    activateRoutes(n, t, r) {
      let o = n.value,
        i = t ? t.value : null;
      if ((Xa(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(n, t, s.children);
        } else this.activateChildRoutes(n, t, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          (this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Xa(a.route.value),
            this.activateChildRoutes(n, null, s.children));
        } else
          ((s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(n, null, s.children));
      } else this.activateChildRoutes(n, null, r);
    }
  },
  Ii = class {
    path;
    route;
    constructor(n) {
      ((this.path = n), (this.route = this.path[this.path.length - 1]));
    }
  },
  un = class {
    component;
    route;
    constructor(n, t) {
      ((this.component = n), (this.route = t));
    }
  };
function qy(e, n, t) {
  let r = e._root,
    o = n ? n._root : null;
  return vr(r, o, t, [r.value]);
}
function Wy(e) {
  let n = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !n || n.length === 0 ? null : { node: e, guards: n };
}
function yn(e, n) {
  let t = Symbol(),
    r = n.get(e, t);
  return r === t ? (typeof e == "function" && !fs(e) ? e : n.get(e)) : r;
}
function vr(
  e,
  n,
  t,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = cn(n);
  return (
    e.children.forEach((s) => {
      (Gy(s, i[s.value.outlet], t, r.concat([s.value]), o),
        delete i[s.value.outlet]);
    }),
    Object.entries(i).forEach(([s, a]) => Ir(a, t.getContext(s), o)),
    o
  );
}
function Gy(
  e,
  n,
  t,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = e.value,
    s = n ? n.value : null,
    a = t ? t.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = Qy(s, i, i.routeConfig.runGuardsAndResolvers);
    (c
      ? o.canActivateChecks.push(new Ii(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? vr(e, n, a ? a.children : null, r, o) : vr(e, n, t, r, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new un(a.outlet.component, s)));
  } else
    (s && Ir(n, a, o),
      o.canActivateChecks.push(new Ii(r)),
      i.component
        ? vr(e, null, a ? a.children : null, r, o)
        : vr(e, null, t, r, o));
  return o;
}
function Qy(e, n, t) {
  if (typeof t == "function") return ne(n._environmentInjector, () => t(e, n));
  switch (t) {
    case "pathParamsChange":
      return !Ot(e.url, n.url);
    case "pathParamsOrQueryParamsChange":
      return !Ot(e.url, n.url) || !Fe(e.queryParams, n.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Ec(e, n) || !Fe(e.queryParams, n.queryParams);
    default:
      return !Ec(e, n);
  }
}
function Ir(e, n, t) {
  let r = cn(e),
    o = e.value;
  (Object.entries(r).forEach(([i, s]) => {
    o.component
      ? n
        ? Ir(s, n.children.getContext(i), t)
        : Ir(s, null, t)
      : Ir(s, n, t);
  }),
    o.component
      ? n && n.outlet && n.outlet.isActivated
        ? t.canDeactivateChecks.push(new un(n.outlet.component, o))
        : t.canDeactivateChecks.push(new un(null, o))
      : t.canDeactivateChecks.push(new un(null, o)));
}
function Nr(e) {
  return typeof e == "function";
}
function Zy(e) {
  return typeof e == "boolean";
}
function Yy(e) {
  return e && Nr(e.canLoad);
}
function Ky(e) {
  return e && Nr(e.canActivate);
}
function Jy(e) {
  return e && Nr(e.canActivateChild);
}
function Xy(e) {
  return e && Nr(e.canDeactivate);
}
function eE(e) {
  return e && Nr(e.canMatch);
}
function op(e) {
  return e instanceof dt || e?.name === "EmptyError";
}
var ai = Symbol("INITIAL_VALUE");
function vn() {
  return be((e) =>
    Wi(e.map((n) => n.pipe(He(1), Qi(ai)))).pipe(
      V((n) => {
        for (let t of n)
          if (t !== !0) {
            if (t === ai) return ai;
            if (t === !1 || tE(t)) return t;
          }
        return !0;
      }),
      je((n) => n !== ai),
      He(1),
    ),
  );
}
function tE(e) {
  return fn(e) || e instanceof Sr;
}
function ip(e) {
  return e.aborted
    ? _(void 0).pipe(He(1))
    : new x((n) => {
        let t = () => {
          (n.next(), n.complete());
        };
        return (
          e.addEventListener("abort", t),
          () => e.removeEventListener("abort", t)
        );
      });
}
function sp(e) {
  return _n(ip(e));
}
function nE(e) {
  return re((n) => {
    let {
      targetSnapshot: t,
      currentSnapshot: r,
      guards: { canActivateChecks: o, canDeactivateChecks: i },
    } = n;
    return i.length === 0 && o.length === 0
      ? _(F(g({}, n), { guardsResult: !0 }))
      : rE(i, t, r).pipe(
          re((s) => (s && Zy(s) ? oE(t, o, e) : _(s))),
          V((s) => F(g({}, n), { guardsResult: s })),
        );
  });
}
function rE(e, n, t) {
  return B(e).pipe(
    re((r) => lE(r.component, r.route, t, n)),
    Ue((r) => r !== !0, !0),
  );
}
function oE(e, n, t) {
  return B(n).pipe(
    to((r) =>
      zt(sE(r.route.parent, t), iE(r.route, t), cE(e, r.path), aE(e, r.route)),
    ),
    Ue((r) => r !== !0, !0),
  );
}
function iE(e, n) {
  return (e !== null && n && n(new hc(e)), _(!0));
}
function sE(e, n) {
  return (e !== null && n && n(new fc(e)), _(!0));
}
function aE(e, n) {
  let t = n.routeConfig ? n.routeConfig.canActivate : null;
  if (!t || t.length === 0) return _(!0);
  let r = t.map((o) =>
    Tn(() => {
      let i = n._environmentInjector,
        s = yn(o, i),
        a = Ky(s) ? s.canActivate(n, e) : ne(i, () => s(n, e));
      return Lt(a).pipe(Ue());
    }),
  );
  return _(r).pipe(vn());
}
function cE(e, n) {
  let t = n[n.length - 1],
    o = n
      .slice(0, n.length - 1)
      .reverse()
      .map((i) => Wy(i))
      .filter((i) => i !== null)
      .map((i) =>
        Tn(() => {
          let s = i.guards.map((a) => {
            let c = i.node._environmentInjector,
              l = yn(a, c),
              u = Jy(l) ? l.canActivateChild(t, e) : ne(c, () => l(t, e));
            return Lt(u).pipe(Ue());
          });
          return _(s).pipe(vn());
        }),
      );
  return _(o).pipe(vn());
}
function lE(e, n, t, r) {
  let o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return _(!0);
  let i = o.map((s) => {
    let a = n._environmentInjector,
      c = yn(s, a),
      l = Xy(c) ? c.canDeactivate(e, n, t, r) : ne(a, () => c(e, n, t, r));
    return Lt(l).pipe(Ue());
  });
  return _(i).pipe(vn());
}
function uE(e, n, t, r, o) {
  let i = n.canLoad;
  if (i === void 0 || i.length === 0) return _(!0);
  let s = i.map((a) => {
    let c = yn(a, e),
      l = Yy(c) ? c.canLoad(n, t) : ne(e, () => c(n, t)),
      u = Lt(l);
    return o ? u.pipe(sp(o)) : u;
  });
  return _(s).pipe(vn(), ap(r));
}
function ap(e) {
  return $i(
    me((n) => {
      if (typeof n != "boolean") throw Ei(e, n);
    }),
    V((n) => n === !0),
  );
}
function dE(e, n, t, r, o, i) {
  let s = n.canMatch;
  if (!s || s.length === 0) return _(!0);
  let a = s.map((c) => {
    let l = yn(c, e),
      u = eE(l) ? l.canMatch(n, t, o) : ne(e, () => l(n, t, o));
    return Lt(u).pipe(sp(i));
  });
  return _(a).pipe(vn(), ap(r));
}
var Qe = class e extends Error {
    segmentGroup;
    constructor(n) {
      (super(),
        (this.segmentGroup = n || null),
        Object.setPrototypeOf(this, e.prototype));
    }
  },
  Tr = class e extends Error {
    urlTree;
    constructor(n) {
      (super(), (this.urlTree = n), Object.setPrototypeOf(this, e.prototype));
    }
  };
function fE(e) {
  throw new v(4e3, !1);
}
function pE(e) {
  throw np(!1, ie.GuardRejected);
}
var Dc = class {
  urlSerializer;
  urlTree;
  constructor(n, t) {
    ((this.urlSerializer = n), (this.urlTree = t));
  }
  lineralizeSegments(n, t) {
    return U(this, null, function* () {
      let r = [],
        o = t.root;
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return r;
        if (o.numberOfChildren > 1 || !o.children[b])
          throw fE(`${n.redirectTo}`);
        o = o.children[b];
      }
    });
  }
  applyRedirectCommands(n, t, r, o, i) {
    return U(this, null, function* () {
      let s = yield hE(t, o, i);
      if (s instanceof Re) throw new Tr(s);
      let a = this.applyRedirectCreateUrlTree(
        s,
        this.urlSerializer.parse(s),
        n,
        r,
      );
      if (s[0] === "/") throw new Tr(a);
      return a;
    });
  }
  applyRedirectCreateUrlTree(n, t, r, o) {
    let i = this.createSegmentGroup(n, t.root, r, o);
    return new Re(
      i,
      this.createQueryParams(t.queryParams, this.urlTree.queryParams),
      t.fragment,
    );
  }
  createQueryParams(n, t) {
    let r = {};
    return (
      Object.entries(n).forEach(([o, i]) => {
        if (typeof i == "string" && i[0] === ":") {
          let a = i.substring(1);
          r[o] = t[a];
        } else r[o] = i;
      }),
      r
    );
  }
  createSegmentGroup(n, t, r, o) {
    let i = this.createSegments(n, t.segments, r, o),
      s = {};
    return (
      Object.entries(t.children).forEach(([a, c]) => {
        s[a] = this.createSegmentGroup(n, c, r, o);
      }),
      new O(i, s)
    );
  }
  createSegments(n, t, r, o) {
    return t.map((i) =>
      i.path[0] === ":" ? this.findPosParam(n, i, o) : this.findOrReturn(i, r),
    );
  }
  findPosParam(n, t, r) {
    let o = r[t.path.substring(1)];
    if (!o) throw new v(4001, !1);
    return o;
  }
  findOrReturn(n, t) {
    let r = 0;
    for (let o of t) {
      if (o.path === n.path) return (t.splice(r), o);
      r++;
    }
    return n;
  }
};
function hE(e, n, t) {
  if (typeof e == "string") return Promise.resolve(e);
  let r = e;
  return di(Lt(ne(t, () => r(n))));
}
function gE(e, n) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = ir(e.providers, n, `Route: ${e.path}`)),
    e._injector ?? n
  );
}
function xe(e) {
  return e.outlet || b;
}
function mE(e, n) {
  let t = e.filter((r) => xe(r) === n);
  return (t.push(...e.filter((r) => xe(r) !== n)), t);
}
var Cc = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function cp(e) {
  return {
    routeConfig: e.routeConfig,
    url: e.url,
    params: e.params,
    queryParams: e.queryParams,
    fragment: e.fragment,
    data: e.data,
    outlet: e.outlet,
    title: e.title,
    paramMap: e.paramMap,
    queryParamMap: e.queryParamMap,
  };
}
function vE(e, n, t, r, o, i, s) {
  let a = lp(e, n, t);
  if (!a.matched) return _(a);
  let c = cp(i(a));
  return (
    (r = gE(n, r)),
    dE(r, n, t, o, c, s).pipe(V((l) => (l === !0 ? a : g({}, Cc))))
  );
}
function lp(e, n, t) {
  if (n.path === "")
    return n.pathMatch === "full" && (e.hasChildren() || t.length > 0)
      ? g({}, Cc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: t,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (n.matcher || dy)(t, e, n);
  if (!o) return g({}, Cc);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s =
    o.consumed.length > 0
      ? g(g({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: t.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function Af(e, n, t, r, o) {
  return t.length > 0 && IE(e, t, r, o)
    ? {
        segmentGroup: new O(n, EE(r, new O(t, e.children))),
        slicedSegments: [],
      }
    : t.length === 0 && wE(e, t, r)
      ? {
          segmentGroup: new O(e.segments, yE(e, t, r, e.children)),
          slicedSegments: t,
        }
      : { segmentGroup: new O(e.segments, e.children), slicedSegments: t };
}
function yE(e, n, t, r) {
  let o = {};
  for (let i of t)
    if (Ci(e, n, i) && !r[xe(i)]) {
      let s = new O([], {});
      o[xe(i)] = s;
    }
  return g(g({}, r), o);
}
function EE(e, n) {
  let t = {};
  t[b] = n;
  for (let r of e)
    if (r.path === "" && xe(r) !== b) {
      let o = new O([], {});
      t[xe(r)] = o;
    }
  return t;
}
function IE(e, n, t, r) {
  return t.some((o) =>
    !Ci(e, n, o) || !(xe(o) !== b) ? !1 : !(r !== void 0 && xe(o) === r),
  );
}
function wE(e, n, t) {
  return t.some((r) => Ci(e, n, r));
}
function Ci(e, n, t) {
  return (e.hasChildren() || n.length > 0) && t.pathMatch === "full"
    ? !1
    : t.path === "";
}
function DE(e, n, t) {
  return n.length === 0 && !e.children[t];
}
var bc = class {};
function CE(e, n, t, r, o, i, s = "emptyOnly", a) {
  return U(this, null, function* () {
    return new Sc(e, n, t, r, o, s, i, a).recognize();
  });
}
var bE = 31,
  Sc = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    abortSignal;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(n, t, r, o, i, s, a, c) {
      ((this.injector = n),
        (this.configLoader = t),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.abortSignal = c),
        (this.applyRedirects = new Dc(this.urlSerializer, this.urlTree)));
    }
    noMatchError(n) {
      return new v(4002, `'${n.segmentGroup}'`);
    }
    recognize() {
      return U(this, null, function* () {
        let n = Af(this.urlTree.root, [], [], this.config).segmentGroup,
          { children: t, rootSnapshot: r } = yield this.match(n),
          o = new ge(r, t),
          i = new yi("", o),
          s = Ry(r, [], this.urlTree.queryParams, this.urlTree.fragment);
        return (
          (s.queryParams = this.urlTree.queryParams),
          (i.url = this.urlSerializer.serialize(s)),
          { state: i, tree: s }
        );
      });
    }
    match(n) {
      return U(this, null, function* () {
        let t = new Cr(
          [],
          Object.freeze({}),
          Object.freeze(g({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Object.freeze({}),
          b,
          this.rootComponentType,
          null,
          {},
          this.injector,
        );
        try {
          return {
            children: yield this.processSegmentGroup(
              this.injector,
              this.config,
              n,
              b,
              t,
            ),
            rootSnapshot: t,
          };
        } catch (r) {
          if (r instanceof Tr)
            return ((this.urlTree = r.urlTree), this.match(r.urlTree.root));
          throw r instanceof Qe ? this.noMatchError(r) : r;
        }
      });
    }
    processSegmentGroup(n, t, r, o, i) {
      return U(this, null, function* () {
        if (r.segments.length === 0 && r.hasChildren())
          return this.processChildren(n, t, r, i);
        let s = yield this.processSegment(n, t, r, r.segments, o, !0, i);
        return s instanceof ge ? [s] : [];
      });
    }
    processChildren(n, t, r, o) {
      return U(this, null, function* () {
        let i = [];
        for (let c of Object.keys(r.children))
          c === "primary" ? i.unshift(c) : i.push(c);
        let s = [];
        for (let c of i) {
          let l = r.children[c],
            u = mE(t, c),
            d = yield this.processSegmentGroup(n, u, l, c, o);
          s.push(...d);
        }
        let a = up(s);
        return (SE(a), a);
      });
    }
    processSegment(n, t, r, o, i, s, a) {
      return U(this, null, function* () {
        for (let c of t)
          try {
            return yield this.processSegmentAgainstRoute(
              c._injector ?? n,
              t,
              c,
              r,
              o,
              i,
              s,
              a,
            );
          } catch (l) {
            if (l instanceof Qe || op(l)) continue;
            throw l;
          }
        if (DE(r, o, i)) return new bc();
        throw new Qe(r);
      });
    }
    processSegmentAgainstRoute(n, t, r, o, i, s, a, c) {
      return U(this, null, function* () {
        if (xe(r) !== s && (s === b || !Ci(o, i, r))) throw new Qe(o);
        if (r.redirectTo === void 0)
          return this.matchSegmentAgainstRoute(n, o, r, i, s, c);
        if (this.allowRedirects && a)
          return this.expandSegmentAgainstRouteUsingRedirect(
            n,
            o,
            t,
            r,
            i,
            s,
            c,
          );
        throw new Qe(o);
      });
    }
    expandSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s, a) {
      return U(this, null, function* () {
        let {
          matched: c,
          parameters: l,
          consumedSegments: u,
          positionalParamSegments: d,
          remainingSegments: h,
        } = lp(t, o, i);
        if (!c) throw new Qe(t);
        typeof o.redirectTo == "string" &&
          o.redirectTo[0] === "/" &&
          (this.absoluteRedirectCount++,
          this.absoluteRedirectCount > bE && (this.allowRedirects = !1));
        let f = this.createSnapshot(n, o, i, l, a);
        if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
        let m = yield this.applyRedirects.applyRedirectCommands(
            u,
            o.redirectTo,
            d,
            cp(f),
            n,
          ),
          H = yield this.applyRedirects.lineralizeSegments(o, m);
        return this.processSegment(n, r, t, H.concat(h), s, !1, a);
      });
    }
    createSnapshot(n, t, r, o, i) {
      let s = new Cr(
          r,
          o,
          Object.freeze(g({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          ME(t),
          xe(t),
          t.component ?? t._loadedComponent ?? null,
          t,
          _E(t),
          n,
        ),
        a = Mc(s, i, this.paramsInheritanceStrategy);
      return (
        (s.params = Object.freeze(a.params)),
        (s.data = Object.freeze(a.data)),
        s
      );
    }
    matchSegmentAgainstRoute(n, t, r, o, i, s) {
      return U(this, null, function* () {
        if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
        let a = (xr) =>
            this.createSnapshot(n, r, xr.consumedSegments, xr.parameters, s),
          c = yield di(vE(t, r, o, n, this.urlSerializer, a, this.abortSignal));
        if ((r.path === "**" && (t.children = {}), !c?.matched))
          throw new Qe(t);
        n = r._injector ?? n;
        let { routes: l } = yield this.getChildConfig(n, r, o),
          u = r._loadedInjector ?? n,
          { parameters: d, consumedSegments: h, remainingSegments: f } = c,
          m = this.createSnapshot(n, r, h, d, s),
          { segmentGroup: H, slicedSegments: $ } = Af(t, h, f, l, i);
        if ($.length === 0 && H.hasChildren()) {
          let xr = yield this.processChildren(u, l, H, m);
          return new ge(m, xr);
        }
        if (l.length === 0 && $.length === 0) return new ge(m, []);
        let Z = xe(r) === i,
          En = yield this.processSegment(u, l, H, $, Z ? b : i, !0, m);
        return new ge(m, En instanceof ge ? [En] : []);
      });
    }
    getChildConfig(n, t, r) {
      return U(this, null, function* () {
        if (t.children) return { routes: t.children, injector: n };
        if (t.loadChildren) {
          if (t._loadedRoutes !== void 0) {
            let i = t._loadedNgModuleFactory;
            return (
              i &&
                !t._loadedInjector &&
                (t._loadedInjector = i.create(n).injector),
              { routes: t._loadedRoutes, injector: t._loadedInjector }
            );
          }
          if (this.abortSignal.aborted)
            throw new Error(this.abortSignal.reason);
          if (yield di(uE(n, t, r, this.urlSerializer, this.abortSignal))) {
            let i = yield this.configLoader.loadChildren(n, t);
            return (
              (t._loadedRoutes = i.routes),
              (t._loadedInjector = i.injector),
              (t._loadedNgModuleFactory = i.factory),
              i
            );
          }
          throw pE(t);
        }
        return { routes: [], injector: n };
      });
    }
  };
function SE(e) {
  e.sort((n, t) =>
    n.value.outlet === b
      ? -1
      : t.value.outlet === b
        ? 1
        : n.value.outlet.localeCompare(t.value.outlet),
  );
}
function TE(e) {
  let n = e.value.routeConfig;
  return n && n.path === "";
}
function up(e) {
  let n = [],
    t = new Set();
  for (let r of e) {
    if (!TE(r)) {
      n.push(r);
      continue;
    }
    let o = n.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), t.add(o)) : n.push(r);
  }
  for (let r of t) {
    let o = up(r.children);
    n.push(new ge(r.value, o));
  }
  return n.filter((r) => !t.has(r));
}
function ME(e) {
  return e.data || {};
}
function _E(e) {
  return e.resolve || {};
}
function NE(e, n, t, r, o, i, s) {
  return re((a) =>
    U(null, null, function* () {
      let { state: c, tree: l } = yield CE(e, n, t, r, a.extractedUrl, o, i, s);
      return F(g({}, a), { targetSnapshot: c, urlAfterRedirects: l });
    }),
  );
}
function xE(e) {
  return re((n) => {
    let {
      targetSnapshot: t,
      guards: { canActivateChecks: r },
    } = n;
    if (!r.length) return _(n);
    let o = new Set(r.map((a) => a.route)),
      i = new Set();
    for (let a of o) if (!i.has(a)) for (let c of dp(a)) i.add(c);
    let s = 0;
    return B(i).pipe(
      to((a) =>
        o.has(a)
          ? RE(a, t, e)
          : ((a.data = Mc(a, a.parent, e).resolve), _(void 0)),
      ),
      me(() => s++),
      no(1),
      re((a) => (s === i.size ? _(n) : K)),
    );
  });
}
function dp(e) {
  let n = e.children.map((t) => dp(t)).flat();
  return [e, ...n];
}
function RE(e, n, t) {
  let r = e.routeConfig,
    o = e._resolve;
  return (
    r?.title !== void 0 && !Jf(r) && (o[Mr] = r.title),
    Tn(
      () => (
        (e.data = Mc(e, e.parent, t).resolve),
        AE(o, e, n).pipe(
          V(
            (i) => (
              (e._resolvedData = i),
              (e.data = g(g({}, e.data), i)),
              null
            ),
          ),
        )
      ),
    )
  );
}
function AE(e, n, t) {
  let r = tc(e);
  if (r.length === 0) return _({});
  let o = {};
  return B(r).pipe(
    re((i) =>
      OE(e[i], n, t).pipe(
        Ue(),
        me((s) => {
          if (s instanceof Sr) throw Ei(new kt(), s);
          o[i] = s;
        }),
      ),
    ),
    no(1),
    V(() => o),
    Mn((i) => (op(i) ? K : qi(i))),
  );
}
function OE(e, n, t) {
  let r = n._environmentInjector,
    o = yn(e, r),
    i = o.resolve ? o.resolve(n, t) : ne(r, () => o(n, t));
  return Lt(i);
}
function Of(e) {
  return be((n) => {
    let t = e(n);
    return t ? B(t).pipe(V(() => n)) : _(n);
  });
}
var fp = (() => {
    class e {
      buildTitle(t) {
        let r,
          o = t.root;
        for (; o !== void 0; )
          ((r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === b)));
        return r;
      }
      getResolvedTitleForRoute(t) {
        return t.data[Mr];
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: () => p(kE), providedIn: "root" });
    }
    return e;
  })(),
  kE = (() => {
    class e extends fp {
      title;
      constructor(t) {
        (super(), (this.title = t));
      }
      updateTitle(t) {
        let r = this.buildTitle(t);
        r !== void 0 && this.title.setTitle(r);
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Tf));
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  bi = new y("", { factory: () => ({}) }),
  Si = new y(""),
  pp = (() => {
    class e {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = p(Fa);
      loadComponent(t, r) {
        return U(this, null, function* () {
          if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
          if (r._loadedComponent) return Promise.resolve(r._loadedComponent);
          this.onLoadStartListener && this.onLoadStartListener(r);
          let o = U(this, null, function* () {
            try {
              let i = yield Pf(ne(t, () => r.loadComponent())),
                s = yield gp(hp(i));
              return (
                this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s),
                s
              );
            } finally {
              this.componentLoaders.delete(r);
            }
          });
          return (this.componentLoaders.set(r, o), o);
        });
      }
      loadChildren(t, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return Promise.resolve({
            routes: r._loadedRoutes,
            injector: r._loadedInjector,
          });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let o = U(this, null, function* () {
          try {
            let i = yield PE(r, this.compiler, t, this.onLoadEndListener);
            return (
              (r._loadedRoutes = i.routes),
              (r._loadedInjector = i.injector),
              (r._loadedNgModuleFactory = i.factory),
              i
            );
          } finally {
            this.childrenLoaders.delete(r);
          }
        });
        return (this.childrenLoaders.set(r, o), o);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function PE(e, n, t, r) {
  return U(this, null, function* () {
    let o = yield Pf(ne(t, () => e.loadChildren())),
      i = yield gp(hp(o)),
      s;
    (i instanceof Qo || Array.isArray(i)
      ? (s = i)
      : (s = yield n.compileModuleAsync(i)),
      r && r(e));
    let a,
      c,
      l = !1,
      u;
    return (
      Array.isArray(s)
        ? ((c = s), (l = !0))
        : ((a = s.create(t).injector),
          (u = s),
          (c = a.get(Si, [], { optional: !0, self: !0 }).flat())),
      { routes: c.map(Nc), injector: a, factory: u }
    );
  });
}
function LE(e) {
  return e && typeof e == "object" && "default" in e;
}
function hp(e) {
  return LE(e) ? e.default : e;
}
function gp(e) {
  return U(this, null, function* () {
    return e;
  });
}
var xc = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: () => p(FE), providedIn: "root" });
    }
    return e;
  })(),
  FE = (() => {
    class e {
      shouldProcessUrl(t) {
        return !0;
      }
      extract(t) {
        return t;
      }
      merge(t, r) {
        return t;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  mp = new y("");
var jE = () => {},
  vp = new y(""),
  yp = (() => {
    class e {
      currentNavigation = Jt(null, { equal: () => !1 });
      currentTransition = null;
      lastSuccessfulNavigation = Jt(null);
      events = new te();
      transitionAbortWithErrorSubject = new te();
      configLoader = p(pp);
      environmentInjector = p(W);
      destroyRef = p(St);
      urlSerializer = p(wi);
      rootContexts = p(_r);
      location = p(an);
      inputBindingEnabled = p(Di, { optional: !0 }) !== null;
      titleStrategy = p(fp);
      options = p(bi, { optional: !0 }) || {};
      paramsInheritanceStrategy =
        this.options.paramsInheritanceStrategy || "emptyOnly";
      urlHandlingStrategy = p(xc);
      createViewTransition = p(mp, { optional: !0 });
      navigationErrorHandler = p(vp, { optional: !0 });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => _(void 0);
      rootComponentType = null;
      destroyed = !1;
      constructor() {
        let t = (o) => this.events.next(new uc(o)),
          r = (o) => this.events.next(new dc(o));
        ((this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = t),
          this.destroyRef.onDestroy(() => {
            this.destroyed = !0;
          }));
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(t) {
        let r = ++this.navigationId;
        ot(() => {
          this.transitions?.next(
            F(g({}, t), {
              extractedUrl: this.urlHandlingStrategy.extract(t.rawUrl),
              targetSnapshot: null,
              targetRouterState: null,
              guards: { canActivateChecks: [], canDeactivateChecks: [] },
              guardsResult: null,
              id: r,
              routesRecognizeHandler: {},
              beforeActivateHandler: {},
            }),
          );
        });
      }
      setupNavigations(t) {
        return (
          (this.transitions = new Y(null)),
          this.transitions.pipe(
            je((r) => r !== null),
            be((r) => {
              let o = !1,
                i = new AbortController(),
                s = () => !o && this.currentTransition?.id === r.id;
              return _(r).pipe(
                be((a) => {
                  if (this.navigationId > r.id)
                    return (
                      this.cancelNavigationTransition(
                        r,
                        "",
                        ie.SupersededByNewNavigation,
                      ),
                      K
                    );
                  this.currentTransition = r;
                  let c = this.lastSuccessfulNavigation();
                  this.currentNavigation.set({
                    id: a.id,
                    initialUrl: a.rawUrl,
                    extractedUrl: a.extractedUrl,
                    targetBrowserUrl:
                      typeof a.extras.browserUrl == "string"
                        ? this.urlSerializer.parse(a.extras.browserUrl)
                        : a.extras.browserUrl,
                    trigger: a.source,
                    extras: a.extras,
                    previousNavigation: c
                      ? F(g({}, c), { previousNavigation: null })
                      : null,
                    abort: () => i.abort(),
                    routesRecognizeHandler: a.routesRecognizeHandler,
                    beforeActivateHandler: a.beforeActivateHandler,
                  });
                  let l =
                      !t.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    u = a.extras.onSameUrlNavigation ?? t.onSameUrlNavigation;
                  if (!l && u !== "reload")
                    return (
                      this.events.next(
                        new at(
                          a.id,
                          this.urlSerializer.serialize(a.rawUrl),
                          "",
                          hi.IgnoredSameUrlNavigation,
                        ),
                      ),
                      a.resolve(!1),
                      K
                    );
                  if (this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl))
                    return _(a).pipe(
                      be(
                        (d) => (
                          this.events.next(
                            new pn(
                              d.id,
                              this.urlSerializer.serialize(d.extractedUrl),
                              d.source,
                              d.restoredState,
                            ),
                          ),
                          d.id !== this.navigationId ? K : Promise.resolve(d)
                        ),
                      ),
                      NE(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        t.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                        i.signal,
                      ),
                      me((d) => {
                        ((r.targetSnapshot = d.targetSnapshot),
                          (r.urlAfterRedirects = d.urlAfterRedirects),
                          this.currentNavigation.update(
                            (h) => ((h.finalUrl = d.urlAfterRedirects), h),
                          ),
                          this.events.next(new Dr()));
                      }),
                      be((d) =>
                        B(
                          r.routesRecognizeHandler.deferredHandle ?? _(void 0),
                        ).pipe(V(() => d)),
                      ),
                      me(() => {
                        let d = new gi(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          this.urlSerializer.serialize(a.urlAfterRedirects),
                          a.targetSnapshot,
                        );
                        this.events.next(d);
                      }),
                    );
                  if (
                    l &&
                    this.urlHandlingStrategy.shouldProcessUrl(a.currentRawUrl)
                  ) {
                    let {
                        id: d,
                        extractedUrl: h,
                        source: f,
                        restoredState: m,
                        extras: H,
                      } = a,
                      $ = new pn(d, this.urlSerializer.serialize(h), f, m);
                    this.events.next($);
                    let Z = Yf(
                      this.rootComponentType,
                      this.environmentInjector,
                    ).snapshot;
                    return (
                      (this.currentTransition = r =
                        F(g({}, a), {
                          targetSnapshot: Z,
                          urlAfterRedirects: h,
                          extras: F(g({}, H), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      this.currentNavigation.update(
                        (En) => ((En.finalUrl = h), En),
                      ),
                      _(r)
                    );
                  } else
                    return (
                      this.events.next(
                        new at(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          "",
                          hi.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      a.resolve(!1),
                      K
                    );
                }),
                V((a) => {
                  let c = new sc(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                  );
                  return (
                    this.events.next(c),
                    (this.currentTransition = r =
                      F(g({}, a), {
                        guards: qy(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    r
                  );
                }),
                nE((a) => this.events.next(a)),
                be((a) => {
                  if (
                    ((r.guardsResult = a.guardsResult),
                    a.guardsResult && typeof a.guardsResult != "boolean")
                  )
                    throw Ei(this.urlSerializer, a.guardsResult);
                  let c = new ac(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                    !!a.guardsResult,
                  );
                  if ((this.events.next(c), !s())) return K;
                  if (!a.guardsResult)
                    return (
                      this.cancelNavigationTransition(a, "", ie.GuardRejected),
                      K
                    );
                  if (a.guards.canActivateChecks.length === 0) return _(a);
                  let l = new cc(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                  );
                  if ((this.events.next(l), !s())) return K;
                  let u = !1;
                  return _(a).pipe(
                    xE(this.paramsInheritanceStrategy),
                    me({
                      next: () => {
                        u = !0;
                        let d = new lc(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          this.urlSerializer.serialize(a.urlAfterRedirects),
                          a.targetSnapshot,
                        );
                        this.events.next(d);
                      },
                      complete: () => {
                        u ||
                          this.cancelNavigationTransition(
                            a,
                            "",
                            ie.NoDataFromResolver,
                          );
                      },
                    }),
                  );
                }),
                Of((a) => {
                  let c = (u) => {
                      let d = [];
                      if (u.routeConfig?._loadedComponent)
                        u.component = u.routeConfig?._loadedComponent;
                      else if (u.routeConfig?.loadComponent) {
                        let h = u._environmentInjector;
                        d.push(
                          this.configLoader
                            .loadComponent(h, u.routeConfig)
                            .then((f) => {
                              u.component = f;
                            }),
                        );
                      }
                      for (let h of u.children) d.push(...c(h));
                      return d;
                    },
                    l = c(a.targetSnapshot.root);
                  return l.length === 0
                    ? _(a)
                    : B(Promise.all(l).then(() => a));
                }),
                Of(() => this.afterPreactivation()),
                be(() => {
                  let { currentSnapshot: a, targetSnapshot: c } = r,
                    l = this.createViewTransition?.(
                      this.environmentInjector,
                      a.root,
                      c.root,
                    );
                  return l ? B(l).pipe(V(() => r)) : _(r);
                }),
                He(1),
                be((a) => {
                  let c = Vy(
                    t.routeReuseStrategy,
                    a.targetSnapshot,
                    a.currentRouterState,
                  );
                  ((this.currentTransition =
                    r =
                    a =
                      F(g({}, a), { targetRouterState: c })),
                    this.currentNavigation.update(
                      (u) => ((u.targetRouterState = c), u),
                    ),
                    this.events.next(new gn()));
                  let l = r.beforeActivateHandler.deferredHandle;
                  return l ? B(l.then(() => a)) : _(a);
                }),
                me((a) => {
                  (new wc(
                    t.routeReuseStrategy,
                    r.targetRouterState,
                    r.currentRouterState,
                    (c) => this.events.next(c),
                    this.inputBindingEnabled,
                  ).activate(this.rootContexts),
                    s() &&
                      ((o = !0),
                      this.currentNavigation.update((c) => ((c.abort = jE), c)),
                      this.lastSuccessfulNavigation.set(
                        ot(this.currentNavigation),
                      ),
                      this.events.next(
                        new st(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          this.urlSerializer.serialize(a.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        a.targetRouterState.snapshot,
                      ),
                      a.resolve(!0)));
                }),
                _n(
                  ip(i.signal).pipe(
                    je(() => !o && !r.targetRouterState),
                    me(() => {
                      this.cancelNavigationTransition(
                        r,
                        i.signal.reason + "",
                        ie.Aborted,
                      );
                    }),
                  ),
                ),
                me({
                  complete: () => {
                    o = !0;
                  },
                }),
                _n(
                  this.transitionAbortWithErrorSubject.pipe(
                    me((a) => {
                      throw a;
                    }),
                  ),
                ),
                Gi(() => {
                  (i.abort(),
                    o ||
                      this.cancelNavigationTransition(
                        r,
                        "",
                        ie.SupersededByNewNavigation,
                      ),
                    this.currentTransition?.id === r.id &&
                      (this.currentNavigation.set(null),
                      (this.currentTransition = null)));
                }),
                Mn((a) => {
                  if (((o = !0), this.destroyed)) return (r.resolve(!1), K);
                  if (rp(a))
                    (this.events.next(
                      new Ne(
                        r.id,
                        this.urlSerializer.serialize(r.extractedUrl),
                        a.message,
                        a.cancellationCode,
                      ),
                    ),
                      zy(a)
                        ? this.events.next(
                            new mn(a.url, a.navigationBehaviorOptions),
                          )
                        : r.resolve(!1));
                  else {
                    let c = new hn(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      a,
                      r.targetSnapshot ?? void 0,
                    );
                    try {
                      let l = ne(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(c),
                      );
                      if (l instanceof Sr) {
                        let { message: u, cancellationCode: d } = Ei(
                          this.urlSerializer,
                          l,
                        );
                        (this.events.next(
                          new Ne(
                            r.id,
                            this.urlSerializer.serialize(r.extractedUrl),
                            u,
                            d,
                          ),
                        ),
                          this.events.next(
                            new mn(l.redirectTo, l.navigationBehaviorOptions),
                          ));
                      } else throw (this.events.next(c), a);
                    } catch (l) {
                      this.options.resolveNavigationPromiseOnError
                        ? r.resolve(!1)
                        : r.reject(l);
                    }
                  }
                  return K;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(t, r, o) {
        let i = new Ne(
          t.id,
          this.urlSerializer.serialize(t.extractedUrl),
          r,
          o,
        );
        (this.events.next(i), t.resolve(!1));
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let t = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0)),
          ),
          r = ot(this.currentNavigation),
          o = r?.targetBrowserUrl ?? r?.extractedUrl;
        return t.toString() !== o?.toString() && !r?.extras.skipLocationChange;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function HE(e) {
  return e !== Er;
}
var Ep = new y("");
var UE = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: () => p(VE), providedIn: "root" });
    }
    return e;
  })(),
  Tc = class {
    shouldDetach(n) {
      return !1;
    }
    store(n, t) {}
    shouldAttach(n) {
      return !1;
    }
    retrieve(n) {
      return null;
    }
    shouldReuseRoute(n, t) {
      return n.routeConfig === t.routeConfig;
    }
    shouldDestroyInjector(n) {
      return !0;
    }
  },
  VE = (() => {
    class e extends Tc {
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = nr(e)))(o || e);
        };
      })();
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Rc = (() => {
    class e {
      urlSerializer = p(wi);
      options = p(bi, { optional: !0 }) || {};
      canceledNavigationResolution =
        this.options.canceledNavigationResolution || "replace";
      location = p(an);
      urlHandlingStrategy = p(xc);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      currentUrlTree = new Re();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: t, initialUrl: r, targetBrowserUrl: o }) {
        let i = t !== void 0 ? this.urlHandlingStrategy.merge(t, r) : r,
          s = o ?? i;
        return s instanceof Re ? this.urlSerializer.serialize(s) : s;
      }
      routerUrlState(t) {
        return t?.targetBrowserUrl === void 0 || t?.finalUrl === void 0
          ? {}
          : { ɵrouterUrl: this.urlSerializer.serialize(t.finalUrl) };
      }
      commitTransition({ targetRouterState: t, finalUrl: r, initialUrl: o }) {
        r && t
          ? ((this.currentUrlTree = r),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(r, o)),
            (this.routerState = t))
          : (this.rawUrlTree = o);
      }
      routerState = Yf(null, p(W));
      getRouterState() {
        return this.routerState;
      }
      _stateMemento = this.createStateMemento();
      get stateMemento() {
        return this._stateMemento;
      }
      updateStateMemento() {
        this._stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      restoredState() {
        return this.location.getState();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = E({ token: e, factory: () => p($E), providedIn: "root" });
    }
    return e;
  })(),
  $E = (() => {
    class e extends Rc {
      currentPageId = 0;
      lastSuccessfulId = -1;
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      registerNonRouterCurrentEntryChangeListener(t) {
        return this.location.subscribe((r) => {
          r.type === "popstate" &&
            setTimeout(() => {
              t(r.url, r.state, "popstate", { replaceUrl: !0 });
            });
        });
      }
      handleRouterEvent(t, r) {
        t instanceof pn
          ? this.updateStateMemento()
          : t instanceof at
            ? this.commitTransition(r)
            : t instanceof gi
              ? this.urlUpdateStrategy === "eager" &&
                (r.extras.skipLocationChange ||
                  this.setBrowserUrl(this.createBrowserPath(r), r))
              : t instanceof gn
                ? (this.commitTransition(r),
                  this.urlUpdateStrategy === "deferred" &&
                    !r.extras.skipLocationChange &&
                    this.setBrowserUrl(this.createBrowserPath(r), r))
                : t instanceof Ne && !Zf(t)
                  ? this.restoreHistory(r)
                  : t instanceof hn
                    ? this.restoreHistory(r, !0)
                    : t instanceof st &&
                      ((this.lastSuccessfulId = t.id),
                      (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(t, r) {
        let { extras: o, id: i } = r,
          { replaceUrl: s, state: a } = o;
        if (this.location.isCurrentPathEqualTo(t) || s) {
          let c = this.browserPageId,
            l = g(g({}, a), this.generateNgRouterState(i, c, r));
          this.location.replaceState(t, "", l);
        } else {
          let c = g(
            g({}, a),
            this.generateNgRouterState(i, this.browserPageId + 1, r),
          );
          this.location.go(t, "", c);
        }
      }
      restoreHistory(t, r = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.getCurrentUrlTree() === t.finalUrl &&
              i === 0 &&
              (this.resetInternalState(t), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (r && this.resetInternalState(t), this.resetUrlToCurrentUrlTree());
      }
      resetInternalState({ finalUrl: t }) {
        ((this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            t ?? this.rawUrlTree,
          )));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(t, r, o) {
        return this.canceledNavigationResolution === "computed"
          ? g({ navigationId: t, ɵrouterPageId: r }, this.routerUrlState(o))
          : g({ navigationId: t }, this.routerUrlState(o));
      }
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = nr(e)))(o || e);
        };
      })();
      static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function Ip(e, n) {
  e.events
    .pipe(
      je(
        (t) =>
          t instanceof st ||
          t instanceof Ne ||
          t instanceof hn ||
          t instanceof at,
      ),
      V((t) =>
        t instanceof st || t instanceof at
          ? 0
          : (
                t instanceof Ne
                  ? t.code === ie.Redirect ||
                    t.code === ie.SupersededByNewNavigation
                  : !1
              )
            ? 2
            : 1,
      ),
      je((t) => t !== 2),
      He(1),
    )
    .subscribe(() => {
      n();
    });
}
var Ac = (() => {
  class e {
    get currentUrlTree() {
      return this.stateManager.getCurrentUrlTree();
    }
    get rawUrlTree() {
      return this.stateManager.getRawUrlTree();
    }
    disposed = !1;
    nonRouterCurrentEntryChangeSubscription;
    console = p(Oa);
    stateManager = p(Rc);
    options = p(bi, { optional: !0 }) || {};
    pendingTasks = p(qe);
    urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
    navigationTransitions = p(yp);
    urlSerializer = p(wi);
    location = p(an);
    urlHandlingStrategy = p(xc);
    injector = p(W);
    _events = new te();
    get events() {
      return this._events;
    }
    get routerState() {
      return this.stateManager.getRouterState();
    }
    navigated = !1;
    routeReuseStrategy = p(UE);
    injectorCleanup = p(Ep, { optional: !0 });
    onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
    config = p(Si, { optional: !0 })?.flat() ?? [];
    componentInputBindingEnabled = !!p(Di, { optional: !0 });
    currentNavigation =
      this.navigationTransitions.currentNavigation.asReadonly();
    constructor() {
      (this.resetConfig(this.config),
        this.navigationTransitions
          .setupNavigations(this)
          .subscribe({ error: (t) => {} }),
        this.subscribeToNavigationEvents());
    }
    eventsSubscription = new q();
    subscribeToNavigationEvents() {
      let t = this.navigationTransitions.events.subscribe((r) => {
        try {
          let o = this.navigationTransitions.currentTransition,
            i = ot(this.navigationTransitions.currentNavigation);
          if (o !== null && i !== null) {
            if (
              (this.stateManager.handleRouterEvent(r, i),
              r instanceof Ne &&
                r.code !== ie.Redirect &&
                r.code !== ie.SupersededByNewNavigation)
            )
              this.navigated = !0;
            else if (r instanceof st)
              ((this.navigated = !0),
                this.injectorCleanup?.(
                  this.routeReuseStrategy,
                  this.routerState,
                  this.config,
                ));
            else if (r instanceof mn) {
              let s = r.navigationBehaviorOptions,
                a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                c = g(
                  {
                    scroll: o.extras.scroll,
                    browserUrl: o.extras.browserUrl,
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      o.extras.replaceUrl ||
                      this.urlUpdateStrategy === "eager" ||
                      HE(o.source),
                  },
                  s,
                );
              this.scheduleNavigation(a, Er, null, c, {
                resolve: o.resolve,
                reject: o.reject,
                promise: o.promise,
              });
            }
          }
          jy(r) && this._events.next(r);
        } catch (o) {
          this.navigationTransitions.transitionAbortWithErrorSubject.next(o);
        }
      });
      this.eventsSubscription.add(t);
    }
    resetRootComponentType(t) {
      ((this.routerState.root.component = t),
        (this.navigationTransitions.rootComponentType = t));
    }
    initialNavigation() {
      (this.setUpLocationChangeListener(),
        this.navigationTransitions.hasRequestedNavigation ||
          this.navigateToSyncWithBrowser(
            this.location.path(!0),
            Er,
            this.stateManager.restoredState(),
            { replaceUrl: !0 },
          ));
    }
    setUpLocationChangeListener() {
      this.nonRouterCurrentEntryChangeSubscription ??=
        this.stateManager.registerNonRouterCurrentEntryChangeListener(
          (t, r, o, i) => {
            this.navigateToSyncWithBrowser(t, o, r, i);
          },
        );
    }
    navigateToSyncWithBrowser(t, r, o, i) {
      let s = o?.navigationId ? o : null,
        a = o?.ɵrouterUrl ?? t;
      if ((o?.ɵrouterUrl && (i = F(g({}, i), { browserUrl: t })), o)) {
        let l = g({}, o);
        (delete l.navigationId,
          delete l.ɵrouterPageId,
          delete l.ɵrouterUrl,
          Object.keys(l).length !== 0 && (i.state = l));
      }
      let c = this.parseUrl(a);
      this.scheduleNavigation(c, r, s, i).catch((l) => {
        this.disposed || this.injector.get(We)(l);
      });
    }
    get url() {
      return this.serializeUrl(this.currentUrlTree);
    }
    getCurrentNavigation() {
      return ot(this.navigationTransitions.currentNavigation);
    }
    get lastSuccessfulNavigation() {
      return this.navigationTransitions.lastSuccessfulNavigation;
    }
    resetConfig(t) {
      ((this.config = t.map(Nc)), (this.navigated = !1));
    }
    ngOnDestroy() {
      this.dispose();
    }
    dispose() {
      (this._events.unsubscribe(),
        this.navigationTransitions.complete(),
        this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),
        (this.nonRouterCurrentEntryChangeSubscription = void 0),
        (this.disposed = !0),
        this.eventsSubscription.unsubscribe());
    }
    createUrlTree(t, r = {}) {
      let {
          relativeTo: o,
          queryParams: i,
          fragment: s,
          queryParamsHandling: a,
          preserveFragment: c,
        } = r,
        l = c ? this.currentUrlTree.fragment : s,
        u = null;
      switch (a ?? this.options.defaultQueryParamsHandling) {
        case "merge":
          u = g(g({}, this.currentUrlTree.queryParams), i);
          break;
        case "preserve":
          u = this.currentUrlTree.queryParams;
          break;
        default:
          u = i || null;
      }
      u !== null && (u = this.removeEmptyProps(u));
      let d;
      try {
        let h = o ? o.snapshot : this.routerState.snapshot.root;
        d = qf(h);
      } catch (h) {
        ((typeof t[0] != "string" || t[0][0] !== "/") && (t = []),
          (d = this.currentUrlTree.root));
      }
      return Wf(d, t, u, l ?? null, this.urlSerializer);
    }
    navigateByUrl(t, r = { skipLocationChange: !1 }) {
      let o = fn(t) ? t : this.parseUrl(t),
        i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
      return this.scheduleNavigation(i, Er, null, r);
    }
    navigate(t, r = { skipLocationChange: !1 }) {
      return (BE(t), this.navigateByUrl(this.createUrlTree(t, r), r));
    }
    serializeUrl(t) {
      return this.urlSerializer.serialize(t);
    }
    parseUrl(t) {
      try {
        return this.urlSerializer.parse(t);
      } catch (r) {
        return (this.console.warn(kn(4018, !1)), this.urlSerializer.parse("/"));
      }
    }
    isActive(t, r) {
      let o;
      if (
        (r === !0
          ? (o = g({}, Ff))
          : r === !1
            ? (o = g({}, nc))
            : (o = g(g({}, nc), r)),
        fn(t))
      )
        return Mf(this.currentUrlTree, t, o);
      let i = this.parseUrl(t);
      return Mf(this.currentUrlTree, i, o);
    }
    removeEmptyProps(t) {
      return Object.entries(t).reduce(
        (r, [o, i]) => (i != null && (r[o] = i), r),
        {},
      );
    }
    scheduleNavigation(t, r, o, i, s) {
      if (this.disposed) return Promise.resolve(!1);
      let a, c, l;
      s
        ? ((a = s.resolve), (c = s.reject), (l = s.promise))
        : (l = new Promise((d, h) => {
            ((a = d), (c = h));
          }));
      let u = this.pendingTasks.add();
      return (
        Ip(this, () => {
          queueMicrotask(() => this.pendingTasks.remove(u));
        }),
        this.navigationTransitions.handleNavigationRequest({
          source: r,
          restoredState: o,
          currentUrlTree: this.currentUrlTree,
          currentRawUrl: this.currentUrlTree,
          rawUrl: t,
          extras: i,
          resolve: a,
          reject: c,
          promise: l,
          currentSnapshot: this.routerState.snapshot,
          currentRouterState: this.routerState,
        }),
        l.catch(Promise.reject.bind(Promise))
      );
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function BE(e) {
  for (let n = 0; n < e.length; n++) if (e[n] == null) throw new v(4008, !1);
}
var zE = new y("");
function Oc(e, ...n) {
  return Fn([
    { provide: Si, multi: !0, useValue: e },
    [],
    { provide: Pt, useFactory: qE },
    { provide: Zo, multi: !0, useFactory: WE },
    n.map((t) => t.ɵproviders),
  ]);
}
function qE() {
  return p(Ac).routerState.root;
}
function WE() {
  let e = p(Oe);
  return (n) => {
    let t = e.get(xt);
    if (n !== t.components[0]) return;
    let r = e.get(Ac),
      o = e.get(GE);
    (e.get(QE) === 1 && r.initialNavigation(),
      e.get(ZE, null, { optional: !0 })?.setUpPreloading(),
      e.get(zE, null, { optional: !0 })?.init(),
      r.resetRootComponentType(t.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe()));
  };
}
var GE = new y("", { factory: () => new te() }),
  QE = new y("", { factory: () => 1 });
var ZE = new y("");
var wp = [];
var Dp = { providers: [lf({ eventCoalescing: !0 }), Oc(wp)] };
var Ti = class e {
  title = "amigo-oculto";
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = sr({
    type: e,
    selectors: [["app-root"]],
    decls: 106,
    vars: 0,
    consts: [
      [
        1,
        "min-h-screen",
        "bg-base-100",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-8",
        "p-8",
      ],
      [
        1,
        "text-4xl",
        "font-bold",
        "text-center",
        "text-primary",
        "tracking-tight",
      ],
      [1, "text-lg", "text-neutral", "opacity-60", "text-center", "max-w-md"],
      [1, "flex", "flex-col", "gap-6", "w-full", "max-w-2xl"],
      [1, "text-xl", "font-semibold", "text-neutral", "text-center"],
      [1, "flex", "flex-row", "gap-4", "flex-wrap", "justify-center"],
      [1, "btn", "btn-primary", "rounded-brand", "px-8", "shadow-brand"],
      [1, "btn", "btn-secondary", "rounded-brand", "px-8", "shadow-secondary"],
      [
        1,
        "btn",
        "btn-accent",
        "btn-outline",
        "rounded-brand",
        "px-8",
        "shadow-accent",
      ],
      [1, "btn", "btn-neutral", "rounded-brand", "px-8"],
      [1, "flex", "flex-col", "gap-4", "w-full", "max-w-2xl"],
      [1, "flex", "flex-wrap", "justify-center", "gap-2"],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-50",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-100",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-200",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-300",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-400",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-500",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-600",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-700",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-800",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-primary-900",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-50",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-100",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-200",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-300",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-400",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-500",
        "flex",
        "items-center",
        "justify-center",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-600",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-700",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-800",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [
        1,
        "w-16",
        "h-16",
        "rounded-xl",
        "bg-secondary-900",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "text-xs",
      ],
      [1, "flex", "flex-wrap", "justify-center", "gap-4"],
      [1, "btn", "btn-success", "rounded-brand", "px-8"],
      [1, "btn", "btn-warning", "rounded-brand", "px-8"],
      [1, "btn", "btn-error", "rounded-brand", "px-8"],
      [1, "btn", "btn-info", "rounded-brand", "px-8"],
      [1, "flex", "flex-wrap", "justify-center", "gap-4", "items-end"],
      [
        "type",
        "text",
        "placeholder",
        "Input padr\xE3o",
        1,
        "input",
        "input-bordered",
        "w-full",
        "max-w-xs",
        "rounded-brand",
      ],
      [
        "type",
        "text",
        "placeholder",
        "Input primary",
        1,
        "input",
        "input-primary",
        "w-full",
        "max-w-xs",
        "rounded-brand",
      ],
      [
        "type",
        "text",
        "placeholder",
        "Input secondary",
        1,
        "input",
        "input-secondary",
        "w-full",
        "max-w-xs",
        "rounded-brand",
      ],
      [1, "card", "w-64", "bg-base-200", "shadow-brand"],
      [1, "card-body"],
      [1, "card-title", "text-primary"],
      [1, "text-neutral", "opacity-70"],
      [1, "card-actions", "justify-end"],
      [1, "btn", "btn-primary", "btn-sm", "rounded-brand"],
      [1, "card", "w-64", "bg-base-200", "shadow-secondary"],
      [1, "card-title", "text-secondary"],
      [1, "btn", "btn-secondary", "btn-sm", "rounded-brand"],
    ],
    template: function (t, r) {
      t & 1 &&
        (I(0, "div", 0)(1, "h1", 1),
        D(2, " \u{1F680} Nexus Design System "),
        w(),
        I(3, "p", 2),
        D(
          4,
          " Demonstra\xE7\xE3o dos Design Tokens e componentes com DaisyUI + Tailwind CSS ",
        ),
        w(),
        I(5, "div", 3)(6, "h2", 4),
        D(7, "Bot\xF5es"),
        w(),
        I(8, "div", 5)(9, "button", 6),
        D(10, " Principal "),
        w(),
        I(11, "button", 7),
        D(12, " Secund\xE1rio "),
        w(),
        I(13, "button", 8),
        D(14, " Destaque "),
        w(),
        I(15, "button", 9),
        D(16, "Neutral"),
        w()()(),
        I(17, "div", 10)(18, "h2", 4),
        D(19, " Paleta Primary "),
        w(),
        I(20, "div", 11)(21, "div", 12),
        D(22, " 50 "),
        w(),
        I(23, "div", 13),
        D(24, " 100 "),
        w(),
        I(25, "div", 14),
        D(26, " 200 "),
        w(),
        I(27, "div", 15),
        D(28, " 300 "),
        w(),
        I(29, "div", 16),
        D(30, " 400 "),
        w(),
        I(31, "div", 17),
        D(32, " 500 "),
        w(),
        I(33, "div", 18),
        D(34, " 600 "),
        w(),
        I(35, "div", 19),
        D(36, " 700 "),
        w(),
        I(37, "div", 20),
        D(38, " 800 "),
        w(),
        I(39, "div", 21),
        D(40, " 900 "),
        w()()(),
        I(41, "div", 10)(42, "h2", 4),
        D(43, " Paleta Secondary "),
        w(),
        I(44, "div", 11)(45, "div", 22),
        D(46, " 50 "),
        w(),
        I(47, "div", 23),
        D(48, " 100 "),
        w(),
        I(49, "div", 24),
        D(50, " 200 "),
        w(),
        I(51, "div", 25),
        D(52, " 300 "),
        w(),
        I(53, "div", 26),
        D(54, " 400 "),
        w(),
        I(55, "div", 27),
        D(56, " 500 "),
        w(),
        I(57, "div", 28),
        D(58, " 600 "),
        w(),
        I(59, "div", 29),
        D(60, " 700 "),
        w(),
        I(61, "div", 30),
        D(62, " 800 "),
        w(),
        I(63, "div", 31),
        D(64, " 900 "),
        w()()(),
        I(65, "div", 10)(66, "h2", 4),
        D(67, "Estados"),
        w(),
        I(68, "div", 32)(69, "button", 33),
        D(70, "Success"),
        w(),
        I(71, "button", 34),
        D(72, "Warning"),
        w(),
        I(73, "button", 35),
        D(74, "Error"),
        w(),
        I(75, "button", 36),
        D(76, "Info"),
        w()()(),
        I(77, "div", 10)(78, "h2", 4),
        D(79, "Inputs"),
        w(),
        I(80, "div", 37),
        Ko(81, "input", 38)(82, "input", 39)(83, "input", 40),
        w()(),
        I(84, "div", 10)(85, "h2", 4),
        D(86, "Cards"),
        w(),
        I(87, "div", 32)(88, "div", 41)(89, "div", 42)(90, "h3", 43),
        D(91, "Card Primary"),
        w(),
        I(92, "p", 44),
        D(93, " Exemplo de card com sombra brand. "),
        w(),
        I(94, "div", 45)(95, "button", 46),
        D(96, "A\xE7\xE3o"),
        w()()()(),
        I(97, "div", 47)(98, "div", 42)(99, "h3", 48),
        D(100, "Card Secondary"),
        w(),
        I(101, "p", 44),
        D(102, " Exemplo de card com sombra secondary. "),
        w(),
        I(103, "div", 45)(104, "button", 49),
        D(105, "A\xE7\xE3o"),
        w()()()()()()());
    },
    encapsulation: 2,
  });
};
Za(Ti, Dp).catch((e) => console.error(e));
