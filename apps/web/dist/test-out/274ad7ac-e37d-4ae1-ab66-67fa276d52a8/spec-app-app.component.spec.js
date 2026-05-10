import {
  Component,
  TestBed,
  __async,
  __commonJS,
  __esm,
  init_core,
  init_testing,
} from "./chunk-EGXJF4PV.js";

// ../../node_modules/tslib/tslib.es6.mjs
function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
    r =
      c < 3
        ? target
        : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i]))
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return (c > 3 && r && Object.defineProperty(target, key, r), r);
}
var init_tslib_es6 = __esm({
  "../../node_modules/tslib/tslib.es6.mjs"() {
    "use strict";
  },
});

// angular:jit:template:src/app/app.component.html
var app_component_default;
var init_app_component = __esm({
  "angular:jit:template:src/app/app.component.html"() {
    app_component_default =
      '<div\n  class="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-8 p-8"\n>\n  <!-- T\xEDtulo centralizado -->\n  <h1 class="text-4xl font-bold text-center text-primary tracking-tight">\n    \u{1F680} Nexus Design System\n  </h1>\n\n  <p class="text-lg text-neutral opacity-60 text-center max-w-md">\n    Demonstra\xE7\xE3o dos Design Tokens e componentes com DaisyUI + Tailwind CSS\n  </p>\n\n  <!-- Se\xE7\xE3o: Bot\xF5es -->\n  <div class="flex flex-col gap-6 w-full max-w-2xl">\n    <h2 class="text-xl font-semibold text-neutral text-center">Bot\xF5es</h2>\n    <div class="flex flex-row gap-4 flex-wrap justify-center">\n      <button class="btn btn-primary rounded-brand px-8 shadow-brand">\n        Principal\n      </button>\n      <button class="btn btn-secondary rounded-brand px-8 shadow-secondary">\n        Secund\xE1rio\n      </button>\n      <button\n        class="btn btn-accent btn-outline rounded-brand px-8 shadow-accent"\n      >\n        Destaque\n      </button>\n      <button class="btn btn-neutral rounded-brand px-8">Neutral</button>\n    </div>\n  </div>\n\n  <!-- Se\xE7\xE3o: Cores Primary -->\n  <div class="flex flex-col gap-4 w-full max-w-2xl">\n    <h2 class="text-xl font-semibold text-neutral text-center">\n      Paleta Primary\n    </h2>\n    <div class="flex flex-wrap justify-center gap-2">\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center text-xs"\n      >\n        50\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center text-xs"\n      >\n        100\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-200 flex items-center justify-center text-xs"\n      >\n        200\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-300 flex items-center justify-center text-xs"\n      >\n        300\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-400 flex items-center justify-center text-xs"\n      >\n        400\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-500 flex items-center justify-center text-xs"\n      >\n        500\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs"\n      >\n        600\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-700 flex items-center justify-center text-white text-xs"\n      >\n        700\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-800 flex items-center justify-center text-white text-xs"\n      >\n        800\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-primary-900 flex items-center justify-center text-white text-xs"\n      >\n        900\n      </div>\n    </div>\n  </div>\n\n  <!-- Se\xE7\xE3o: Cores Secondary -->\n  <div class="flex flex-col gap-4 w-full max-w-2xl">\n    <h2 class="text-xl font-semibold text-neutral text-center">\n      Paleta Secondary\n    </h2>\n    <div class="flex flex-wrap justify-center gap-2">\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-50 flex items-center justify-center text-xs"\n      >\n        50\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-100 flex items-center justify-center text-xs"\n      >\n        100\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-200 flex items-center justify-center text-xs"\n      >\n        200\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-300 flex items-center justify-center text-xs"\n      >\n        300\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-400 flex items-center justify-center text-xs"\n      >\n        400\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-500 flex items-center justify-center text-xs"\n      >\n        500\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-600 flex items-center justify-center text-white text-xs"\n      >\n        600\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-700 flex items-center justify-center text-white text-xs"\n      >\n        700\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-800 flex items-center justify-center text-white text-xs"\n      >\n        800\n      </div>\n      <div\n        class="w-16 h-16 rounded-xl bg-secondary-900 flex items-center justify-center text-white text-xs"\n      >\n        900\n      </div>\n    </div>\n  </div>\n\n  <!-- Se\xE7\xE3o: Estados -->\n  <div class="flex flex-col gap-4 w-full max-w-2xl">\n    <h2 class="text-xl font-semibold text-neutral text-center">Estados</h2>\n    <div class="flex flex-wrap justify-center gap-4">\n      <button class="btn btn-success rounded-brand px-8">Success</button>\n      <button class="btn btn-warning rounded-brand px-8">Warning</button>\n      <button class="btn btn-error rounded-brand px-8">Error</button>\n      <button class="btn btn-info rounded-brand px-8">Info</button>\n    </div>\n  </div>\n\n  <!-- Se\xE7\xE3o: Inputs -->\n  <div class="flex flex-col gap-4 w-full max-w-2xl">\n    <h2 class="text-xl font-semibold text-neutral text-center">Inputs</h2>\n    <div class="flex flex-wrap justify-center gap-4 items-end">\n      <input\n        type="text"\n        placeholder="Input padr\xE3o"\n        class="input input-bordered w-full max-w-xs rounded-brand"\n      />\n      <input\n        type="text"\n        placeholder="Input primary"\n        class="input input-primary w-full max-w-xs rounded-brand"\n      />\n      <input\n        type="text"\n        placeholder="Input secondary"\n        class="input input-secondary w-full max-w-xs rounded-brand"\n      />\n    </div>\n  </div>\n\n  <!-- Se\xE7\xE3o: Cards -->\n  <div class="flex flex-col gap-4 w-full max-w-2xl">\n    <h2 class="text-xl font-semibold text-neutral text-center">Cards</h2>\n    <div class="flex flex-wrap justify-center gap-4">\n      <div class="card w-64 bg-base-200 shadow-brand">\n        <div class="card-body">\n          <h3 class="card-title text-primary">Card Primary</h3>\n          <p class="text-neutral opacity-70">\n            Exemplo de card com sombra brand.\n          </p>\n          <div class="card-actions justify-end">\n            <button class="btn btn-primary btn-sm rounded-brand">A\xE7\xE3o</button>\n          </div>\n        </div>\n      </div>\n      <div class="card w-64 bg-base-200 shadow-secondary">\n        <div class="card-body">\n          <h3 class="card-title text-secondary">Card Secondary</h3>\n          <p class="text-neutral opacity-70">\n            Exemplo de card com sombra secondary.\n          </p>\n          <div class="card-actions justify-end">\n            <button class="btn btn-secondary btn-sm rounded-brand">A\xE7\xE3o</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';
  },
});

// angular:jit:style:src/app/app.component.css
var app_component_default2;
var init_app_component2 = __esm({
  "angular:jit:style:src/app/app.component.css"() {
    app_component_default2 =
      "/* src/app/app.component.css */\n/*# sourceMappingURL=app.component.css.map */\n";
  },
});

// src/app/app.component.ts
var AppComponent;
var init_app_component3 = __esm({
  "src/app/app.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_app_component();
    init_app_component2();
    init_core();
    AppComponent = class AppComponent2 {
      title = "amigo-oculto";
    };
    AppComponent = __decorate(
      [
        Component({
          selector: "app-root",
          // imports: [RouterOutlet],
          template: app_component_default,
          styles: [app_component_default2],
        }),
      ],
      AppComponent,
    );
  },
});

// src/app/app.component.spec.ts
var require_app_component_spec = __commonJS({
  "src/app/app.component.spec.ts"(exports) {
    init_testing();
    init_app_component3();
    describe("AppComponent", () => {
      beforeEach(() =>
        __async(null, null, function* () {
          yield TestBed.configureTestingModule({
            imports: [AppComponent],
          }).compileComponents();
        }),
      );
      it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      });
      it(`should have the 'amigo-oculto' title`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual("amigo-oculto");
      });
      it("should render title", () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("h1")?.textContent).toContain(
          "Hello, amigo-oculto",
        );
      });
    });
  },
});
export default require_app_component_spec();
//# sourceMappingURL=spec-app-app.component.spec.js.map
