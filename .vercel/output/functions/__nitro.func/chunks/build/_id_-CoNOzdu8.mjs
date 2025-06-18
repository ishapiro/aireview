import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { ref, withAsyncContext, resolveComponent, mergeProps, withCtx, createVNode, unref, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseUser, c as useToast, a as useRouter, u as useRoute } from './server.mjs';
import { format } from 'date-fns';
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    useSupabaseUser();
    const toast = useToast();
    const router = useRouter();
    const route = useRoute();
    const review = ref(null);
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
    const formatDate = (date) => {
      if (!date) return "N/A";
      return format(new Date(date), "MMM d, yyyy h:mm a");
    };
    const generateSlug = (title) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };
    const handleSubmit = async () => {
      isSubmitting.value = true;
      const reviewId = route.params.id;
      try {
        const { error } = await client.from("reviews").update({
          title: form.value.title,
          slug: generateSlug(form.value.title),
          content: form.value.content,
          category_id: form.value.category_id,
          rating: form.value.rating,
          is_published: form.value.is_published
        }).eq("id", reviewId);
        if (error) throw error;
        toast.add({
          severity: "success",
          summary: "Success",
          detail: `Review ${form.value.is_published ? "published" : "saved as draft"} successfully`,
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
    const handlePublishToggle = async () => {
      form.value.is_published = !form.value.is_published;
      await handleSubmit();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Button = resolveComponent("Button");
      const _component_Card = resolveComponent("Card");
      const _component_Tag = resolveComponent("Tag");
      const _component_InputText = resolveComponent("InputText");
      const _component_Dropdown = resolveComponent("Dropdown");
      const _component_Textarea = resolveComponent("Textarea");
      const _component_InputSwitch = resolveComponent("InputSwitch");
      const _component_Toast = resolveComponent("Toast");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-8"><h1 class="text-3xl font-bold text-gray-900">Edit Review</h1>`);
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
      _push(ssrRenderComponent(_component_Card, { class: "mb-6" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}>Review Information</h2><div class="flex items-center space-x-2"${_scopeId}><span class="text-sm text-gray-600"${_scopeId}>Status:</span>`);
            _push2(ssrRenderComponent(_component_Tag, {
              value: unref(form).is_published ? "Published" : "Draft",
              severity: unref(form).is_published ? "success" : "warning"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, "Review Information"),
                createVNode("div", { class: "flex items-center space-x-2" }, [
                  createVNode("span", { class: "text-sm text-gray-600" }, "Status:"),
                  createVNode(_component_Tag, {
                    value: unref(form).is_published ? "Published" : "Draft",
                    severity: unref(form).is_published ? "success" : "warning"
                  }, null, 8, ["value", "severity"])
                ])
              ])
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Created</label><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(formatDate((_a = unref(review)) == null ? void 0 : _a.created_at))}</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Last Updated</label><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(formatDate((_b = unref(review)) == null ? void 0 : _b.updated_at))}</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Views</label><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_c = unref(review)) == null ? void 0 : _c.views_count) || 0)}</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Helpful Votes</label><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_d = unref(review)) == null ? void 0 : _d.helpful_count) || 0)}</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Author</label><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate((_f = (_e = unref(review)) == null ? void 0 : _e.author) == null ? void 0 : _f.full_name)}</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Slug</label><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate((_g = unref(review)) == null ? void 0 : _g.slug)}</div></div></div><form${_scopeId}><div class="field mb-4"${_scopeId}><label for="title" class="block text-sm font-medium text-gray-700"${_scopeId}>Title</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "title",
              modelValue: unref(form).title,
              "onUpdate:modelValue": ($event) => unref(form).title = $event,
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field mb-4"${_scopeId}><label for="category" class="block text-sm font-medium text-gray-700"${_scopeId}>Category</label>`);
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
            _push2(`</div><div class="field mb-4"${_scopeId}><label for="content" class="block text-sm font-medium text-gray-700"${_scopeId}>Content</label>`);
            _push2(ssrRenderComponent(_component_Textarea, {
              id: "content",
              modelValue: unref(form).content,
              "onUpdate:modelValue": ($event) => unref(form).content = $event,
              rows: "10",
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field mb-4"${_scopeId}><label for="rating" class="block text-sm font-medium text-gray-700"${_scopeId}>Rating</label>`);
            _push2(ssrRenderComponent(_component_Dropdown, {
              id: "rating",
              modelValue: unref(form).rating,
              "onUpdate:modelValue": ($event) => unref(form).rating = $event,
              options: [1, 2, 3, 4, 5],
              placeholder: "Select a rating",
              class: "w-full",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field mb-6"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_InputSwitch, {
              modelValue: unref(form).is_published,
              "onUpdate:modelValue": ($event) => unref(form).is_published = $event,
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(`<label class="text-sm font-medium text-gray-700"${_scopeId}>Published</label></div><p class="mt-1 text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(form).is_published ? "This review is visible to the public" : "This review is currently in draft mode")}</p></div><div class="flex items-center space-x-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              loading: unref(isSubmitting),
              label: unref(form).is_published ? "Update & Publish" : "Update as Draft"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              type: "button",
              severity: "secondary",
              label: unref(form).is_published ? "Unpublish" : "Publish",
              onClick: handlePublishToggle
            }, null, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Created"),
                    createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(formatDate((_h = unref(review)) == null ? void 0 : _h.created_at)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Last Updated"),
                    createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(formatDate((_i = unref(review)) == null ? void 0 : _i.updated_at)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Views"),
                    createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(((_j = unref(review)) == null ? void 0 : _j.views_count) || 0), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Helpful Votes"),
                    createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(((_k = unref(review)) == null ? void 0 : _k.helpful_count) || 0), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Author"),
                    createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString((_m = (_l = unref(review)) == null ? void 0 : _l.author) == null ? void 0 : _m.full_name), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Slug"),
                    createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString((_n = unref(review)) == null ? void 0 : _n.slug), 1)
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"])
                }, [
                  createVNode("div", { class: "field mb-4" }, [
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
                  createVNode("div", { class: "field mb-4" }, [
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
                  createVNode("div", { class: "field mb-4" }, [
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
                  createVNode("div", { class: "field mb-4" }, [
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
                  createVNode("div", { class: "field mb-6" }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode(_component_InputSwitch, {
                        modelValue: unref(form).is_published,
                        "onUpdate:modelValue": ($event) => unref(form).is_published = $event,
                        class: "mr-2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("label", { class: "text-sm font-medium text-gray-700" }, "Published")
                    ]),
                    createVNode("p", { class: "mt-1 text-sm text-gray-500" }, toDisplayString(unref(form).is_published ? "This review is visible to the public" : "This review is currently in draft mode"), 1)
                  ]),
                  createVNode("div", { class: "flex items-center space-x-4" }, [
                    createVNode(_component_Button, {
                      type: "submit",
                      loading: unref(isSubmitting),
                      label: unref(form).is_published ? "Update & Publish" : "Update as Draft"
                    }, null, 8, ["loading", "label"]),
                    createVNode(_component_Button, {
                      type: "button",
                      severity: "secondary",
                      label: unref(form).is_published ? "Unpublish" : "Publish",
                      onClick: handlePublishToggle
                    }, null, 8, ["label"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      if (unref(form) === null) {
        _push(`<div class="p-6 bg-red-50 border border-red-200 rounded text-red-700 mt-8"><strong>Error:</strong> Review not found or you do not have access.<br> Please check the review ID or your permissions. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/reviews/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CoNOzdu8.mjs.map
