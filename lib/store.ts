import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BuffetCategory,
  User,
  RestaurantSettings,
  Organization,
} from "./types";

interface CategoryStore {
  categories: BuffetCategory[];
  addCategory: (
    category: Omit<BuffetCategory, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCategory: (id: string, category: Partial<BuffetCategory>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => BuffetCategory | undefined;
}

interface UserStore {
  users: User[];
  addUser: (
    user: Omit<User, "id" | "createdAt" | "updatedAt" | "qrCode" | "checkedIn">
  ) => string;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  checkInUser: (id: string) => void;
}

interface SettingsStore {
  settings: RestaurantSettings;
  updateSettings: (settings: Partial<RestaurantSettings>) => void;
}

interface OrganizationStore {
  organization: Organization[];
  addOrganization: (
    organization: Omit<Organization, "id" | "name" | "email" | "phone">
  ) => void;
  updateOrganization: () => void;
  deleteOrganization: () => void;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      addCategory: (category) => {
        const newCategory: BuffetCategory = {
          ...category,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates, updatedAt: new Date() } : cat
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },
      getCategoryById: (id) => {
        return get().categories.find((cat) => cat.id === id);
      },
    }),
    {
      name: "category-store",
    }
  )
);

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: crypto.randomUUID(),
          checkedIn: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return newUser.id;
      },
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, ...updates, updatedAt: new Date() }
              : user
          ),
        }));
      },
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },
      getUserById: (id) => {
        return get().users.find((user) => user.id === id);
      },
      checkInUser: (id) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, checkedIn: true, updatedAt: new Date() }
              : user
          ),
        }));
      },
    }),
    {
      name: "user-store",
    }
  )
);

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        name: "Akairis",
        contactInfo: "+1 (555) 123-4567",
        theme: "light",
      },
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: "settings-store",
    }
  )
);

export const organizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      organization: [],
      addOrganization: (organization) => {
        set((state) => ({
          organization: [...state.organization, organization],
        }));

        console.log("organization added", organization);
      },
      updateOrganization: (id: number, data: Organization) => {
        console.log("update function working")
        set((state) => {
          const updated = [...state.organization]; // clone array
          const index = updated.findIndex((org) => org.id === id);
          if (index !== -1) {
            updated.splice(index, 1, { ...updated[index], ...data });
          }
        });
      },
      deleteOrganization: () => {
        // logic here
      },
    }),
    {
      name: "organization-store",
    }
  )
);
