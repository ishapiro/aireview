import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 py-8" }, _attrs))}><h1 class="text-3xl font-bold mb-6">Terms of Service</h1><div class="prose max-w-none"><p class="mb-4"> By using Cogitations Reviews, you agree to these terms of service. Please read them carefully. </p><h2 class="text-2xl font-semibold mt-6 mb-4">User Responsibilities</h2><p class="mb-4"> When using our service, you agree to: </p><ul class="list-disc ml-6 mb-4"><li>Provide accurate and truthful reviews</li><li>Respect other users and their opinions</li><li>Not engage in any form of harassment or abuse</li><li>Not post spam or misleading content</li></ul></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=terms-Cboxz_2S.mjs.map
