import { ref, computed } from "vue";
import { defineStore } from "pinia";

type TypeUserData = {
    id: string;
    login: string;
    password: string;
};

function getUsersFromLocalStorage(): TypeUserData[] {
    const users = localStorage.getItem("users");
    if (!users) return [];
    return JSON.parse(users);
}

export const useAuthStore = defineStore("auth", () => {
    // const user = ref<Omit<TypeUserData, 'password'> | null>(null)
    const user = ref<Omit<TypeUserData, 'password'> | null>({
      login: 'kblonski02@gmail.com',
      id: '1'
    })

    function registerUser({ login, password }: { login: string, password: string}) {
        const users = getUsersFromLocalStorage();

        const userExist = users.find(
            (user) =>
                user.login.toLocaleLowerCase().trim() === login.toLocaleLowerCase().trim()
        );
        if (userExist) throw new Error("User arleady exist in database.");

        const id = new Date().toDateString();
        users.push({ id, login, password });
        localStorage.setItem("users", JSON.stringify(users));
    }

    function loginUser({ login, password }: { login: string; password: string }) {
        const users = getUsersFromLocalStorage();
        const userExist = users.find(
            (user) =>
                user.login.toLocaleLowerCase().trim() === login.toLocaleLowerCase().trim()
        );

        if (!userExist) throw new Error("User don't exist in database.");
        if (userExist.password !== password) throw new Error("Invalid password.");

        const { password : userPassword, ...userWithoutPassword } = userExist;
        user.value = userWithoutPassword;
        return userWithoutPassword;
    }

    return { registerUser, loginUser, user };
});
