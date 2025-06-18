import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import { b as useSupabaseUser, n as navigateTo } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const handleSignOut = async () => {
      await client.auth.signOut();
      navigateTo("/");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Button = resolveComponent("Button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><header class="bg-white shadow-sm"><nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between h-16"><div class="flex">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center no-underline transition-all hover:opacity-80"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-2xl font-bold text-primary-600"${_scopeId}>C</span><span class="ml-2 text-xl font-bold text-gray-900"${_scopeId}>Cogitations</span>`);
          } else {
            return [
              createVNode("span", { class: "text-2xl font-bold text-primary-600" }, "C"),
              createVNode("span", { class: "ml-2 text-xl font-bold text-gray-900" }, "Cogitations")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/search" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              icon: "pi pi-search",
              rounded: "",
              "aria-label": "Search"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                icon: "pi pi-search",
                rounded: "",
                "aria-label": "Search"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(user)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/profile" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Button, {
                icon: "pi pi-user",
                text: "",
                rounded: "",
                "aria-label": "Profile",
                severity: unref(user) ? "success" : void 0
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Button, {
                  icon: "pi pi-user",
                  text: "",
                  rounded: "",
                  "aria-label": "Profile",
                  severity: unref(user) ? "success" : void 0
                }, null, 8, ["severity"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Button, {
          onClick: handleSignOut,
          icon: "pi pi-sign-out",
          text: "",
          rounded: "",
          "aria-label": "Sign out"
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/auth/login" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Button, { label: "Sign in" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Button, { label: "Sign in" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/auth/register" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Button, { label: "Sign up" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Button, { label: "Sign up" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></div></nav></header><main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-white border-t"><div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center"><div class="text-gray-500 text-sm"> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Cogitations. All rights reserved. </div><div class="flex space-x-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "text-gray-500 hover:text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` About `);
          } else {
            return [
              createTextVNode(" About ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-gray-500 hover:text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Privacy `);
          } else {
            return [
              createTextVNode(" Privacy ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/terms",
        class: "text-gray-500 hover:text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Terms `);
          } else {
            return [
              createTextVNode(" Terms ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-D74EYs-i.mjs.map
