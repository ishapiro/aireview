import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 py-8" }, _attrs))}><h1 class="text-3xl font-bold mb-6">About Cogitations Reviews</h1><div class="prose max-w-none"><p class="mb-4"> Welcome to Cogitations Reviews, your trusted platform for thoughtful and in-depth product reviews. Our mission is to provide honest, detailed, and well-researched reviews to help you make informed decisions. </p><p class="mb-4"> Our community of reviewers brings diverse expertise and real-world experience to every review, ensuring you get comprehensive insights into the products you&#39;re interested in. </p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-8tNV4uow.mjs.map
