import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import UserTable from "@/components/form/UserTable.vue";


describe("UserTable.vue", () => {
  it("deve renderizar corretamente", async () => {

    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: [{ id: "1", name: "João Silva", email: "joao@email.com" }],
              currentPage: 1,
              pageSize: 5,
            },
            createSpy: vi.fn,
          }),
        ],
      },
    });


    expect(wrapper.find("table").exists()).toBe(true);
    expect(wrapper.findAll("tr").length).toBe(2);
  });

  it("deve abrir o modal de adicionar usuário ao clicar no botão", async () => {
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: [{ id: "1", name: "João Silva", email: "joao@email.com" }],
              currentPage: 1,
              pageSize: 5,
            },
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const addButton = wrapper.find("button");
    await addButton.trigger("click");


    expect(wrapper.vm.isAddModalOpen).toBe(true);
  });


  it("deve exibir mensagem quando não houver usuários", async () => {
    const wrapper = mount(UserTable, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: [],
              currentPage: 1,
              pageSize: 5,
            },
            createSpy: vi.fn,
          }),
        ],
      },
    });


    expect(wrapper.text()).toContain("Nenhum usuário encontrado.");
  });
});
