import { _ as _sfc_main$1 } from './ReviewCard-BqNC5YQA.mjs';
import { ref, computed, withAsyncContext, watch, resolveComponent, withCtx, unref, createVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import { u as useRoute, a as useRouter } from './server.mjs';
import { u as useAsyncData } from './asyncData-fmUzjeAS.mjs';
import './nuxt-link-C9HRXqxW.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'date-fns';
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
  __name: "search",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const client = useSupabaseClient();
    useRoute();
    const router = useRouter();
    const searchForm = ref({
      query: "",
      category: null,
      rating: null,
      sort: "created_at",
      order: "desc"
    });
    const searchResults = ref([]);
    const currentPage = ref(1);
    const totalResults = ref(0);
    const isSearching = ref(false);
    const hasSearched = ref(false);
    const paginatorFirst = computed({
      get: () => (currentPage.value - 1) * 12,
      set: (val) => {
        currentPage.value = Math.floor(val / 12) + 1;
      }
    });
    const { data: categories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("categories", async () => {
      const { data } = await client.from("categories").select("*").order("name");
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const ratingOptions = [
      { label: "Any Rating", value: null },
      { label: "4 Stars & Up", value: 4 },
      { label: "3 Stars & Up", value: 3 },
      { label: "2 Stars & Up", value: 2 },
      { label: "1 Star & Up", value: 1 }
    ];
    const sortOptions = [
      { label: "Newest First", value: "created_at" },
      { label: "Oldest First", value: "created_at_asc" },
      { label: "Highest Rated", value: "rating" },
      { label: "Lowest Rated", value: "rating_asc" },
      { label: "Most Helpful", value: "helpful_count" }
    ];
    const handleSearch = () => {
      currentPage.value = 1;
      fetchResults();
    };
    const onPageChange = (event) => {
      currentPage.value = Math.floor(event.first / 12) + 1;
      fetchResults();
    };
    const fetchResults = async () => {
      isSearching.value = true;
      hasSearched.value = true;
      try {
        let query = client.from("reviews").select(`
        *,
        profiles:user_id (full_name, avatar_url),
        categories (name, slug)
      `, { count: "exact" });
        if (searchForm.value.query) {
          query = query.or(`title.ilike.%${searchForm.value.query}%,content.ilike.%${searchForm.value.query}%`);
        }
        query = query.eq("is_published", true);
        if (searchForm.value.category) {
          query = query.eq("category_id", searchForm.value.category);
        }
        if (searchForm.value.rating) {
          query = query.gte("rating", searchForm.value.rating);
        }
        const [sortField, order] = searchForm.value.sort.split("_");
        query = query.order(sortField === "created" ? "created_at" : sortField, { ascending: order === "asc" });
        const from = (currentPage.value - 1) * 12;
        const to = from + 11;
        query = query.range(from, to);
        const { data, count, error } = await query;
        if (error) {
          console.error("Error fetching search results:", error);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch search results. Please try again.",
            life: 3e3
          });
          return;
        }
        searchResults.value = data || [];
        totalResults.value = count || 0;
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "An unexpected error occurred. Please try again.",
          life: 3e3
        });
      } finally {
        isSearching.value = false;
      }
    };
    watch(searchForm, (newValue) => {
      const query = { ...newValue };
      if (!query.category) delete query.category;
      if (!query.rating) delete query.rating;
      if (!query.query) delete query.query;
      if (query.sort === "created_at") delete query.sort;
      router.push({ query });
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = resolveComponent("Card");
      const _component_InputText = resolveComponent("InputText");
      const _component_Dropdown = resolveComponent("Dropdown");
      const _component_Button = resolveComponent("Button");
      const _component_ReviewCard = _sfc_main$1;
      const _component_Paginator = resolveComponent("Paginator");
      const _component_Toast = resolveComponent("Toast");
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-3xl font-bold text-gray-900 mb-8">Search Reviews</h1>`);
      _push(ssrRenderComponent(_component_Card, { class: "mb-8" }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><div class="field"${_scopeId}><label for="query" class="block text-sm font-medium text-gray-700"${_scopeId}>Search</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "query",
              modelValue: unref(searchForm).query,
              "onUpdate:modelValue": ($event) => unref(searchForm).query = $event,
              class: "w-full",
              placeholder: "Search reviews..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="category" class="block text-sm font-medium text-gray-700"${_scopeId}>Category</label>`);
            _push2(ssrRenderComponent(_component_Dropdown, {
              id: "category",
              modelValue: unref(searchForm).category,
              "onUpdate:modelValue": ($event) => unref(searchForm).category = $event,
              options: unref(categories),
              optionLabel: "name",
              optionValue: "id",
              placeholder: "All Categories",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="rating" class="block text-sm font-medium text-gray-700"${_scopeId}>Rating</label>`);
            _push2(ssrRenderComponent(_component_Dropdown, {
              id: "rating",
              modelValue: unref(searchForm).rating,
              "onUpdate:modelValue": ($event) => unref(searchForm).rating = $event,
              options: ratingOptions,
              optionLabel: "label",
              optionValue: "value",
              placeholder: "Any Rating",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="field"${_scopeId}><label for="sort" class="block text-sm font-medium text-gray-700"${_scopeId}>Sort By</label>`);
            _push2(ssrRenderComponent(_component_Dropdown, {
              id: "sort",
              modelValue: unref(searchForm).sort,
              "onUpdate:modelValue": ($event) => unref(searchForm).sort = $event,
              options: sortOptions,
              optionLabel: "label",
              optionValue: "value",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              loading: unref(isSearching),
              label: "Search"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleSearch, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "query",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Search"),
                    createVNode(_component_InputText, {
                      id: "query",
                      modelValue: unref(searchForm).query,
                      "onUpdate:modelValue": ($event) => unref(searchForm).query = $event,
                      class: "w-full",
                      placeholder: "Search reviews..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "category",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Category"),
                    createVNode(_component_Dropdown, {
                      id: "category",
                      modelValue: unref(searchForm).category,
                      "onUpdate:modelValue": ($event) => unref(searchForm).category = $event,
                      options: unref(categories),
                      optionLabel: "name",
                      optionValue: "id",
                      placeholder: "All Categories",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "rating",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Rating"),
                    createVNode(_component_Dropdown, {
                      id: "rating",
                      modelValue: unref(searchForm).rating,
                      "onUpdate:modelValue": ($event) => unref(searchForm).rating = $event,
                      options: ratingOptions,
                      optionLabel: "label",
                      optionValue: "value",
                      placeholder: "Any Rating",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "field" }, [
                    createVNode("label", {
                      for: "sort",
                      class: "block text-sm font-medium text-gray-700"
                    }, "Sort By"),
                    createVNode(_component_Dropdown, {
                      id: "sort",
                      modelValue: unref(searchForm).sort,
                      "onUpdate:modelValue": ($event) => unref(searchForm).sort = $event,
                      options: sortOptions,
                      optionLabel: "label",
                      optionValue: "value",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                createVNode("div", { class: "flex justify-end" }, [
                  createVNode(_component_Button, {
                    type: "submit",
                    loading: unref(isSearching),
                    label: "Search"
                  }, null, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(searchResults).length > 0) {
        _push(`<div><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(searchResults), (review) => {
          _push(ssrRenderComponent(_component_ReviewCard, {
            key: review.id,
            review
          }, null, _parent));
        });
        _push(`<!--]--></div><div class="mt-8 flex justify-center">`);
        _push(ssrRenderComponent(_component_Paginator, {
          first: paginatorFirst.value,
          "onUpdate:first": ($event) => paginatorFirst.value = $event,
          rows: 12,
          totalRecords: unref(totalResults),
          onPage: onPageChange,
          template: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        }, null, _parent));
        _push(`</div></div>`);
      } else if (unref(hasSearched)) {
        _push(ssrRenderComponent(_component_Card, { class: "text-center py-12" }, {
          content: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-gray-500"${_scopeId}><i class="pi pi-search text-4xl mb-4"${_scopeId}></i><p class="text-lg"${_scopeId}>No reviews found matching your criteria.</p><p class="mt-2"${_scopeId}>Try adjusting your search filters.</p></div>`);
            } else {
              return [
                createVNode("div", { class: "text-gray-500" }, [
                  createVNode("i", { class: "pi pi-search text-4xl mb-4" }),
                  createVNode("p", { class: "text-lg" }, "No reviews found matching your criteria."),
                  createVNode("p", { class: "mt-2" }, "Try adjusting your search filters.")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Toast, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=search-BTC6olmq.mjs.map
