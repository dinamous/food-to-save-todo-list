import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { useRoute } from "vue-router";

import HeaderNavbar from "@/components/Sidebar/HeaderNavbar.vue";


vi.mock("vue-router", () => ({
  useRoute: () => ({
    path: "/",
  }),
  RouterLink: { template: "<a><slot /></a>" },
}));

describe("HeaderNavbar.vue", () => {
  it("deve renderizar o componente sem erros", () => {
    const wrapper = mount(HeaderNavbar, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn })
        ],
        stubs: {
          Icon: { template: "<svg></svg>" },
          NavLink: { template: "<div></div>" },
          AccountMenu: { template: "<div></div>" }
        },
      },
    });


    expect(wrapper.exists()).toBe(true);
  });
});
