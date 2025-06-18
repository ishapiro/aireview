import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { ref, withAsyncContext, resolveComponent, mergeProps, withCtx, createVNode, unref, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { b as useSupabaseUser, c as useToast, a as useRouter } from './server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import { u as useAsyncData } from './asyncData-fmUzjeAS.mjs';
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
import 'perfect-debounce';

const _sfc_main = {
  __name: "new",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    const router = useRouter();
    const form = ref({
      title: "",
      content: "",
      category_id: null,
      rating: null,
      is_published: true
    });
    const isSubmitting = ref(false);
    const { data: categories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("categories", async () => {
      const { data } = await client.from("categories").select("*").order("name");
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const generateSlug = (title) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };
    const handleSubmit = async () => {
      isSubmitting.value = true;
      try {
        const { error } = await client.from("reviews").insert({
          title: form.value.title,
          slug: generateSlug(form.value.title),
          content: form.value.content,
          category_id: form.value.category_id,
          rating: form.value.rating,
          user_id: user.value.id,
          is_published: form.value.is_published
        });
        if (error) throw error;
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Review created successfully",
          life: 3e3
        });
        router.push("/admin/reviews");
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3e3
        });
      } finally {
        isSubmitting.value = false;
      }
    };
    const handleSaveAsDraft = () => {
      form.value.is_published = false;
      handleSubmit();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Button = resolveComponent("Button");
      const _component_Card = resolveComponent("Card");
      const _component_InputText = resolveComponent("InputText");
      const _component_Dropdown = resolveComponent("Dropdown");
      const _component_Textarea = resolveComponent("Textarea");
      const _component_Toast = resolveComponent("Toast");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-8"><h1 class="text-3xl font-bold text-gray-900">Create New Review</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin/reviews" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              label: "Back to Reviews",
              icon: "pi pi-arrow-left",
              severity: "secondary"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                label: "Back to Reviews",
                icon: "pi pi-arrow-left",
                severity: "secondary"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><form${_scopeId}><div class="field"${_scopeId}><label for="title" class="block text-sm font-medium text-gray-700"${_scopeId}>Title</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "title",
              modelValue: unref(form).title,
              "onUpdate:modelValue": ($event) => unref(form).title = $event,
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="category" class="block text-sm font-medium text-gray-700"${_scopeId}>Category</label>`);
            _push2(ssrRenderComponent(_component_Dropdown, {
              id: "category",
              modelValue: unref(form).category_id,
              "onUpdate:modelValue": ($event) => unref(form).category_id = $event,
              options: unref(categories),
              "option-label": "name",
              "option-value": "id",
              placeholder: "Select a category",
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="content" class="block text-sm font-medium text-gray-700"${_scopeId}>Content</label>`);
            _push2(ssrRenderComponent(_component_Textarea, {
              id: "content",
              modelValue: unref(form).content,
              "onUpdate:modelValue": ($event) => unref(form).content = $event,
              rows: "10",
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="rating" class="block text-sm font-medium text-gray-700"${_scopeId}>Rating</label>`);
            _push2(ssrRenderComponent(_component_Dropdown, {
              id: "rating",
              modelValue: unref(form).rating,
              "onUpdate:modelValue": ($event) => unref(form).rating = $event,
              options: [1, 2, 3, 4, 5],
              placeholder: "Select a rating",
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center space-x-4 mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              loading: unref(isSubmitting),
              label: "Create Review"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              type: "button",
              severity: "secondary",
              label: "Save as Draft",
              onClick: handleSaveAsDraft
            }, null, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"])
                }, [
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "title",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Title"),
                    createVNode(_component_InputText, {
                      id: "title",
                      modelValue: unref(form).title,
                      "onUpdate:modelValue": ($event) => unref(form).title = $event,
                      class: "w-full",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "category",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Category"),
                    createVNode(_component_Dropdown, {
                      id: "category",
                      modelValue: unref(form).category_id,
                      "onUpdate:modelValue": ($event) => unref(form).category_id = $event,
                      options: unref(categories),
                      "option-label": "name",
                      "option-value": "id",
                      placeholder: "Select a category",
                      class: "w-full",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "content",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Content"),
                    createVNode(_component_Textarea, {
                      id: "content",
                      modelValue: unref(form).content,
                      "onUpdate:modelValue": ($event) => unref(form).content = $event,
                      rows: "10",
                      class: "w-full",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "rating",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Rating"),
                    createVNode(_component_Dropdown, {
                      id: "rating",
                      modelValue: unref(form).rating,
                      "onUpdate:modelValue": ($event) => unref(form).rating = $event,
                      options: [1, 2, 3, 4, 5],
                      placeholder: "Select a rating",
                      class: "w-full",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "flex items-center space-x-4 mt-6" }, [
                    createVNode(_component_Button, {
                      type: "submit",
                      loading: unref(isSubmitting),
                      label: "Create Review"
                    }, null, 8, ["loading"]),
                    createVNode(_component_Button, {
                      type: "button",
                      severity: "secondary",
                      label: "Save as Draft",
                      onClick: handleSaveAsDraft
                    })
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/reviews/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-BLUQUrf2.mjs.map
