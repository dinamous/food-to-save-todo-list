import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import UserFormModal from "@/components/form/UserFormModal.vue";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useUsersStore } from "@/stores/users";
describe("UserFormModal.vue", () => {


  it("deve exibir título ao abrir o modal", async () => {
    const wrapper = mount(UserFormModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Dialog: { template: "<div><slot /></div>" },
          DialogContent: { template: "<div><slot /></div>" },
          DialogHeader: { template: "<div><slot /></div>" },
          DialogTitle: { template: "<h2><slot /></h2>" },
          Input: { template: "<input />" },
          Button: { template: "<button><slot /></button>" },
        },
      },
      props: { modelValue: false }, // Começa fechado
    });

    // Atualiza a prop para abrir o modal
    await wrapper.setProps({ modelValue: true });

    expect(wrapper.find("h2").exists()).toBe(true); // Agora deve exibir o título
  });

  it("deve exibir modal quando modelValue for true", async () => {
    const wrapper = mount(UserFormModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Dialog: { template: "<div><slot /></div>" },
          DialogContent: { template: "<div><slot /></div>" },
          DialogHeader: { template: "<div><slot /></div>" },
          DialogTitle: { template: "<h2><slot /></h2>" },
          Input: { template: "<input />" },
          Button: { template: "<button><slot /></button>" },
        },
      },
      props: {
        modelValue: true, // Modal começa aberto
      },
    });

    expect(wrapper.find("h2").text()).toBe("Novo Usuário");
  });



  it("deve chamar a ação de salvar usuário ao submeter", async () => {
    const user = { id: "1", name: "João Silva", email: "joao@email.com" };
    const wrapper = mount(UserFormModal, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Dialog: { template: "<div><slot /></div>" },
          DialogContent: { template: "<div><slot /></div>" },
          DialogHeader: { template: "<div><slot /></div>" },
          DialogTitle: { template: "<h2><slot /></h2>" },
          Input: { template: "<input />" },
          Button: { template: "<button><slot /></button>" },
        },
      },
      props: {
        modelValue: true,
        user,
      },
    });

    const usersStore = useUsersStore();
    usersStore.updateUser = vi.fn();

    await wrapper.find("button").trigger("click");

    expect(usersStore.updateUser).toHaveBeenCalledWith(user);
  });
});
