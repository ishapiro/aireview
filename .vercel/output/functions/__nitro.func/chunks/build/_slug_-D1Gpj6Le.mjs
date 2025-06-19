import { _ as __nuxt_component_0 } from './nuxt-link-C9HRXqxW.mjs';
import { ref, withAsyncContext, computed, resolveComponent, mergeProps, withCtx, createTextVNode, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-fmUzjeAS.mjs';
import { u as useRoute, b as useSupabaseUser, c as useToast } from './server.mjs';
import { marked } from 'marked';
import { format } from 'date-fns';
import { u as useSupabaseClient } from './useSupabaseClient-BMmqXcE2.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    const review = ref(null);
    const comments = ref([]);
    const newComment = ref("");
    const hasUserStarred = ref(false);
    const isLoading = ref(true);
    console.log("[reviews/[slug]] Initial load - slug:", route.params.slug);
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`review-${route.params.slug}`, async () => {
      console.log("[reviews/[slug]] Fetching review data for slug:", route.params.slug);
      const { data: data2, error } = await client.from("reviews").select(`
      *,
      author:profiles(*),
      categories(*)
    `).eq("slug", route.params.slug).eq("is_published", true).single();
      console.log("[reviews/[slug]] Review fetch result:", { data: data2, error });
      if (error) {
        console.error("[reviews/[slug]] Error fetching review:", error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load review",
          life: 3e3
        });
        return null;
      }
      return data2;
    })), __temp = await __temp, __restore(), __temp);
    review.value = data.value;
    isLoading.value = false;
    console.log("[reviews/[slug]] Review value after assignment:", review.value);
    const { data: commentsData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`comments-${route.params.slug}`, async () => {
      var _a, _b;
      console.log("[reviews/[slug]] Fetching comments for review:", (_a = review.value) == null ? void 0 : _a.id);
      const { data: data2, error } = await client.from("comments").select(`
      *,
      author:profiles(*)
    `).eq("review_id", (_b = review.value) == null ? void 0 : _b.id).order("created_at", { ascending: false });
      console.log("[reviews/[slug]] Comments fetch result:", { data: data2, error });
      return data2;
    })), __temp = await __temp, __restore(), __temp);
    comments.value = commentsData.value;
    const renderedContent = computed(() => {
      var _a;
      return marked(((_a = review.value) == null ? void 0 : _a.content) || "");
    });
    const formatDate = (date) => {
      return format(new Date(date), "MMM d, yyyy");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      var _a, _b;
      const _component_ProgressSpinner = resolveComponent("ProgressSpinner");
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto px-4 py-8" }, _attrs))}>`);
      if (isLoading.value) {
        _push(`<div class="flex justify-center items-center min-h-[400px]">`);
        _push(ssrRenderComponent(_component_ProgressSpinner, null, null, _parent));
        _push(`</div>`);
      } else if (!review.value) {
        _push(`<div class="text-center min-h-[400px] flex flex-col justify-center"><h2 class="text-2xl font-bold text-gray-900 mb-4">Review Not Found</h2><p class="text-gray-600 mb-8">This review may have been removed or is not published.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "text-blue-600 hover:text-blue-800"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Return to Home `);
            } else {
              return [
                createTextVNode(" Return to Home ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="bg-white rounded-lg shadow-lg p-6"><div class="mb-8"><h1 class="text-4xl font-bold text-gray-900 mb-4">${ssrInterpolate(review.value.title)}</h1><div class="flex items-center justify-between mb-6"><div class="flex items-center"><img${ssrRenderAttr("src", review.value.author.avatar_url || "/default-avatar.svg")}${ssrRenderAttr("alt", review.value.author.full_name)} class="w-10 h-10 rounded-full mr-3 bg-gray-100"><div><div class="font-medium text-gray-900">${ssrInterpolate(review.value.author.full_name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(formatDate(review.value.created_at))} `);
        if (review.value.updated_at !== review.value.created_at) {
          _push(`<span> (Updated ${ssrInterpolate(formatDate(review.value.updated_at))}) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center text-sm text-gray-500 space-x-4 mt-2"><span><i class="pi pi-eye mr-1"></i> ${ssrInterpolate(review.value.views_count)} views </span><span><i class="pi pi-thumbs-up mr-1"></i> ${ssrInterpolate(review.value.helpful_count)} found helpful </span></div></div></div><div class="flex items-center">`);
        if (review.value.rating > 1) {
          _push(`<div class="star-rating text-xl mr-4"><i class="pi pi-star-fill mr-1"></i> ${ssrInterpolate(review.value.rating)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(user)) {
          _push(`<button class="${ssrRenderClass([{ "bg-yellow-100": hasUserStarred.value }, "btn-secondary"])}"><i class="pi pi-star mr-1"></i> ${ssrInterpolate(hasUserStarred.value ? "Starred" : "Star")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex flex-wrap gap-2 mb-6"><!--[-->`);
        ssrRenderList(review.value.categories, (category) => {
          _push(`<span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">${ssrInterpolate(category.name)}</span>`);
        });
        _push(`<!--]--></div>`);
        if (review.value.ai_generated) {
          _push(`<div class="mb-6"><span class="text-blue-600"><i class="pi pi-robot mr-1"></i> This review was created with AI assistance </span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="prose prose-lg max-w-none mb-12"><div>${(_a2 = unref(renderedContent)) != null ? _a2 : ""}</div></div>`);
        if (((_a = unref(user)) == null ? void 0 : _a.id) === ((_b = review.value) == null ? void 0 : _b.user_id)) {
          _push(`<div class="mb-8 flex justify-end">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/reviews/${review.value.id}`,
            class: "btn-secondary"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="pi pi-pencil mr-2"${_scopeId}></i> Edit Review `);
              } else {
                return [
                  createVNode("i", { class: "pi pi-pencil mr-2" }),
                  createTextVNode(" Edit Review ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="border-t pt-8"><h2 class="text-2xl font-bold text-gray-900 mb-6">Comments</h2>`);
        if (unref(user)) {
          _push(`<div class="mb-8"><textarea class="input-field mb-4" rows="4" placeholder="Write a comment...">${ssrInterpolate(newComment.value)}</textarea><button class="btn-primary"${ssrIncludeBooleanAttr(!newComment.value.trim()) ? " disabled" : ""}> Post Comment </button></div>`);
        } else {
          _push(`<div class="mb-8 text-center"><button class="btn-primary border-none"> Sign in to comment </button></div>`);
        }
        _push(`<div class="space-y-6"><!--[-->`);
        ssrRenderList(comments.value, (comment) => {
          _push(`<div class="bg-gray-50 rounded-lg p-6"><div class="flex items-center mb-4"><img${ssrRenderAttr("src", comment.author.avatar_url || "/default-avatar.svg")}${ssrRenderAttr("alt", comment.author.full_name)} class="w-8 h-8 rounded-full mr-3 bg-gray-100"><div><div class="font-medium text-gray-900">${ssrInterpolate(comment.author.full_name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(formatDate(comment.created_at))}</div></div></div><p class="text-gray-700">${ssrInterpolate(comment.content)}</p></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reviews/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-D1Gpj6Le.mjs.map
