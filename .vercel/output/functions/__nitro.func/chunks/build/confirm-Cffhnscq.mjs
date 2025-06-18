import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import './server.mjs';
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
  __name: "confirm",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = resolveComponent("Card");
      const _component_ProgressSpinner = resolveComponent("ProgressSpinner");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_ProgressSpinner, null, null, _parent2, _scopeId));
            _push2(`<p class="text-gray-600"${_scopeId}>Completing sign in...</p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center space-y-4" }, [
                createVNode(_component_ProgressSpinner),
                createVNode("p", { class: "text-gray-600" }, "Completing sign in...")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/confirm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=confirm-Cffhnscq.mjs.map
