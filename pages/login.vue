<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

// Инициализация VeeValidate формы с использованием yup схемы валидации
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: yup.object({
    name: yup
        .string(),
    password: yup
        .string()
        .min(8)
        .max(256)
        .required(),
    email: yup
        .string()
        .email()
        .required(),
  }),
});

// Ссылки на значения полей формы
// const email = ref('');
// const password = ref('');
// const name = ref('');

const [password, passwordAttrs] = defineField('password')
const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')

const isLoadingStore = useIsLoadingStore();
const authStore = useAuthStore();
const router = useRouter();

// Функция для входа
const login = async () => {
  isLoadingStore.set(true);

  try {
    await account.createEmailPasswordSession(email.value, password.value);
    const response = await account.get();

    if (response) {
      authStore.set({
        email: response.email,
        name: response.name,
        status: response.status,
      });
      Swal.fire({
        icon: 'success',
        title: `Welcome ${response.name}!`,
        text: 'You are logged!',
        showConfirmButton: false,
        timer: 3500
      });
      await router.push('/');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
      console.log('No response');
    }

    email.value = '';
    password.value = '';
    name.value = '';

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: `${error instanceof Error ? error.message : 'An error occurred'}`
    });
  } finally {
    isLoadingStore.set(false);
  }
};

// Функция для регистрации
const register = async () => {
  console.log('register', {
    email: email.value,
    password: password.value,
    name: name.value,
  });
  await account.create(uuid(), email.value, password.value, name.value);
  await login();
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen w-full">
    <div class="rounded bg-sidebar w-1/4 p-5">
      <h1 class="text-2xl font-bold text-center mb-5">Login</h1>

      <form @submit.prevent="handleSubmit(login)">
        <UiInput
            placeholder="Email"
            type="email"
            class="mt-3"
            v-model="email"
            v-bind="emailAttrs"
        />
        <pre class="error">{{ errors.email }}</pre>

        <UiInput
            placeholder="Password"
            type="password"
            class="mt-3"
            v-model="password"
            v-bind="passwordAttrs"
        />
        <pre class="error">{{ errors.password }}</pre>

        <UiInput
            placeholder="Name"
            type="text"
            class="mt-3"
            v-model="name"
            v-bind="nameAttrs"
        />
        <pre class="error">{{ errors.name }}</pre>

        <div class="flex items-center justify-center gap-5 mt-4">
          <UiButton type="submit" @click="login">Login</UiButton>
          <UiButton type="button" @click="register">Register</UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.8rem;
}
</style>
