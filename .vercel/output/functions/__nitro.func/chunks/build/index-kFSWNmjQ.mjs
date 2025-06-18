import { ref, withAsyncContext, resolveComponent, mergeProps, withCtx, unref, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, isRef, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { c as useToast, d as useConfirm } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    const toast = useToast();
    const confirm = useConfirm();
    const showDialog = ref(false);
    const isSubmitting = ref(false);
    const editingCategory = ref(null);
    const form = ref({
      name: "",
      description: ""
    });
    const { data: categories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("admin-categories", async () => {
      const { data } = await client.from("categories").select("*").order("name");
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const generateSlug = (name) => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };
    const handleEdit = (category) => {
      editingCategory.value = category;
      form.value = {
        name: category.name,
        description: category.description || ""
      };
      showDialog.value = true;
    };
    const handleSubmit = async () => {
      isSubmitting.value = true;
      try {
        const categoryData = {
          name: form.value.name,
          slug: generateSlug(form.value.name),
          description: form.value.description
        };
        let error;
        if (editingCategory.value) {
          const response = await client.from("categories").update(categoryData).eq("id", editingCategory.value.id);
          error = response.error;
        } else {
          const response = await client.from("categories").insert(categoryData);
          error = response.error;
        }
        if (error) throw error;
        const { data } = await client.from("categories").select("*").order("name");
        categories.value = data;
        showDialog.value = false;
        editingCategory.value = null;
        form.value = { name: "", description: "" };
        toast.add({
          severity: "success",
          summary: "Success",
          detail: `Category ${editingCategory.value ? "updated" : "created"} successfully`,
          life: 3e3
        });
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
    const handleDelete = (id) => {
      confirm.require({
        message: "Are you sure you want to delete this category?",
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          try {
            const { error } = await client.from("categories").delete().eq("id", id);
            if (error) throw error;
            categories.value = categories.value.filter((category) => category.id !== id);
            toast.add({
              severity: "success",
              summary: "Success",
              detail: "Category deleted successfully",
              life: 3e3
            });
          } catch (error) {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: error.message,
              life: 3e3
            });
          }
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = resolveComponent("Button");
      const _component_Card = resolveComponent("Card");
      const _component_Dialog = resolveComponent("Dialog");
      const _component_InputText = resolveComponent("InputText");
      const _component_Textarea = resolveComponent("Textarea");
      const _component_Toast = resolveComponent("Toast");
      const _component_ConfirmDialog = resolveComponent("ConfirmDialog");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-8"><h1 class="text-3xl font-bold text-gray-900">Categories</h1>`);
      _push(ssrRenderComponent(_component_Button, {
        onClick: ($event) => showDialog.value = true,
        label: "Add Category",
        icon: "pi pi-plus"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Name </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Slug </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Description </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"${_scopeId}> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(unref(categories), (category) => {
              _push2(`<tr${_scopeId}><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm font-medium text-gray-900"${_scopeId}>${ssrInterpolate(category.name)}</div></td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(category.slug)}</div></td><td class="px-6 py-4"${_scopeId}><div class="text-sm text-gray-900"${_scopeId}>${ssrInterpolate(category.description)}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm"${_scopeId}><button class="text-primary-600 hover:text-primary-900 mr-4"${_scopeId}> Edit </button><button class="text-red-600 hover:text-red-900"${_scopeId}> Delete </button></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
          } else {
            return [
              createVNode("div", { class: "overflow-x-auto" }, [
                createVNode("table", { class: "min-w-full divide-y divide-gray-200" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Name "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Slug "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Description "),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, " Actions ")
                    ])
                  ]),
                  createVNode("tbody", { class: "bg-white divide-y divide-gray-200" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(categories), (category) => {
                      return openBlock(), createBlock("tr", {
                        key: category.id
                      }, [
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm font-medium text-gray-900" }, toDisplayString(category.name), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("div", { class: "text-sm text-gray-500" }, toDisplayString(category.slug), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4" }, [
                          createVNode("div", { class: "text-sm text-gray-900" }, toDisplayString(category.description), 1)
                        ]),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm" }, [
                          createVNode("button", {
                            onClick: ($event) => handleEdit(category),
                            class: "text-primary-600 hover:text-primary-900 mr-4"
                          }, " Edit ", 8, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => handleDelete(category.id),
                            class: "text-red-600 hover:text-red-900"
                          }, " Delete ", 8, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Dialog, {
        visible: unref(showDialog),
        "onUpdate:visible": ($event) => isRef(showDialog) ? showDialog.value = $event : null,
        modal: true,
        header: unref(editingCategory) ? "Edit Category" : "Add Category",
        class: "p-fluid"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="field"${_scopeId}><label for="name" class="block text-sm font-medium text-gray-700"${_scopeId}>Name</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "name",
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="description" class="block text-sm font-medium text-gray-700"${_scopeId}>Description</label>`);
            _push2(ssrRenderComponent(_component_Textarea, {
              id: "description",
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              rows: "3"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleSubmit, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("div", { class: "field" }, [
                  createVNode("label", {
                    for: "name",
                    class: "block text-sm font-medium text-gray-700"
                  }, "Name"),
                  createVNode(_component_InputText, {
                    id: "name",
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    required: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "field" }, [
                  createVNode("label", {
                    for: "description",
                    class: "block text-sm font-medium text-gray-700"
                  }, "Description"),
                  createVNode(_component_Textarea, {
                    id: "description",
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    rows: "3"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ], 32)
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              label: "Cancel",
              icon: "pi pi-times",
              onClick: ($event) => showDialog.value = false,
              severity: "secondary",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              label: "Save",
              icon: "pi pi-check",
              onClick: handleSubmit,
              loading: unref(isSubmitting)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                label: "Cancel",
                icon: "pi pi-times",
                onClick: ($event) => showDialog.value = false,
                severity: "secondary",
                class: "mr-2"
              }, null, 8, ["onClick"]),
              createVNode(_component_Button, {
                label: "Save",
                icon: "pi pi-check",
                onClick: handleSubmit,
                loading: unref(isSubmitting)
              }, null, 8, ["loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      _push(ssrRenderComponent(_component_ConfirmDialog, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/categories/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-kFSWNmjQ.mjs.map
