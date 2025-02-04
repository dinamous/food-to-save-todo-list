// test/components/NavLink.test.js

import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import NavigationLink from "@/components/Sidebar/NavLink.vue";


const fakeRouter = {
  currentRoute: ref({ name: "Dashboard", path: "/" }),
};


vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => fakeRouter,

    RouterLink: {
      name: "RouterLink",
      template: "<a><slot /></a>",
    },
  };
});

describe("NavigationLink.vue", () => {

  beforeEach(() => {
    fakeRouter.currentRoute.value = { name: "Dashboard", path: "/" };
  });

  it("deve renderizar corretamente o label e o ícone", () => {
    const wrapper = mount(NavigationLink, {
      props: {
        link: "/dashboard",
        icon: "some-icon",
        label: "Dashboard",
        page: "Dashboard",
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {

          RouterLink: {
            name: "RouterLink",
            template: "<a><slot /></a>",
          },

          Icon: {
            name: "Icon",
            template: "<svg class=\"text-lg\"></svg>",
          },
        },
      },
    });


    expect(wrapper.text()).toContain("Dashboard");

    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });
});
