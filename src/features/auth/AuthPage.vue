<script lang="ts" setup>
import { ref } from "vue";
import AuthForm from "./AuthForm.vue";
import type { TypeAuthFormValues } from "./AuthForm.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isLoginMode = ref(true);
const error = ref("");

function toggleLoginMode(event: Event) {
    event.preventDefault();
    isLoginMode.value = !isLoginMode.value;
    error.value = "";
}

function onSubmitForm(formData: TypeAuthFormValues) {
    error.value = "";
    if (isLoginMode.value) handleLogin(formData);
    else handleRegister(formData);
}

function handleLogin(formData: TypeAuthFormValues) {
    try {
        const user = authStore.loginUser(formData);
        if (user) router.push({ name: "dashboard" });
    } catch (err: any) {
        error.value = err.message;
    }
}

function handleRegister(formData: TypeAuthFormValues) {
    try {
        authStore.registerUser(formData);
        isLoginMode.value = true;
        alert("Pomyślnie utworzono nowego użytkownika.");
    } catch (err: any) {
        error.value = err.message;
    }
}
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-3 bg-light">
            <div class="card-body">
                <h2 class="card-title mb-2">
                    <span v-if="isLoginMode">Logowanie</span>
                    <span v-else>Rejestracja</span>
                </h2>
                <p class="card-subtitle text-danger" v-if="error">{{ error }}</p>
                <AuthForm @submit-form="onSubmitForm" />
                <a href="#" class="card-link" @click="toggleLoginMode">
                    <span v-if="isLoginMode">Utwórz konto</span>
                    <span v-if="!isLoginMode">Zaloguj się</span>
                </a>
            </div>
        </div>
    </div>
</template>
