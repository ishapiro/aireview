import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "privacy",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 py-8" }, _attrs))}><h1 class="text-3xl font-bold mb-6">Privacy Policy</h1><div class="prose max-w-none"><p class="mb-4"> At Cogitations Reviews, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information when you use our service. </p><h2 class="text-2xl font-semibold mt-6 mb-4">Information We Collect</h2><p class="mb-4"> We collect information that you provide directly to us when you: </p><ul class="list-disc ml-6 mb-4"><li>Create an account</li><li>Write reviews</li><li>Comment on reviews</li><li>Contact us</li></ul></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=privacy-DnZjON0s.mjs.map
