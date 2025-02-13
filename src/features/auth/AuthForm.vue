<template>
    <form @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label class="form-label">Login</label>
            <input
                type="email"
                class="form-control"
                placeholder="Provide login."
                required
                v-model.trim="formData.login"
            />
        </div>
        <div class="mb-3">
            <label class="form-label">Password</label>
            <input
                type="password"
                class="form-control"
                placeholder="Provide password."
                required
                v-model.trim="formData.password"
            />
        </div>
        <button class="btn btn-success">Submit</button>
    </form>
</template>

<script lang="ts" setup>
import { reactive, defineEmits } from "vue";

export type TypeAuthFormValues = {
    login: string;
    password: string;
};

const emits = defineEmits<{
    (event: "submit-form", payload: TypeAuthFormValues): void;
}>();

const formData = reactive<TypeAuthFormValues>({
    login: "",
    password: "",
});

function handleSubmit() {
    if (!formData.login || !formData.password) return;
    emits("submit-form", formData);
    formData.password = "";
}
</script>
